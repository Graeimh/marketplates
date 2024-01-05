import { useContext, useEffect, useState } from "react";
import * as mapsService from "../../../services/mapService.js";
import stylesItem from "../../../common/styles/UserItems.module.scss";
import styles from "./MyMaps.module.scss";
import { useNavigate } from "react-router-dom";
import { IMaps } from "../../../common/types/mapTypes/mapTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { Helmet } from "react-helmet";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MyPlaces() {
  // Setting states
  // Array of user owned maps meant to be edited or deleted
  const [userMapsList, setUserMapsList] = useState<IMaps[]>([]);

  // Error message display
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const value = useContext(UserContext);

  async function getUserMaps() {
    try {
      if (checkPermission(value.status, UserType.User)) {
        const userMaps = await mapsService.fetchUserMaps();
        setUserMapsList(userMaps.data);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUserMapDeleted(placeId: string) {
    try {
      if (checkPermission(value.status, UserType.User)) {
        await mapsService.deleteMapById(placeId);
        getUserMaps();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getUserMaps();
  }, []);
  return (
    <>
      <Helmet>
        <title>My maps</title>
        <link rel="canonical" href="http://localhost:5173/mymaps" />
      </Helmet>
      <article id={stylesItem.itemContainer}>
        <h1>Manage your maps</h1>
        <section id={stylesItem.itemCreationContainer}>
          {userMapsList.length > 0 ? (
            <button
              onClick={() => {
                navigate("/createmap");
              }}
            >
              Create a map
            </button>
          ) : (
            <>
              <h2>No map of your own yet?</h2>
              <button
                onClick={() => {
                  navigate("/createmap");
                }}
              >
                Create your first map here
              </button>
            </>
          )}
        </section>

        <div id={stylesItem.itemListContainer}>
          {userMapsList &&
            userMapsList.map((map) => (
              <article className={stylesItem.userItemContainer} key={map.name}>
                <section className={stylesItem.itemDataContainer}>
                  <h2>{map.name}</h2>
                  <p className={styles.mapDescription}>{map.description}</p>
                </section>
                <section className={stylesItem.itemButtonContainer}>
                  <button
                    type="button"
                    onClick={() => navigate(`/editmap/${map._id}`)}
                  >
                    <FontAwesomeIcon icon={solid("pen-to-square")} />
                    Edit map
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      map._id
                        ? handleUserMapDeleted(map._id)
                        : setError("The map has been deleted already");
                    }}
                  >
                    <FontAwesomeIcon icon={solid("trash-can")} />
                    Delete map
                  </button>
                </section>
              </article>
            ))}
        </div>
      </article>
    </>
  );
}

export default MyPlaces;
