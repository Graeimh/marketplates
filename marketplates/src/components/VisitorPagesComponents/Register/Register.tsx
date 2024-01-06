import { useEffect, useState } from "react";
import formStyles from "../../../common/styles/Forms.module.scss";
import styles from "./Register.module.scss";
import * as userService from "../../../services/userService.js";
import {
  IPasswordFitnessCriteria,
  IRegisterValues,
} from "../../../common/types/userTypes/userTypes.js";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Helmet } from "react-helmet";
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes.js";

function Register(props: { messageSetter: React.Dispatch<IMessageValues> }) {
  // Setting states
  // Contains the data needed for a user to log in
  const [formData, setFormData] = useState<IRegisterValues>({
    email: "",
    firstName: "",
    lastName: "",
    displayName: "",
    country: "",
    city: "",
    county: "",
    streetAddress: "",
    password: "",
    passwordMatch: "",
  });

  // Serves to check if the password and passwordMatch values are the same
  const [arePasswordsMatching, setArePasswordsMatching] = useState(true);

  // Serves to checks if the password has 12 characters or more, contains a lower case or upper case character, a number and a special character
  const [passwordFitnessCriteria, setPasswordFitnessCriteria] =
    useState<IPasswordFitnessCriteria>({
      isLengthCorrect: false,
      containsUppercase: false,
      containsLowerCase: false,
      containsNumbers: false,
      containsSpecialCharacter: false,
    });

  // Is the sum total of passwordFitnessCriteria, if one of its values is false, then this value is false
  const [doesPasswordFitCriteria, setDoesPasswordFitCriteria] = useState(false);

  // Controls whether or not the password is visible upon pressing a button
  const [passwordVisibility, setPasswordVisibility] = useState("password");

  // Serves to check if all values have the correct number of characters
  const [validForSending, setValidForSending] = useState(false);

  // Response message display
  const [responseMessage, setResponseMessage] = useState("");

  // Error message display
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function decideRegistration() {
    setValidForSending(
      formData.firstName.length > 1 &&
        formData.lastName.length > 1 &&
        formData.displayName.length > 1 &&
        formData.email.length > 3 &&
        formData.password.length >= 12 &&
        formData.passwordMatch.length >= 12 &&
        formData.country.length > 1 &&
        formData.county.length > 1 &&
        formData.city.length > 1 &&
        formData.streetAddress.length > 1
    );
  }

  useEffect(() => {
    decideRegistration();
  }, [formData]);

  function passwordChecker(passwordValue: string): void {
    setPasswordFitnessCriteria({
      isLengthCorrect: passwordValue.length >= 12,
      containsUppercase: /[A-Z]/.test(passwordValue),
      containsLowerCase: /[a-z]/.test(passwordValue),
      containsNumbers: /[0-9]/.test(passwordValue),
      containsSpecialCharacter: /[^A-Za-z0-9]/.test(passwordValue),
    });
    setDoesPasswordFitCriteria(
      passwordValue.length >= 12 &&
        /[A-Z]/.test(passwordValue) &&
        /[a-z]/.test(passwordValue) &&
        /[0-9]/.test(passwordValue) &&
        /[^A-Za-z0-9]/.test(passwordValue)
    );
  }

  function updateField(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    switch (event.target.name) {
      case "password":
        passwordChecker(event.target.value);
        setArePasswordsMatching(event.target.value === formData.passwordMatch);
        break;
      case "passwordMatch":
        setArePasswordsMatching(event.target.value === formData.password);
        break;
      default:
        break;
    }
  }

  async function sendRegistrationForm(event) {
    event.preventDefault();
    if (doesPasswordFitCriteria && arePasswordsMatching) {
      try {
        const response = await userService.generateUser(formData);
        setResponseMessage(response.message);
        navigate("/login");
      } catch (err) {
        setError(err.message);
      }
    } else {
      console.log("Poop!");
    }
  }

  return (
    <>
      <Helmet>
        <title>Register</title>
        <link rel="canonical" href="http://localhost:5173/register" />
      </Helmet>

      <article className={formStyles.formContainer}>
        <form onSubmit={sendRegistrationForm}>
          <h2>Register</h2>
          <section className={formStyles.specificData}>
            <h3>Personnal information</h3>
            <ul>
              <li>
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  onInput={updateField}
                  placeholder="First name"
                />
              </li>
              <li>
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  onInput={updateField}
                  placeholder="Last name"
                />
              </li>
            </ul>
            <div>
              <label htmlFor="streetAddress">Street address</label>
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                required
                onInput={updateField}
                placeholder="Street address"
              />
            </div>
            <ul>
              <li>
                <label htmlFor="county">County</label>
                <input
                  type="text"
                  name="county"
                  id="county"
                  required
                  onInput={updateField}
                  placeholder="County"
                />
              </li>
              <li>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  onInput={updateField}
                  placeholder="City"
                />
              </li>
              <li>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  onInput={updateField}
                  placeholder="Country"
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
                  placeholder="Nickname"
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
                  placeholder="Email"
                />
              </li>
              <li>
                <div className={styles.toolTip}>
                  <label htmlFor="password">Password</label>
                  <br />
                  <input
                    type={passwordVisibility}
                    name="password"
                    id="password"
                    required
                    onInput={updateField}
                    placeholder="Password"
                  />
                  <FontAwesomeIcon
                    icon={
                      passwordVisibility === "password"
                        ? regular("eye")
                        : regular("eye-slash")
                    }
                    id={
                      passwordVisibility === "password"
                        ? styles.passwordReveal
                        : styles.passwordRevealHidden
                    }
                    onMouseDown={() => {
                      setPasswordVisibility("text");
                    }}
                    onMouseUp={() => {
                      setPasswordVisibility("password");
                    }}
                    onMouseLeave={() => {
                      setPasswordVisibility("password");
                    }}
                  />
                  <div className={styles.toolTipValues}>
                    Your password :
                    <ul>
                      <li
                        className={
                          formData.password.length >= 12
                            ? styles.correctFieldValues
                            : styles.incorrectFieldValues
                        }
                      >
                        {formData.password.length >= 12 ? (
                          <FontAwesomeIcon icon={regular("circle-check")} />
                        ) : (
                          <FontAwesomeIcon icon={solid("xmark")} />
                        )}{" "}
                        Must be at least 12 characters
                      </li>
                      <li
                        className={
                          /[A-Z]/.test(formData.password)
                            ? styles.correctFieldValues
                            : styles.incorrectFieldValues
                        }
                      >
                        {/[A-Z]/.test(formData.password) ? (
                          <FontAwesomeIcon icon={regular("circle-check")} />
                        ) : (
                          <FontAwesomeIcon icon={solid("xmark")} />
                        )}{" "}
                        Must contain at least one upper case letter
                      </li>
                      <li
                        className={
                          /[a-z]/.test(formData.password)
                            ? styles.correctFieldValues
                            : styles.incorrectFieldValues
                        }
                      >
                        {/[a-z]/.test(formData.password) ? (
                          <FontAwesomeIcon icon={regular("circle-check")} />
                        ) : (
                          <FontAwesomeIcon icon={solid("xmark")} />
                        )}{" "}
                        Must contain at least one lower case letter
                      </li>
                      <li
                        className={
                          /[0-9]/.test(formData.password)
                            ? styles.correctFieldValues
                            : styles.incorrectFieldValues
                        }
                      >
                        {/[0-9]/.test(formData.password) ? (
                          <FontAwesomeIcon icon={regular("circle-check")} />
                        ) : (
                          <FontAwesomeIcon icon={solid("xmark")} />
                        )}{" "}
                        Must contain at least one digit
                      </li>
                      <li
                        className={
                          /[^A-Za-z0-9]/.test(formData.password)
                            ? styles.correctFieldValues
                            : styles.incorrectFieldValues
                        }
                      >
                        {/[^A-Za-z0-9]/.test(formData.password) ? (
                          <FontAwesomeIcon icon={regular("circle-check")} />
                        ) : (
                          <FontAwesomeIcon icon={solid("xmark")} />
                        )}{" "}
                        Must contain at least one special character (",*$£...)
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <label htmlFor="passwordMatch">Confirm password</label>
                <input
                  type="password"
                  name="passwordMatch"
                  id="passwordMatch"
                  required
                  onInput={updateField}
                  placeholder="Write your password again here"
                />
              </li>
            </ul>
          </section>
          <div className={formStyles.finalButtonContainer}>
            <button
              type="submit"
              disabled={
                Object.values(passwordFitnessCriteria).some(
                  (field) => field === false
                ) ||
                !arePasswordsMatching ||
                !validForSending
              }
            >
              Register
            </button>
          </div>
        </form>
      </article>

      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
}

export default Register;
