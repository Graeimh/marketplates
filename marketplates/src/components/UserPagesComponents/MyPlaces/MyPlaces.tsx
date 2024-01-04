import { useContext, useEffect, useState } from "react";
import * as placeService from "../../../services/placeService.js";
import styles from "./MyPlaces.module.scss";
import { IPlace } from "../../../common/types/placeTypes/placeTypes.js";
import { useNavigate } from "react-router-dom";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import { Helmet } from "react-helmet";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MyPlaces() {
  // Setting states
  // Array of user owned places meant to be displayed, edited or deleted
  const [userPlacesList, setUserPlacesList] = useState<IPlace[]>([]);

  // Error message display
  const [error, setError] = useState("");

  const value = useContext(UserContext);

  const navigate = useNavigate();

  async function getUserPlaces() {
    try {
      if (checkPermission(value.status, UserType.User)) {
        const userPlaces = await placeService.fetchUserPlaces();
        setUserPlacesList(userPlaces.data);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUserPlaceDeleted(placeId: string) {
    try {
      if (checkPermission(value.status, UserType.User)) {
        await placeService.deletePlaceById(placeId);
        getUserPlaces();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getUserPlaces();
  }, []);
  return (
    <>
      <Helmet>
        <title>My places</title>
        <link rel="canonical" href="http://localhost:5173/myplaces" />
      </Helmet>

      <h1>Manage your businesses</h1>

      {userPlacesList ? (
        <button
          onClick={() => {
            navigate("/createplace");
          }}
        >
          Register a business
        </button>
      ) : (
        <article>
          <h1>No businesses ?</h1>
          <button
            onClick={() => {
              navigate("/createplace");
            }}
          >
            Register your first business
          </button>
        </article>
      )}
      <div id={styles.itemListContainer}>
        {userPlacesList &&
          userPlacesList.map((place) => (
            <article className={styles.userItemContainer} key={place.name}>
              <section className={styles.itemDataContainer}>
                <h2>{place.name}</h2>
                <ul>
                  <li className={styles.itemDataField}>Description</li>
                  <li>{place.description}</li>
                  <li className={styles.itemDataField}>Address</li>
                  <li>{place.address}</li>
                </ul>
              </section>
              <section className={styles.itemButtonContainer}>
                <button
                  type="button"
                  onClick={() => navigate(`/editplace/${place._id}`)}
                >
                  <FontAwesomeIcon icon={solid("pen-to-square")} />
                  Edit place
                </button>
                <button
                  type="button"
                  onClick={() => {
                    place._id
                      ? handleUserPlaceDeleted(place._id)
                      : setError("The place has been deleted already");
                  }}
                >
                  <FontAwesomeIcon icon={solid("trash-can")} />
                  Delete place
                </button>
              </section>
            </article>
          ))}
      </div>
    </>
  );
}

export default MyPlaces;
