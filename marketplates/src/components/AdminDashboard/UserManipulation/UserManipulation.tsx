import { useContext, useEffect, useState } from "react";
import * as userService from "../../../services/userService.js";
import stylesUserDashboard from "../../../common/styles/Dashboard.module.scss";
import styles from "../../../common/styles/ManipulationContainer.module.scss";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import UserManipulationItem from "../UserManipulationItem/UserManipulationItem.js";
import { IUser, UserType } from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";

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

  async function getAllUsers() {
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
    getAllUsers();
  }, [value]);

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
        getAllUsers();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendDeleteUserCall(id: string) {
    try {
      if (checkPermission(value.status, UserType.Admin)) {
        const response = await userService.deleteUserById(id);
        getAllUsers();
        setResponseMessage(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredUserList = userList.filter((user) =>
    new RegExp(userQuery, "i").test(user.displayName)
  );
  const displayedUserList = userQuery.length > 0 ? filteredUserList : userList;

  return (
    <>
      <Helmet>
        <title>Dashboard - Users</title>
        <link rel="canonical" href="http://localhost:5173/dashboard/users" />
      </Helmet>

      <article id={styles.manipulationContainer}>
        <h2>Manage users</h2>
        <section id={styles.searchBar}>
          <label>
            <FontAwesomeIcon icon={solid("magnifying-glass")} />
            Search for a user via their display name :{" "}
          </label>
          <input
            type="text"
            name="userQuery"
            onChange={(e) => {
              setUserQuery(e.target.value);
            }}
          />
        </section>
        <section id={styles.manipulationButtonsContainer}>
          <span className={stylesUserDashboard.deleteButton}>
            <button type="button" onClick={() => deletePrimedForDeletion()}>
              <FontAwesomeIcon icon={regular("trash-can")} />
              Delete {primedForDeletionList.length} users
            </button>
          </span>
          <button type="button" onClick={() => cancelSelection()}>
            <FontAwesomeIcon icon={regular("rectangle-xmark")} />
            Cancel selection
          </button>

          <button
            type="button"
            onClick={() => selectAllUsers()}
            disabled={primedForDeletionList.length === userList.length}
          >
            <FontAwesomeIcon icon={solid("reply-all")} />
            Select all ({userList.length}) users
          </button>
        </section>
      </article>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      <ul id={styles.manipulationItemContainer}>
        {displayedUserList.length > 0 &&
          displayedUserList.map((user) => (
            <li>
              <UserManipulationItem
                user={user}
                uponDeletion={sendDeleteUserCall}
                primeForDeletion={manageDeletionList}
                refetch={getAllUsers}
                key={user._id}
                IsSelected={primedForDeletionList.indexOf(user._id) !== -1}
              />
            </li>
          ))}
      </ul>
    </>
  );
}

export default UserManipulation;
