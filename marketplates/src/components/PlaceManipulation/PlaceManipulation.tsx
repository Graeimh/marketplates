import { useEffect, useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./PlaceManipulation.module.scss";
import { IPlace } from "../../common/types/placeTypes/placeTypes.js";
import PlaceManipulationItem from "../PlaceManipulationItem/PlaceManipulationItem.js";

function PlaceManipulation() {
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [placeList, setPlaceList] = useState<IPlace[]>([]);
  const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>(
    []
  );
  const [isAllSelected, setIsAllSelected] = useState(false);

  async function getAllPlaces() {
    try {
      const allPlaces = await APIService.fetchAllPlaces();
      setPlaceList(allPlaces.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getAllPlaces();
  }, []);

  function manageDeletionList(id: string) {
    const foundIndex = primedForDeletionList.indexOf(id);
    if (foundIndex === -1) {
      setPrimedForDeletionList([...primedForDeletionList, id]);
    } else {
      setPrimedForDeletionList(
        primedForDeletionList.filter((applianceId) => applianceId !== id)
      );
    }
  }

  function selectAllTags() {
    if (
      (!isAllSelected && primedForDeletionList.length === 0) ||
      primedForDeletionList.length !== placeList.length
    ) {
      setPrimedForDeletionList(placeList.map((place) => place._id));
    } else {
      setPrimedForDeletionList([]);
    }
    setIsAllSelected(!isAllSelected);
  }

  function cancelSelection() {
    setPrimedForDeletionList([]);
  }

  async function deletePrimedForDeletion() {
    try {
      const responseForDelete = APIService.deletePlacesByIds(
        primedForDeletionList
      );
      setResponseMessage(responseForDelete.message);

      console.log(
        `Successfully deleted ${primedForDeletionList.length} appliances`
      );
      setPrimedForDeletionList([]);
      getAllPlaces();
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendDeleteTagCall(id: string) {
    try {
      const response = await APIService.deletePlaceById(id);
      getAllPlaces();
      setResponseMessage(response.message);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Place manipulation</h1>
      <div className={styles.registerContainer}></div>
      <button type="button" onClick={() => deletePrimedForDeletion()}>
        Delete {primedForDeletionList.length} places
      </button>
      {primedForDeletionList.length !== placeList.length && (
        <button type="button" onClick={() => selectAllTags()}>
          Select all ({placeList.length}) places
        </button>
      )}
      <button type="button" onClick={() => cancelSelection()}>
        Cancel selection{" "}
      </button>
      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {placeList.length > 0 &&
        placeList.map((place) => (
          <PlaceManipulationItem
            place={place}
            primeForDeletion={manageDeletionList}
            uponDeletion={sendDeleteTagCall}
            key={place._id}
            IsSelected={primedForDeletionList.indexOf(place._id) !== -1}
          />
        ))}
    </>
  );
}

export default PlaceManipulation;
