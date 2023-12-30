import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ILoginValues,
  ISessionValues,
} from "../../../common/types/userTypes/userTypes.js";
import * as authenticationService from "../../../services/authenticationService.js";
import styles from "../LoginRegister.module.scss";
import ReCAPTCHA from "react-google-recaptcha";
import createTemporaryMessage from "../../../common/functions/createTemporaryMessage.js";
import * as jose from "jose";
import UserContext from "../../Contexts/UserContext/UserContext.js";

function Login(props: { contextSetter: React.Dispatch<ISessionValues> }) {
  // Setting states
  // Contains the data needed for a user to log in
  const [loginData, setLoginData] = useState<ILoginValues>({
    email: "",
    password: "",
  });

  // Response message display
  const [responseMessage, setResponseMessage] = useState("");

  // Error message display
  const [error, setError] = useState("");

  // Sets whether or not the user can try to login again
  const [canRetry, setCanRetry] = useState(true);

  const navigate = useNavigate();

  // Sets up the captcha value to be changed upon clicking
  const captcha = useRef(null);

  const value = useContext(UserContext);

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
    // Check if an user is already logged in, if so, redirect them without going through the log in process
    if (value.userId.length > 0) {
      navigate("/");
    }
    if (canRetry) {
      if (
        captcha.current !== null &&
        captcha.current.getValue().toString().length > 0
      ) {
        try {
          const captchaToken: string = captcha.current.getValue().toString();
          const response = await authenticationService.login(
            loginData,
            captchaToken
          );
          // Sets the refresh token within the session storage
          sessionStorage.setItem("refreshToken", response.refreshToken);
          const refreshTokenData: ISessionValues = jose.decodeJwt(
            response.refreshToken
          );
          props.contextSetter(refreshTokenData);
          createTemporaryMessage(response.message, 1500, setResponseMessage);
          navigate("/");
        } catch (err) {
          createTemporaryMessage(err.message, 1500, setError);
          setCanRetry(false);
          putLoginToSleep(1500);
          window.grecaptcha.reset();
        }
      } else {
        createTemporaryMessage(
          "The captcha was not checked, try again.",
          1500,
          setResponseMessage
        );
        setCanRetry(false);
        putLoginToSleep(500);
      }
    } else {
      createTemporaryMessage(
        "Please wait for a moment before trying again.",
        1500,
        setResponseMessage
      );
      window.grecaptcha.reset();
    }
  }

  return (
    <>
      <div id={styles.formContainer}>
        <form onSubmit={sendLoginForm}>
          <h2>Sign in</h2>
          <ul>
            <li>
              <div>
                <label htmlFor="email">Email</label>
                <br />
                <input
                  type="text"
                  name="email"
                  required
                  onInput={updateField}
                  placeholder="Email"
                />
              </div>
            </li>
            <li>
              <div>
                <label htmlFor="password">Password</label>
                <br />
                <input
                  type="password"
                  name="password"
                  required
                  onInput={updateField}
                  placeholder="Password"
                />
              </div>
            </li>
          </ul>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_REACT_APP_GOOGLE_SITE_KEY}
            ref={captcha}
            id={styles.captchaContainer}
            style={{
              transform: "scale(0.77)",
            }}
          />
          <div id={styles.finalButtonContainer}>
            <button type="submit">Log in</button>
          </div>

          <div id={styles.registerAlternative}>Don't have an account?</div>

          <div id={styles.registerButtonContainer}>
            <button type="button" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
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
