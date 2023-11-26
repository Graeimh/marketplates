import { useState } from "react";
import { ILoginValues } from "../../common/types/userTypes/userTypes";
import * as APIService from "../../services/api.js";
import styles from "./Login.module.scss";

function Login() {
  const [loginData, setLoginData] = useState<ILoginValues>({
    email: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);

  function updateField(event) {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  }

  async function sendLoginForm(event) {
    event.preventDefault();
    const token = "";
    try {
      const response = await APIService.login(loginData, token);
      setResponseMessage(response.message);
    } catch (err) {
      console.log("Poop!");
      setError(err.message);
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
