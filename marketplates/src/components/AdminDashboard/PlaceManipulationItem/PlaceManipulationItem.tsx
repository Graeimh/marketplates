import { useContext, useEffect, useState } from "react";
import * as tagService from "../../../services/tagService.js";
import styles from "./PlaceManipulationItem.module.scss";
import formStyles from "../../../common/styles/Forms.module.scss";
import itemStyles from "../../../common/styles/ManipulationItem.module.scss";
import stylesUserDashboard from "../../../common/styles/Dashboard.module.scss";
import Tag from "../../MapGenerationComponents/Tag/index.js";
import { IPlace } from "../../../common/types/placeTypes/placeTypes.js";
import { ITag } from "../../../common/types/tagTypes/tagTypes.js";
import { useNavigate } from "react-router-dom";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";

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
      <article
        className={`
          ${
            props.IsSelected
              ? itemStyles.primedContainer
              : itemStyles.itemContainer
          } ${formStyles.formContainer}
          ${styles.placeDashboardContainer}
            `}
      >
        <section>
          <h4>{props.place.name}</h4>
          <button
            type="button"
            className={props.IsSelected ? itemStyles.primedButton : ""}
            onClick={() => handleDeletePrimer()}
          >
            {props.IsSelected ? (
              <FontAwesomeIcon icon={regular("trash-can")} />
            ) : (
              <FontAwesomeIcon icon={solid("trash-can-arrow-up")} />
            )}
            {props.IsSelected ? " Cancel selection" : " Select"}
          </button>
          <span className={stylesUserDashboard.deleteButton}>
            <button type="button" onClick={handleDelete}>
              <FontAwesomeIcon icon={solid("shop")} />
              <FontAwesomeIcon icon={solid("xmark")} />
              Delete place
            </button>
          </span>
        </section>
        <section>
          <h5>Address :</h5>
          {props.place.address}
          <h5>Description :</h5>
          {props.place.description}
          <h5>Coordinates :</h5>
          <ul>
            <li>latitude :{props.place.gpsCoordinates.latitude}</li>
            <li>longitude :{props.place.gpsCoordinates.longitude}</li>
          </ul>
          <h5>Tags :</h5>
          <ul>
            {placeTagsList && (
              <li>
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
        </section>
        <div className={formStyles.finalButtonContainer}>
          <button
            type="button"
            onClick={() => navigate(`/editplace/${props.place._id}`)}
          >
            Edit place
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </article>
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
    </>
  );
}

export default PlaceManipulationItem;
