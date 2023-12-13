import { useEffect, useState } from "react";
import styles from "./Register.module.scss";
import * as APIService from "../../services/api.js";
import {
  IPasswordFitnessCriteria,
  IRegisterValues,
} from "../../common/types/userTypes/userTypes.js";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IRegisterValues>({
    email: "",
    firstName: "",
    lastName: "",
    nickName: "",
    country: "",
    city: "",
    county: "",
    streetAddress: "",
    password: "",
    passwordMatch: "",
  });
  const [arePasswordsMatching, setArePasswordsMatching] = useState(true);
  const [doesPasswordFitCriteria, setDoesPasswordFitCriteria] = useState(false);
  const [passwordFitnessCriteria, setPasswordFitnessCriteria] =
    useState<IPasswordFitnessCriteria>({
      isLengthCorrect: false,
      containsUppercase: false,
      containsLowerCase: false,
      containsNumbers: false,
      containsSpecialCharacter: false,
    });

  const [validForSending, setValidForSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);

  function decideRegistration() {
    setValidForSending(
      formData.firstName.length > 1 &&
        formData.lastName.length > 1 &&
        formData.nickName.length > 1 &&
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
    formData.nickName,
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
    const token = "";
    if (doesPasswordFitCriteria && arePasswordsMatching) {
      try {
        const response = await APIService.generateUser(formData, token);
        setResponseMessage(response.message);
        navigate("/explore");
      } catch (err) {
        setError(err.message);
      }
    } else {
      console.log("Poop!");
      //redirect to error function which uses a redirection anchor to the first erroneous field;
    }
  }

  /*

Pour limiter un message en caractères: faire à la fois côté server ET front

skipfish
pentest-tools

==> eye button in the input field to turn password to text in the input type
*/
  console.log("passwordFitnessCriteria", passwordFitnessCriteria);

  return (
    <>
      <h1>Register</h1>
      <div className={styles.registerContainer}>
        <form onSubmit={sendRegistrationForm}>
          <ul>
            <li>
              <p>
                <label>First name : </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  onInput={updateField}
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
                  onInput={updateField}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Nickname : </label>
                <input
                  type="text"
                  name="nickName"
                  required
                  onInput={updateField}
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
                  onInput={updateField}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Street address : </label>
                <input type="text" name="streetAddress" onInput={updateField} />
              </p>
            </li>
            <li>
              <p>
                <label>County : </label>
                <input type="text" name="county" onInput={updateField} />
              </p>
            </li>
            <li>
              <p>
                <label>City : </label>
                <input type="text" name="city" onInput={updateField} />
              </p>
            </li>
            <li>
              <p>
                <label>Country : </label>
                <input
                  type="text"
                  name="country"
                  required
                  onInput={updateField}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Password : </label>
                <input
                  type="password"
                  name="password"
                  required
                  onInput={updateField}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Confirm password : </label>
                <input
                  type="password"
                  name="passwordMatch"
                  required
                  onInput={updateField}
                />
              </p>
            </li>
          </ul>
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
        </form>
      </div>

      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
}

export default Register;
