import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILoginValues } from "../../../common/types/userTypes/userTypes.js";
import * as authenticationService from "../../../services/authenticationService.js";
import styles from "./Login.module.scss";
import ReCAPTCHA from "react-google-recaptcha";
import createTemporaryMessage from "../../../common/functions/createTemporaryMessage.js";

function Login() {
  // Setting states
  // Contains the data needed for a user to log in
  const [loginData, setLoginData] = useState<ILoginValues>({
    email: "",
    password: "",
  });

  // Response message display
  const [responseMessage, setResponseMessage] = useState("");

  // Error message display
  const [error, setError] = useState(null);

  // Sets whether or not the user can try to login again
  const [canRetry, setCanRetry] = useState(true);

  const navigate = useNavigate();

  // Sets up the captcha value to be changed upon clicking
  const captcha = useRef(null);

  function putLoginToSleep(time: number) {
    // Upon failing logging in, a set of time is given until the next login attempt
    setTimeout(() => {
      setCanRetry(true);
    }, time);
  }

  function updateField(event) {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  }

  async function sendLoginForm(event) {
    event.preventDefault();
    if (canRetry && captcha.current !== null) {
      try {
        const captchaToken: string = captcha.current.getValue().toString();
        const response = await authenticationService.login(
          loginData,
          captchaToken
        );
        // Sets the refresh token within the session storage
        sessionStorage.setItem("refreshToken", response.refreshToken);
        createTemporaryMessage(response.message, 1500, setResponseMessage);
        navigate("/");
      } catch (err) {
        setError(err.message);
        setCanRetry(false);
        putLoginToSleep(1500);
      }
      captcha.current = null;
    } else {
      createTemporaryMessage(
        "Please wait for a moment before trying again.",
        1500,
        setResponseMessage
      );
    }
  }

  return (
    <>
      <h1>Login</h1>
      <div className={styles.loginContainer}>
        <form onSubmit={sendLoginForm}>
          <ul>
            <li>
              <p>
                Email :{" "}
                <input
                  type="text"
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
          </ul>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_REACT_APP_GOOGLE_SITE_KEY}
            ref={captcha}
          />
          <button type="submit">Log in</button>
        </form>
      </div>

      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
}

export default Login;
