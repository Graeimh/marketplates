import { useContext, useEffect, useState } from "react";
import * as mapsService from "../../../services/mapService.js";
import { useNavigate } from "react-router-dom";
import { IMaps } from "../../../common/types/mapTypes/mapTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";

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
      <h1>Hi! Here are your Maps!</h1>
      <button
        onClick={() => {
          navigate("/createmap");
        }}
      >
        Create a map
      </button>
      <ul>
        {userMapsList &&
          userMapsList.map((map) => (
            <li key={map.name}>
              {map.name}
              <button
                type="button"
                onClick={() => navigate(`/editmap/${map._id}`)}
              >
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
                Delete map
              </button>
            </li>
          ))}
      </ul>
    </>
  );
}

export default MyPlaces;
