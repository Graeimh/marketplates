import { useEffect, useState } from "react";
import * as userService from "../../../services/userService.js";
import styles from "./UserManipulation.module.scss";
import UserManipulationItem from "../UserManipulationItem/UserManipulationItem.js";
import { IUser } from "../../../common/types/userTypes/userTypes.js";

function UserManipulation() {
  // Setting states
  // Error message display
  const [error, setError] = useState(null);

  // Response message display
  const [responseMessage, setResponseMessage] = useState("");

  // Array of users meant to be displayed, edited or deleted
  const [userList, setUserList] = useState<IUser[]>([]);

  // Array of user by Ids meant to be deleted upon pressing the delete button
  const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>(
    []
  );

  // Gives the information whether or not the user belongs to the primed for deletion list
  const [isAllSelected, setIsAllSelected] = useState(false);

  async function getResults() {
    try {
      // Fetching all existing users
      const allUsers = await userService.fetchAllUsers();
      setUserList(allUsers.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getResults();
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
        primedForDeletionList.filter((user) => user !== id)
      );
    }
  }

  function selectAllUsers() {
    // We check if some users were already selected and we add them to the primed for deletion list
    if (
      (!isAllSelected && primedForDeletionList.length === 0) ||
      primedForDeletionList.length !== userList.length
    ) {
      setPrimedForDeletionList(userList.map((user) => user._id));
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
      // Delete all the places whose ids are within the primed for deletion list
      const responseForDelete = userService.deleteUsersByIds(
        primedForDeletionList
      );
      const response = await responseForDelete;
      setResponseMessage(response);
      setPrimedForDeletionList([]);
      getResults();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>UsersManipulation</h1>

      <button type="button" onClick={() => deletePrimedForDeletion()}>
        Delete {primedForDeletionList.length} users{" "}
      </button>
      {primedForDeletionList.length !== userList.length && (
        <button type="button" onClick={() => selectAllUsers()}>
          Select all ({userList.length}) users{" "}
        </button>
      )}
      <button type="button" onClick={() => cancelSelection()}>
        Cancel selection{" "}
      </button>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}

      {userList.length > 0 &&
        userList.map((user) => (
          <UserManipulationItem
            user={user}
            primeForDeletion={manageDeletionList}
            key={user._id}
            IsSelected={primedForDeletionList.indexOf(user._id) !== -1}
          />
        ))}
    </>
  );
}

export default UserManipulation;
