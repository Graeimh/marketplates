import { useContext, useEffect, useState } from "react";
import * as placeService from "../../../services/placeService.js";
import styles from "./PlaceManipulation.module.scss";
import { IPlace } from "../../../common/types/placeTypes/placeTypes.js";
import PlaceManipulationItem from "../PlaceManipulationItem/PlaceManipulationItem.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { Helmet } from "react-helmet";

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

  // Holds the value used to filter the name of places when an admin searches for a particular place
  const [placeQuery, setPlaceQuery] = useState("");

  const value = useContext(UserContext);
  async function getAllPlaces() {
    try {
      // Fetching all existing places
      if (checkPermission(value.status, UserType.Admin)) {
        const allPlaces = await placeService.fetchAllPlaces();
        setPlaceList(allPlaces.data);
      }
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
      if (checkPermission(value.status, UserType.Admin)) {
        // Delete all the places whose ids are within the primed for deletion list
        const responseForDelete = await placeService.deletePlacesByIds(
          primedForDeletionList
        );
        setPrimedForDeletionList([]);
        // Once the deletion is made, pull the remaining places from the database
        getAllPlaces();
        setResponseMessage(responseForDelete.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendDeletePlaceCall(id: string) {
    try {
      if (checkPermission(value.status, UserType.Admin)) {
        // Delete a singular place
        const response = await placeService.deletePlaceById(id);
        // Once the deletion is made, pull the remaining places from the database
        setPrimedForDeletionList([]);
        getAllPlaces();
        setResponseMessage(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredPlaceList = placeList.filter((place) =>
    new RegExp(placeQuery, "i").test(place.name)
  );
  const displayedTagList =
    placeQuery.length > 0 ? filteredPlaceList : placeList;

  return (
    <>
      <Helmet>
        <title>Dashboard - Places</title>
        <link rel="canonical" href="http://localhost:5173/dashboard/places" />
      </Helmet>

      <h1>Place manipulation</h1>
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

      <label>Search for a place : </label>
      <input
        type="text"
        name="placeQuery"
        onChange={(e) => {
          setPlaceQuery(e.target.value);
        }}
      />
      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {displayedTagList.length > 0 &&
        displayedTagList.map((place) => (
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
