import { useContext, useEffect, useState } from "react";
import * as userService from "../../../services/userService.js";
import formStyles from "../../../common/styles/Forms.module.scss";
import styles from "../../../common/styles/ManipulationItem.module.scss";
import {
  IUser,
  IUserData,
  UserType,
} from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";

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
  }, [formData]);

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
        setValidForUpdating(false);
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
      <article
        className={`
          ${props.IsSelected ? styles.primedContainer : styles.itemContainer} ${
          formStyles.formContainer
        }
            `}
      >
        <section>
          <h4>User : {props.user.displayName}</h4>
          <button
            type="button"
            className={props.IsSelected ? styles.primedButton : ""}
            onClick={() => handleDeletePrimer()}
          >
            {props.IsSelected ? (
              <FontAwesomeIcon icon={regular("trash-can")} />
            ) : (
              <FontAwesomeIcon icon={solid("trash-can-arrow-up")} />
            )}
            {props.IsSelected ? " Cancel selection" : " Select"}
          </button>

          <button type="button" onClick={handleDelete}>
            <FontAwesomeIcon icon={solid("user-slash")} /> Delete user
          </button>
        </section>
        <form onSubmit={sendUpdateForm}>
          <section className={formStyles.specificData}>
            <h5>Personnal information</h5>
            <ul>
              <li>
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
              </li>
              <li>
                <label>Last name : </label>
                <input
                  type="text"
                  name="lastName"
                  onInput={() => {
                    setFormData({
                      ...formData,
                      lastName: event?.target.value,
                    });
                  }}
                  value={formData.lastName}
                />
              </li>
            </ul>
            <div>
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
            </div>
            <ul>
              <li>
                <label>County : </label>
                <input
                  type="text"
                  name="county"
                  onInput={() => {
                    setFormData({ ...formData, county: event?.target.value });
                  }}
                  value={formData.county}
                />
              </li>
              <li>
                <label>City : </label>
                <input
                  type="text"
                  name="city"
                  onInput={() => {
                    setFormData({ ...formData, city: event?.target.value });
                  }}
                  value={formData.city}
                />
              </li>
              <li>
                <label>Country : </label>
                <input
                  type="text"
                  name="country"
                  onInput={() => {
                    setFormData({
                      ...formData,
                      country: event?.target.value,
                    });
                  }}
                  value={formData.country}
                />
              </li>
            </ul>
          </section>
          <section>
            <h5>Credentials</h5>
            <ul>
              <li>
                <label>Nickname : </label>
                <br />
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
              </li>
              <li>
                <label>Email : </label>
                <br />
                <input
                  type="email"
                  name="email"
                  onInput={() => {
                    setFormData({ ...formData, email: event?.target.value });
                  }}
                  value={formData.email}
                />
              </li>
            </ul>
          </section>
          <div className={formStyles.finalButtonContainer}>
            <button
              type="submit"
              disabled={!validForUpdating || value.email === props.user.email}
            >
              Update User
            </button>
          </div>
        </form>
      </article>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
    </>
  );
}

export default UserManipulationItem;
