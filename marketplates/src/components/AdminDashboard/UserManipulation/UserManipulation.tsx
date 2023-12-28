import { useContext, useEffect, useState } from "react";
import * as userService from "../../../services/userService.js";
import styles from "./UserManipulation.module.scss";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import UserManipulationItem from "../UserManipulationItem/UserManipulationItem.js";
import { IUser, UserType } from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";

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

  const [userQuery, setUserQuery] = useState("");

  const value = useContext(UserContext);

  async function getResults() {
    try {
      if (checkPermission(value.status, UserType.Admin)) {
        // Fetching all existing users
        const allUsers = await userService.fetchAllUsers();
        setUserList(allUsers.data);
      }
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
      if (checkPermission(value.status, UserType.Admin)) {
        // Delete all the places whose ids are within the primed for deletion list
        const responseForDelete = userService.deleteUsersByIds(
          primedForDeletionList
        );
        const response = await responseForDelete;
        setResponseMessage(response);
        setPrimedForDeletionList([]);
        getResults();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendDeleteUserCall(id: string) {
    try {
      if (checkPermission(value.status, UserType.Admin)) {
        const response = await userService.deleteUserById(id);
        getResults();
        setResponseMessage(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredUserList = userList.filter((user) =>
    new RegExp(userQuery).test(user.displayName)
  );
  const displayedUserList = userQuery.length > 0 ? filteredUserList : userList;

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

      <label>Search for a user via their display name : </label>
      <input
        type="text"
        name="userQuery"
        onChange={(e) => {
          setUserQuery(e.target.value);
        }}
      />

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}

      {displayedUserList.length > 0 &&
        displayedUserList.map((user) => (
          <UserManipulationItem
            user={user}
            uponDeletion={sendDeleteUserCall}
            primeForDeletion={manageDeletionList}
            key={user._id}
            IsSelected={primedForDeletionList.indexOf(user._id) !== -1}
          />
        ))}
    </>
  );
}

export default UserManipulation;
