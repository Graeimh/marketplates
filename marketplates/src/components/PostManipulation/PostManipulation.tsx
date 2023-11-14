import { useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./PostManipulation.module.scss";


function PostManipulation() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
  
    function updateField(event) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  
    async function sendForm(event) {
      event.preventDefault();
  
      try {
        const response = await APIService.register(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password,
          formData.passwordConfirm
        );
        setResponseMessage(response.message);
      } catch (err) {
        setError(err.message);
      }
    }
    return(
        <>
        <h1>PostManipulation</h1>
            <div className={styles.registerContainer}>
                <form onSubmit={sendForm}>
                <ul>
                    <li>
                    <p>
                        First name :{" "}
                        <input type="text" name="firstName" onInput={updateField} />
                    </p>
                    </li>
                    <li>
                    <p>
                        Last name :{" "}
                        <input type="text" name="lastName" onInput={updateField} />
                    </p>
                    </li>
                    <li>
                    <p>
                        Email : <input type="text" name="email" onInput={updateField} />
                    </p>
                    </li>
                    <li>
                    <p>
                        Password :{" "}
                        <input type="password" name="password" onInput={updateField} />
                    </p>
                    </li>
                    <li>
                    <p>
                        Password confirmation :{" "}
                        <input
                        type="password"
                        name="passwordConfirm"
                        onInput={updateField}
                        />
                    </p>
                    </li>
                </ul>
                <button type="submit">Register</button>
                </form>
            </div>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
    </>
    )
}

export default PostManipulation;
