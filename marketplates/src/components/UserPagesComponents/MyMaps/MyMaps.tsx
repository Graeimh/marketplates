import { useEffect, useState } from "react";
import * as mapsService from "../../../services/mapService.js";
import { useNavigate } from "react-router-dom";
import { IMaps } from "../../../common/types/mapTypes/mapTypes.js";

function MyPlaces() {
  const [userMapsList, setUserMapsList] = useState<IMaps[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function getUserMaps() {
    try {
      const userMaps = await mapsService.fetchUserMaps();
      setUserMapsList(userMaps.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUserMapDeleted(placeId: string) {
    try {
      await mapsService.deleteMapById(placeId);
      getUserMaps();
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
