import { useContext, useEffect, useState } from "react";
import * as placeService from "../../../services/placeService.js";
import { IPlace } from "../../../common/types/placeTypes/placeTypes.js";
import { useNavigate } from "react-router-dom";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";

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
      <h1>Hi! Here are your places!</h1>
      <button
        onClick={() => {
          navigate("/createplace");
        }}
      >
        Create a place
      </button>
      <ul>
        {userPlacesList &&
          userPlacesList.map((place) => (
            <li key={place.name}>
              {place.name}
              <button
                type="button"
                onClick={() => navigate(`/editplace/${place._id}`)}
              >
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
                Delete place
              </button>
            </li>
          ))}
      </ul>
    </>
  );
}

export default MyPlaces;
