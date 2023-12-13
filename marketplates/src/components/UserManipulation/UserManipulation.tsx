import { useEffect, useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./UserManipulation.module.scss";
import UserManipulationItem from "../UserManipulationItem/UserManipulationItem.js";
import { IUser } from "../../common/types/userTypes/userTypes.js";

function UserManipulation() {
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [userList, setUserList] = useState<IUser[]>([]);
  const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>(
    []
  );
  const [isAllSelected, setIsAllSelected] = useState(false);

  async function getResults() {
    try {
      const allUsers = await APIService.fetchAllUsers();
      setUserList(allUsers.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getResults();
  }, []);

  function manageDeletionList(id: string) {
    const foundIndex = primedForDeletionList.indexOf(id);
    if (foundIndex === -1) {
      setPrimedForDeletionList([...primedForDeletionList, id]);
    } else {
      setPrimedForDeletionList(
        primedForDeletionList.filter((user) => user !== id)
      );
    }
  }

  function selectAllUsers() {
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
      const responseForDelete = APIService.deleteUsersByIds(
        primedForDeletionList,
        "token"
      );
      const responseforDataRenewal = APIService.fetchAllUsers();

      const combinedResponse = await Promise.all([
        responseForDelete,
        responseforDataRenewal,
      ]).then((values) => values.join(" "));
      setResponseMessage(combinedResponse);
      setPrimedForDeletionList([]);
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
