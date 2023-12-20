import { useEffect, useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./PlaceManipulationItem.module.scss";
import Tag from "../Tag/index.js";
import { IPlace } from "../../common/types/placeTypes/placeTypes.js";
import { ITag } from "../../common/types/tagTypes/tagTypes.js";
import { useNavigate } from "react-router-dom";

function PlaceManipulationItem(props: {
  place: IPlace;
  uponDeletion: (userId: string) => void;
  primeForDeletion: (userId: string) => void;
  IsSelected: boolean;
}) {
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isPrimed, setIsPrimed] = useState(false);
  const [placeTagsList, setSpecificPlaceTags] = useState<ITag[]>([]);
  const navigate = useNavigate();

  function handleDeletePrimer() {
    props.primeForDeletion(props.place._id);
    setIsPrimed(!isPrimed);
  }

  function handleDelete() {
    props.uponDeletion(props.place._id);
  }

  async function getSpecificPlaceTags() {
    try {
      const placeTags = await APIService.fetchTagsByIds(props.place.tagsList);
      setSpecificPlaceTags(placeTags.data);
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
