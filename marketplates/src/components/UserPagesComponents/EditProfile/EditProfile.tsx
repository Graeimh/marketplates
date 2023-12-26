import { useEffect, useState } from "react";
import styles from "./EditProfile.module.scss";
import * as userService from "../../../services/userService.js";
import { IUserData } from "../../../common/types/userTypes/userTypes.js";
import { useNavigate } from "react-router-dom";

function EditProfile(props: { userId: string }) {
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
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function getUserData() {
    try {
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
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  async function sendEditUserForm(event) {
    event.preventDefault();
    try {
      await userService.updateUserById(
        props.userId,
        formData.displayName,
        formData.email,
        formData.firstName,
        formData.lastName,
        formData.streetAddress,
        formData.county,
        formData.city,
        formData.city
      );
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Edit profile</h1>
      <form>
        <ul>
          <li>
            <p>
              <label>Display name : </label>
              <input
                type="text"
                name="displayName"
                required
                onInput={(e) => {
                  setFormData({ ...formData, displayName: e.target.value });
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
                required
                onInput={(e) => {
                  setFormData({ ...formData, email: e.target.value });
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
                required
                onInput={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
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
                required
                onInput={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
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
                required
                onInput={(e) => {
                  setFormData({ ...formData, streetAddress: e.target.value });
                }}
                value={formData.streetAddress}
              />
            </p>
          </li>
          <li>
            <p>
              <label>Country : </label>
              <input
                type="text"
                name="country"
                required
                onInput={(e) => {
                  setFormData({ ...formData, country: e.target.value });
                }}
                value={formData.country}
              />
            </p>
          </li>
          <li>
            <p>
              <label>County : </label>
              <input
                type="text"
                name="county"
                required
                onInput={(e) => {
                  setFormData({ ...formData, county: e.target.value });
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
                required
                onInput={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                }}
                value={formData.city}
              />
            </p>
          </li>
        </ul>
        <button type="button" onClick={(e) => sendEditUserForm(e)}>
          Edit my profile
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
}

export default EditProfile;
