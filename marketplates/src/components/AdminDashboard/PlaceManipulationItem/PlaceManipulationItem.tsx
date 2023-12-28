import { useContext, useEffect, useState } from "react";
import * as tagService from "../../../services/tagService.js";
import styles from "./PlaceManipulationItem.module.scss";
import Tag from "../../MapGenerationComponents/Tag/index.js";
import { IPlace } from "../../../common/types/placeTypes/placeTypes.js";
import { ITag } from "../../../common/types/tagTypes/tagTypes.js";
import { useNavigate } from "react-router-dom";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";

function PlaceManipulationItem(props: {
  place: IPlace;
  uponDeletion: (placeId: string) => void;
  primeForDeletion: (placeId: string) => void;
  IsSelected: boolean;
}) {
  // Setting states
  // Error message display
  const [error, setError] = useState(null);
  // Response message display
  const [responseMessage, setResponseMessage] = useState("");
  // Gives the informaton whether or not the place belongs to the primed for deletion list
  const [isPrimed, setIsPrimed] = useState(false);
  // Contains the tags associated with the place
  const [placeTagsList, setSpecificPlaceTags] = useState<ITag[]>([]);
  const navigate = useNavigate();

  const value = useContext(UserContext);

  function handleDeletePrimer() {
    props.primeForDeletion(props.place._id ? props.place._id : "");
    setIsPrimed(!isPrimed);
  }

  function handleDelete() {
    props.uponDeletion(props.place._id ? props.place._id : "");
  }

  async function getSpecificPlaceTags() {
    try {
      if (checkPermission(value.status, UserType.Admin)) {
        const placeTags = await tagService.fetchTagsByIds(props.place.tagsList);
        setSpecificPlaceTags(placeTags.data);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getSpecificPlaceTags();
  }, []);

  return (
    <>
      <h4>Place name : {props.place.name}</h4>
      <div
        className={
          props.IsSelected
            ? styles.primedContainer
            : styles.placeManipulationItemContainer
        }
      >
        <button
          type="button"
          className={props.IsSelected ? styles.primedButton : ""}
          onClick={() => handleDeletePrimer()}
        >
          {props.IsSelected ? "●" : "○"}
        </button>
        <button type="button" onClick={handleDelete}>
          Delete place
        </button>
        <ul>
          <li>Name : {props.place.name}</li>
          <li>Address : {props.place.address}</li>
          <li>Description : {props.place.description}</li>
          <li>
            <ul>
              Coordinates :
              <li>latitude :{props.place.gpsCoordinates.latitude}</li>
              <li>longitude :{props.place.gpsCoordinates.longitude}</li>
            </ul>
          </li>
          {placeTagsList && (
            <li>
              Tags :
              {placeTagsList.map((tag) => (
                <Tag
                  customStyle={{
                    color: tag.nameColor,
                    backgroundColor: tag.backgroundColor,
                  }}
                  tagName={tag.name}
                  isTiny={false}
                />
              ))}
            </li>
          )}
        </ul>
        <button
          type="button"
          onClick={() => navigate(`/editplace/${props.place._id}`)}
        >
          Edit place
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
    </>
  );
}

export default PlaceManipulationItem;
