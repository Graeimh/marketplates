import { useEffect, useState } from "react";
import styles from "../LoginRegister.module.scss";
import * as userService from "../../../services/userService.js";
import {
  IPasswordFitnessCriteria,
  IRegisterValues,
} from "../../../common/types/userTypes/userTypes.js";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";

function Register() {
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
        formData.country.length > 1
    );
  }

  useEffect(() => {
    decideRegistration();
  }, [
    formData.firstName,
    formData.lastName,
    formData.displayName,
    formData.email,
    formData.password,
    formData.passwordMatch,
    formData.country,
  ]);

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
      <article id={styles.formContainer}>
        <form onSubmit={sendRegistrationForm}>
          <h2>Register</h2>
          <section className={styles.specificData}>
            <h3>Personnal information</h3>
            <ul>
              <li>
                <div>
                  <label htmlFor="firstName">First name</label>
                  <br />
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    onInput={updateField}
                    placeholder="First name"
                  />
                </div>
              </li>
              <li>
                <div>
                  <label htmlFor="lastName">Last name</label>
                  <br />
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    onInput={updateField}
                    placeholder="Last name"
                  />
                </div>
              </li>
            </ul>
          </section>
          <section className={styles.specificData}>
            <div>
              <label htmlFor="streetAddress">Street address</label>
              <br />
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                onInput={updateField}
                placeholder="Street address"
              />
            </div>
            <ul>
              <li>
                <div>
                  <label htmlFor="county">County</label>
                  <br />
                  <input
                    type="text"
                    name="county"
                    id="county"
                    onInput={updateField}
                    placeholder="County"
                  />
                </div>
              </li>
              <li>
                <div>
                  <label htmlFor="city">City</label>
                  <br />
                  <input
                    type="text"
                    name="city"
                    id="city"
                    onInput={updateField}
                    placeholder="City"
                  />
                </div>
              </li>
              <li>
                <div>
                  <label htmlFor="country">Country</label>
                  <br />
                  <input
                    type="text"
                    name="country"
                    id="country"
                    required
                    onInput={updateField}
                    placeholder="Country"
                  />
                </div>
              </li>
            </ul>
          </section>
          <section>
            <h3>Credentials</h3>
            <ul>
              <li>
                <div>
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
                </div>
              </li>
              <li>
                <div>
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
                </div>
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
                  <br />
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
                <div>
                  <label htmlFor="passwordMatch">Confirm password</label>
                  <br />
                  <input
                    type="password"
                    name="passwordMatch"
                    id="passwordMatch"
                    required
                    onInput={updateField}
                    placeholder="Write your password again here"
                  />
                </div>
              </li>
            </ul>
          </section>
          <div id={styles.finalButtonContainer}>
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
