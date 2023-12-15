import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILoginValues } from "../../common/types/userTypes/userTypes";
import * as APIService from "../../services/api.js";
import styles from "./Login.module.scss";
import ReCAPTCHA from "react-google-recaptcha";

function createTemporaryMessage(
  message: string,
  time: number,
  setResponseMessage: React.Dispatch<React.SetStateAction<string>>
) {
  setResponseMessage(message);
  setTimeout(() => {
    setResponseMessage("");
  }, time);
}
function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<ILoginValues>({
    email: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);
  const [canRetry, setCanRetry] = useState(true);
  const captcha = useRef(null);

  function putLoginToSleep(time: number) {
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
        const response = await APIService.login(loginData, captchaToken);
        sessionStorage.setItem("refreshToken", response.refreshToken);
        createTemporaryMessage(response.message, 1500, setResponseMessage);
        navigate("/explore");
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
