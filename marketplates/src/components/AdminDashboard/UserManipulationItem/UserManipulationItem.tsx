import { useEffect, useState } from "react";
import * as userService from "../../../services/userService.js";
import styles from "./UserManipulationItem.module.scss";
import { IUser } from "../../../common/types/userTypes/userTypes.js";

function UserManipulationItem(props: {
  user: IUser;
  uponDeletion: (userId: string) => void;
  primeForDeletion: (userId: string) => void;
  IsSelected: boolean;
}) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isPrimed, setIsPrimed] = useState(false);
  const [validForUpdating, setValidForUpdating] = useState(false);

  const [displayName, setDisplayName] = useState(props.user.displayName);
  const [email, setEmail] = useState(props.user.email);
  const [firstName, setFirstName] = useState(props.user.firstName);
  const [lastName, setLastName] = useState(props.user.lastName);
  const [streetAddress, setStreetAddress] = useState(
    props.user.location.streetAddress
  );
  const [county, setCounty] = useState(props.user.location.county);
  const [city, setCity] = useState(props.user.location.city);
  const [country, setCountry] = useState(props.user.location.country);

  function decideUpdatability() {
    setValidForUpdating(
      displayName.length > 1 &&
        email.length > 1 &&
        firstName.length > 1 &&
        lastName.length > 1 &&
        streetAddress.length > 1 &&
        county.length > 1 &&
        city.length > 1 &&
        country.length > 1 &&
        (displayName !== props.user.displayName ||
          email !== props.user.email ||
          firstName !== props.user.firstName ||
          lastName !== props.user.lastName ||
          streetAddress !== props.user.location.streetAddress ||
          county !== props.user.location.county ||
          city !== props.user.location.city ||
          country !== props.user.location.country)
    );
  }

  useEffect(() => {
    decideUpdatability();
  }, [
    displayName,
    email,
    firstName,
    firstName,
    lastName,
    streetAddress,
    county,
    city,
    country,
  ]);

  function handleDeletePrimer() {
    props.primeForDeletion(props.user._id);
    setIsPrimed(!isPrimed);
  }

  async function sendUpdateForm(event) {
    event.preventDefault();

    try {
      const response = await userService.updateUserById(
        props.user._id,
        displayName,
        email,
        firstName,
        lastName,
        streetAddress,
        county,
        city,
        country
      );
      setResponseMessage(response.message);
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
                    setDisplayName(event?.target.value);
                  }}
                  value={displayName}
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
                    setEmail(event?.target.value);
                  }}
                  value={email}
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
                    setFirstName(event?.target.value);
                  }}
                  value={firstName}
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
                    setLastName(event?.target.value);
                  }}
                  value={lastName}
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
                    setStreetAddress(event?.target.value);
                  }}
                  value={streetAddress}
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
                    setCounty(event?.target.value);
                  }}
                  value={county}
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
                    setCity(event?.target.value);
                  }}
                  value={city}
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
                    setCountry(event?.target.value);
                  }}
                  value={country}
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
