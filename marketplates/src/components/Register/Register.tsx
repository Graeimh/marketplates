import { useState } from "react";
import styles from "./Register.module.scss";
import * as APIService from "../../services/api.js";
import {
  IPasswordFitnessCriteria,
  IRegisterValues,
} from "../../common/types/userTypes/userTypes.js";

function Register() {
  const [formData, setFormData] = useState<IRegisterValues>({
    email: "",
    firstName: "",
    lastName: "",
    nickName: "",
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

  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
      }
    } else {
      console.log("Poop!");
      //redirect to error function which uses a redirection anchor to the first erroneous field;
    }
  }

  /*
  NPM CSRF
+	créer un Middleware qui check la présence d'un token CSRF
+	envoyer un field caché avec le token dans chaque form

Faille CSRF fix
https://dearsikandarkhan.medium.com/csrf-tokens-in-expressjs-node-js-web-framework-cc331069de2d

Pour limiter un message en caractères: faire à la fois côté server ET front
Pour éviter Command Injection, ne jamais faire d'appel qui pourront toucher à l'appel de commandes

skipfish
pentest-tools

<div>
<label> </label>
<input/>
</div>
==> eye button in the input field to turn password to text in the input type
*/

  return (
    <>
      <h1>Register</h1>
      <div className={styles.registerContainer}>
        <form onSubmit={sendRegistrationForm}>
          <ul>
            <li>
              <p>
                First name :{" "}
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
                Last name :{" "}
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
                Nickname :{" "}
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
                Email :{" "}
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
                Password :{" "}
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
                Confirm password :{" "}
                <input
                  type="password"
                  name="passwordMatch"
                  required
                  onInput={updateField}
                />
              </p>
            </li>
          </ul>
          <button type="submit">Register</button>
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
