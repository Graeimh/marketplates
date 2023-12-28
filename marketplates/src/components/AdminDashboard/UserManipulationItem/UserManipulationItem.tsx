import { useContext, useEffect, useState } from "react";
import * as userService from "../../../services/userService.js";
import styles from "./UserManipulationItem.module.scss";
import {
  IUser,
  IUserData,
  UserType,
} from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";

function UserManipulationItem(props: {
  user: IUser;
  uponDeletion: (userId: string) => void;
  primeForDeletion: (userId: string) => void;
  IsSelected: boolean;
  refetch: () => Promise<void>;
}) {
  const [formData, setFormData] = useState<IUserData>({
    displayName: props.user.displayName,
    email: props.user.email,
    firstName: props.user.firstName,
    lastName: props.user.lastName,
    city: props.user.location.city,
    country: props.user.location.city,
    county: props.user.location.county,
    streetAddress: props.user.location.streetAddress,
  });
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isPrimed, setIsPrimed] = useState(false);
  const [validForUpdating, setValidForUpdating] = useState(false);

  const value = useContext(UserContext);

  function decideUpdatability() {
    setValidForUpdating(
      formData.displayName.length > 1 &&
        formData.email.length > 1 &&
        formData.firstName.length > 1 &&
        formData.lastName.length > 1 &&
        formData.streetAddress.length > 1 &&
        formData.county.length > 1 &&
        formData.city.length > 1 &&
        formData.country.length > 1 &&
        (formData.displayName !== props.user.displayName ||
          formData.email !== props.user.email ||
          formData.firstName !== props.user.firstName ||
          formData.lastName !== props.user.lastName ||
          formData.streetAddress !== props.user.location.streetAddress ||
          formData.county !== props.user.location.county ||
          formData.city !== props.user.location.city ||
          formData.country !== props.user.location.country)
    );
  }

  useEffect(() => {
    decideUpdatability();
  }, [
    formData.displayName,
    formData.email,
    formData.firstName,
    formData.firstName,
    formData.lastName,
    formData.streetAddress,
    formData.county,
    formData.city,
    formData.country,
  ]);

  function handleDeletePrimer() {
    props.primeForDeletion(props.user._id);
    setIsPrimed(!isPrimed);
  }

  async function sendUpdateForm(event) {
    event.preventDefault();

    try {
      if (checkPermission(value.status, UserType.Admin)) {
        const response = await userService.updateUserById(
          props.user._id,
          formData
        );
        setResponseMessage(response.message);
        props.refetch();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDelete() {
    props.uponDeletion(props.user._id);
  }

  return (
    <>
      <h4>User : {props.user.displayName}</h4>
      <div
        className={
          props.IsSelected
            ? styles.primedContainer
            : styles.userManipulationItemContainer
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
          Delete user
        </button>
        <form onSubmit={sendUpdateForm}>
          <ul>
            <li>
              <p>
                <label>Nickname : </label>
                <input
                  type="text"
                  name="displayName"
                  onInput={() => {
                    setFormData({
                      ...formData,
                      displayName: event?.target.value,
                    });
                  }}
                  value={formData.displayName}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Email : </label>
                <input
                  type="email"
                  name="email"
                  onInput={() => {
                    setFormData({ ...formData, email: event?.target.value });
                  }}
                  value={formData.email}
                />
              </p>
            </li>
            <li>
              <p>
                <label>First name : </label>
                <input
                  type="text"
                  name="firstName"
                  onInput={() => {
                    setFormData({
                      ...formData,
                      firstName: event?.target.value,
                    });
                  }}
                  value={formData.firstName}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Last name : </label>
                <input
                  type="text"
                  name="lastName"
                  onInput={() => {
                    setFormData({ ...formData, lastName: event?.target.value });
                  }}
                  value={formData.lastName}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Street address : </label>
                <input
                  type="text"
                  name="streetAddress"
                  onInput={() => {
                    setFormData({
                      ...formData,
                      streetAddress: event?.target.value,
                    });
                  }}
                  value={formData.streetAddress}
                />
              </p>
            </li>
            <li>
              <p>
                <label>County : </label>
                <input
                  type="text"
                  name="county"
                  onInput={() => {
                    setFormData({ ...formData, county: event?.target.value });
                  }}
                  value={formData.county}
                />
              </p>
            </li>
            <li>
              <p>
                <label>City : </label>
                <input
                  type="text"
                  name="city"
                  onInput={() => {
                    setFormData({ ...formData, city: event?.target.value });
                  }}
                  value={formData.city}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Country : </label>
                <input
                  type="text"
                  name="country"
                  onInput={() => {
                    setFormData({ ...formData, country: event?.target.value });
                  }}
                  value={formData.country}
                />
              </p>
            </li>
          </ul>
          <button type="submit" disabled={!validForUpdating}>
            Update User
          </button>
        </form>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
    </>
  );
}

export default UserManipulationItem;
