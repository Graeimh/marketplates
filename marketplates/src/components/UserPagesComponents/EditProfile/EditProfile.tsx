import { useContext, useEffect, useState } from "react";
import formStyles from "../../../common/styles/Forms.module.scss";
import styles from "./EditProfile.module.scss";
import * as userService from "../../../services/userService.js";
import {
  IUserData,
  UserType,
} from "../../../common/types/userTypes/userTypes.js";
import { useNavigate } from "react-router-dom";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { Helmet } from "react-helmet";
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes.js";

function EditProfile(props: {
  userId: string;
  messageSetter: React.Dispatch<IMessageValues>;
}) {
  // Setting states
  // Contains the data needed to update a user's profile
  const [formData, setFormData] = useState<IUserData>({
    displayName: "",
    email: "",
    firstName: "",
    lastName: "",
    streetAddress: "",
    country: "",
    county: "",
    city: "",
  });
  const [validForSending, setValidForSending] = useState(false);

  // Fetching the user's current data
  const userContextValue = useContext(UserContext);

  const navigate = useNavigate();

  // When the user's access token is reset, pull the values anew if possible
  useEffect(() => {
    getUserData();
  }, [userContextValue]);

  // Each time an input is modified we check if the form is valid for sending
  useEffect(() => {
    decideRegistration();
  }, [formData]);

  function updateField(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function getUserData() {
    try {
      if (checkPermission(userContextValue.status, UserType.User)) {
        const userData = await userService.fetchUsersByIds([props.userId]);
        setFormData({
          displayName: userData.data[0].displayName,
          email: userData.data[0].email,
          firstName: userData.data[0].firstName,
          lastName: userData.data[0].lastName,
          streetAddress: userData.data[0].location.streetAddress,
          country: userData.data[0].location.country,
          county: userData.data[0].location.county,
          city: userData.data[0].location.city,
        });
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we could not retrieve your data.",
        successStatus: false,
      });
    }
  }

  // Data validation made to match the back end specifications
  function decideRegistration() {
    setValidForSending(
      formData.firstName.length > 1 &&
        formData.lastName.length > 1 &&
        formData.displayName.length > 1 &&
        formData.email.length > 3 &&
        formData.country.length > 1 &&
        formData.county.length > 1 &&
        formData.city.length > 1 &&
        formData.streetAddress.length > 1
    );
  }
  // Passwords aren't modified yet because this time of modification isn't considered secure yet.

  async function sendEditUserForm(event) {
    event.preventDefault();
    try {
      if (checkPermission(userContextValue.status, UserType.User)) {
        await userService.updateUserById(props.userId, formData);
        props.messageSetter({
          message: "Your profile has been successfully updated.",
          successStatus: true,
        });
        navigate("/profile");
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we could not update your profile.",
        successStatus: false,
      });
    }
  }

  return (
    <>
      <Helmet>
        <title>Edit profile</title>
        <link rel="canonical" href="http://localhost:5173/editprofile" />
      </Helmet>

      <h2>Edit profile</h2>
      <article className={formStyles.formContainer} id={styles.userEditForm}>
        <form onSubmit={sendEditUserForm}>
          <section className={formStyles.specificData}>
            <h3>Personnal information</h3>
            <ul>
              <li>
                <label htmlFor="firstName">First name</label>
                <br />
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  onInput={updateField}
                  value={formData.firstName}
                />
              </li>
              <li>
                <label htmlFor="lastName">Last name</label>
                <br />
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  onInput={updateField}
                  value={formData.lastName}
                />
              </li>
            </ul>
            <div>
              <label htmlFor="streetAddress">Street address</label>
              <br />
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
                <label htmlFor="county">County</label>
                <br />
                <input
                  type="text"
                  name="county"
                  id="county"
                  onInput={updateField}
                  value={formData.county}
                />
              </li>
              <li>
                <label htmlFor="city">City</label>
                <br />
                <input
                  type="text"
                  name="city"
                  id="city"
                  onInput={updateField}
                  value={formData.city}
                />
              </li>
              <li>
                <label htmlFor="country">Country</label>
                <br />
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  onInput={updateField}
                  value={formData.country}
                />
              </li>
            </ul>
          </section>
          <section>
            <h3>Credentials</h3>
            <ul>
              <li>
                <label htmlFor="displayName">Nickname</label>
                <br />
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  required
                  onInput={updateField}
                  value={formData.displayName}
                />
              </li>
              <li>
                <label htmlFor="email">Email</label>
                <br />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  onInput={updateField}
                  value={formData.email}
                />
              </li>
            </ul>
          </section>
          <div className={formStyles.finalButtonContainer}>
            <button type="submit" disabled={!validForSending}>
              Edit my profile
            </button>
          </div>
        </form>
      </article>
    </>
  );
}

export default EditProfile;
