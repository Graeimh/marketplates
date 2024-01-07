import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ILoginValues,
  ISessionValues,
} from "../../../common/types/userTypes/userTypes.js";
import * as authenticationService from "../../../services/authenticationService.js";
import styles from "./Login.module.scss";
import formStyles from "../../../common/styles/Forms.module.scss";
import ReCAPTCHA from "react-google-recaptcha";
import * as jose from "jose";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { Helmet } from "react-helmet";
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes.js";

function Login(props: {
  contextSetter: React.Dispatch<ISessionValues>;
  messageSetter: React.Dispatch<IMessageValues>;
}) {
  // Setting states
  // Contains the data needed for a user to log in
  const [loginData, setLoginData] = useState<ILoginValues>({
    email: "",
    password: "",
  });

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

  // Serves to check if all values have the correct number of characters
  const [validForSending, setValidForSending] = useState(false);

  function updateField(event) {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  }

  function decideLoginValidity() {
    setValidForSending(
      loginData.email.length > 3 && loginData.password.length >= 12
    );
  }

  useEffect(() => {
    decideLoginValidity();
  }, [loginData]);

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
          localStorage.setItem("refreshToken", response.refreshToken);
          const refreshTokenData: ISessionValues = jose.decodeJwt(
            response.refreshToken
          );
          props.contextSetter(refreshTokenData);
          props.messageSetter({
            message: "Welcome!",
            successStatus: true,
          });
          navigate("/");
        } catch (err) {
          props.messageSetter({
            message: "Invalid credentials",
            successStatus: false,
          });
          setCanRetry(false);
          putLoginToSleep(1500);
          window.grecaptcha.reset();
        }
      } else {
        props.messageSetter({
          message: "The captcha was not checked, try again.",
          successStatus: false,
        });
        setCanRetry(false);
        putLoginToSleep(500);
      }
    } else {
      props.messageSetter({
        message: "Please wait for a moment before trying again.",
        successStatus: false,
      });
      window.grecaptcha.reset();
    }
  }

  return (
    <>
      <Helmet>
        <title>Login</title>
        <link rel="canonical" href="http://localhost:5173/login" />
      </Helmet>

      <article className={formStyles.formContainer}>
        <form onSubmit={sendLoginForm}>
          <h2>Sign in</h2>
          <ul>
            <li>
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="text"
                name="email"
                required
                onInput={updateField}
                placeholder="Email"
              />
            </li>
            <li>
              <label htmlFor="password">Password</label>
              <br />
              <input
                type="password"
                name="password"
                required
                onInput={updateField}
                placeholder="Password"
              />
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
          <div className={formStyles.finalButtonContainer}>
            <button type="submit" disabled={!validForSending}>
              Log in
            </button>
          </div>

          <span id={styles.registerAlternative}>Don't have an account?</span>

          <div id={styles.registerButtonContainer}>
            <button type="button" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        </form>
      </article>
    </>
  );
}

export default Login;
