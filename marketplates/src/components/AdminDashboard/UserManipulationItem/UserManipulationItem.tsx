import { useContext, useEffect, useState } from "react";
import * as userService from "../../../services/userService.js";
import formStyles from "../../../common/styles/Forms.module.scss";
import stylesUserDashboard from "../../../common/styles/Dashboard.module.scss";
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
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes.js";

function UserManipulationItem(props: {
  user: IUser;
  uponDeletion: (userId: string) => void;
  primeForDeletion: (userId: string) => void;
  IsSelected: boolean;
  refetch: () => Promise<void>;
  messageSetter: React.Dispatch<IMessageValues>;
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

  const [isPrimed, setIsPrimed] = useState(false);
  const [validForUpdating, setValidForUpdating] = useState(false);

  // Fetching the user's current data
  const userContextValue = useContext(UserContext);

  useEffect(() => {
    decideUpdatability();
  }, [formData]);

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

  function updateField(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleDeletePrimer() {
    props.primeForDeletion(props.user._id);
    setIsPrimed(!isPrimed);
  }

  async function sendUpdateForm(event) {
    event.preventDefault();

    try {
      if (checkPermission(userContextValue.status, UserType.Admin)) {
        await userService.updateUserById(props.user._id, formData);
        props.messageSetter({
          message: "User updated successfully",
          successStatus: true,
        });
        props.refetch();
        setValidForUpdating(false);
      }
    } catch (err) {
      props.messageSetter({
        message: "We could not update the user's information",
        successStatus: false,
      });
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
          <h2 className={formStyles.itemTitle}>
            User : {props.user.displayName}
          </h2>
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
          <span className={stylesUserDashboard.deleteButton}>
            <button type="button" onClick={handleDelete}>
              <FontAwesomeIcon icon={solid("user-slash")} /> Delete user
            </button>
          </span>
        </section>
        <form onSubmit={sendUpdateForm}>
          <section className={formStyles.specificData}>
            <h5>Personnal information</h5>
            <ul>
              <li>
                <label htmlFor="firstName">First name : </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  onInput={updateField}
                  value={formData.firstName}
                />
              </li>
              <li>
                <label htmlFor="lastName">Last name : </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  onInput={updateField}
                  value={formData.lastName}
                />
              </li>
            </ul>
            <div>
              <label htmlFor="streetAddress">Street address : </label>
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                onInput={updateField}
                value={formData.streetAddress}
              />
            </div>
            <ul>
              <li>
                <label htmlFor="county">County : </label>
                <input
                  type="text"
                  name="county"
                  id="county"
                  onInput={updateField}
                  value={formData.county}
                />
              </li>
              <li>
                <label htmlFor="city">City : </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  onInput={updateField}
                  value={formData.city}
                />
              </li>
              <li>
                <label htmlFor="country">Country : </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  onInput={updateField}
                  value={formData.country}
                />
              </li>
            </ul>
          </section>
          <section>
            <h5>Credentials</h5>
            <ul>
              <li>
                <label htmlFor="displayName">Nickname : </label>
                <br />
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  onInput={updateField}
                  value={formData.displayName}
                />
              </li>
              <li>
                <label htmlFor="email">Email : </label>
                <br />
                <input
                  type="email"
                  name="email"
                  id="email"
                  onInput={updateField}
                  value={formData.email}
                />
              </li>
            </ul>
          </section>
          <div className={formStyles.finalButtonContainer}>
            <button
              type="submit"
              disabled={
                !validForUpdating || userContextValue.email === props.user.email
              }
            >
              Update User
            </button>
          </div>
        </form>
      </article>
    </>
  );
}

export default UserManipulationItem;
