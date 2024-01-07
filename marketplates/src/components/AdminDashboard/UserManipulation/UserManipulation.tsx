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
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes.js";

function UserManipulation(props: {
  messageSetter: React.Dispatch<IMessageValues>;
}) {
  // Setting states
  // Array of users meant to be displayed, edited or deleted
  const [userList, setUserList] = useState<IUser[]>([]);

  // Array of user by Ids meant to be deleted upon pressing the delete button
  const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>(
    []
  );

  // Gives the information whether or not the user belongs to the primed for deletion list
  const [isAllSelected, setIsAllSelected] = useState(false);

  const [userQuery, setUserQuery] = useState("");

  // Fetching the user's current data
  const userContextValue = useContext(UserContext);

  async function getAllUsers() {
    try {
      if (checkPermission(userContextValue.status, UserType.Admin)) {
        // Fetching all existing users
        const allUsers = await userService.fetchAllUsers();
        setUserList(allUsers.data);
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we could not fetch users.",
        successStatus: false,
      });
    }
  }

  useEffect(() => {
    getAllUsers();
  }, [userContextValue]);

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
      if (checkPermission(userContextValue.status, UserType.Admin)) {
        // Delete all the users whose ids are within the primed for deletion list
        await userService.deleteUsersByIds(primedForDeletionList);
        props.messageSetter({
          message: "Successfully deleted the selected users",
          successStatus: true,
        });
        setPrimedForDeletionList([]);
        getAllUsers();
      }
    } catch (err) {
      props.messageSetter({
        message:
          "An error has occured and we could not delete the selected users",
        successStatus: false,
      });
    }
  }

  async function sendDeleteUserCall(id: string) {
    try {
      if (checkPermission(userContextValue.status, UserType.Admin)) {
        await userService.deleteUserById(id);
        getAllUsers();
        props.messageSetter({
          message: "User successfully deleted",
          successStatus: true,
        });
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we could not delete this user",
        successStatus: false,
      });
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
        <h1>Manage users</h1>
        <section id={styles.searchBar}>
          <label htmlFor="userQuery">
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
                messageSetter={props.messageSetter}
              />
            </li>
          ))}
      </ul>
    </>
  );
}

export default UserManipulation;
