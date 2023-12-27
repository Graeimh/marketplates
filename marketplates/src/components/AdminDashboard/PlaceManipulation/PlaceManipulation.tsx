import { useEffect, useState } from "react";
import * as placeService from "../../../services/placeService.js";
import styles from "./PlaceManipulation.module.scss";
import { IPlace } from "../../../common/types/placeTypes/placeTypes.js";
import PlaceManipulationItem from "../PlaceManipulationItem/PlaceManipulationItem.js";

function PlaceManipulation() {
  // Setting states
  // Error message display
  const [error, setError] = useState(null);

  // Response message display
  const [responseMessage, setResponseMessage] = useState("");

  // Array of places meant to be displayed, edited or deleted
  const [placeList, setPlaceList] = useState<IPlace[]>([]);

  // Array of place by Ids meant to be deleted upon pressing the delete button
  const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>(
    []
  );

  // Gives the information whether or not the place belongs to the primed for deletion list
  const [isAllSelected, setIsAllSelected] = useState(false);

  async function getAllPlaces() {
    try {
      // Fetching all existing places
      const allPlaces = await placeService.fetchAllPlaces();
      setPlaceList(allPlaces.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getAllPlaces();
  }, []);

  function manageDeletionList(id: string) {
    // Upon clicking on the button to select, we check if the id was already part of the primed for deletion list
    const foundIndex = primedForDeletionList.indexOf(id);
    if (foundIndex === -1) {
      // If it isn't, we add it in
      setPrimedForDeletionList([...primedForDeletionList, id]);
    } else {
      // If it is, we filter it out
      setPrimedForDeletionList(
        primedForDeletionList.filter((applianceId) => applianceId !== id)
      );
    }
  }

  function selectAllPlaces() {
    // We check if some places were already selected and we add them to the primed for deletion list
    if (
      (!isAllSelected && primedForDeletionList.length === 0) ||
      primedForDeletionList.length !== placeList.length
    ) {
      setPrimedForDeletionList(placeList.map((place) => place._id));
    } else {
      // If all the places were already selected, the primed for deletion list is emptied instead
      setPrimedForDeletionList([]);
    }
    setIsAllSelected(!isAllSelected);
  }

  function cancelSelection() {
    setPrimedForDeletionList([]);
  }

  async function deletePrimedForDeletion() {
    try {
      // Delete all the places whose ids are within the primed for deletion list
      const responseForDelete = await placeService.deletePlacesByIds(
        primedForDeletionList
      );
      setPrimedForDeletionList([]);
      // Once the deletion is made, pull the remaining places from the database
      getAllPlaces();
      setResponseMessage(responseForDelete.message);
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendDeletePlaceCall(id: string) {
    try {
      // Delete a singular place
      const response = await placeService.deletePlaceById(id);
      // Once the deletion is made, pull the remaining places from the database
      setPrimedForDeletionList([]);
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
        <button type="button" onClick={() => selectAllPlaces()}>
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
            uponDeletion={sendDeletePlaceCall}
            key={place._id}
            IsSelected={primedForDeletionList.indexOf(place._id) !== -1}
          />
        ))}
    </>
  );
}

export default PlaceManipulation;
