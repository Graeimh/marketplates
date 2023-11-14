import { useEffect, useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./ApplianceManipulation.module.scss";


function ApplianceManipulation() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
  
    useEffect(() => {
      async function reportResults() {
        try {
          const allAppliances = await APIService.fetchAppliances()
          const oneAppliance = await APIService.fetchAppliancesByIds([allAppliances[0]._id, allAppliances[1]._id]);

          console.log('allAppliances', allAppliances);
          console.log('oneAppliance', oneAppliance);
        } catch (err) {
          setError(err.message);
        }
      }
      reportResults();
    }, []);

    function updateField(event) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  
    async function sendForm(event) {
      event.preventDefault();
  
      try {
        const response = await APIService.generateAppliance(
          formData.applianceName,
          formData.pictureURL,
          formData.pictureCaption,
        );
        setResponseMessage(response.message);
      } catch (err) {
        setError(err.message);
      }
    }
    return(
        <>
        <h1>ApplianceManipulation</h1>
            <div className={styles.registerContainer}>
                <form onSubmit={sendForm}>
                <ul>
                    <li>
                      <p>
                          name :{" "}
                          <input type="text" name="applianceName" onInput={updateField} />
                      </p>
                    </li>
                    <li>
                      <p>
                      pictureURL :{" "}
                          <input type="text" name="pictureURL" onInput={updateField} />
                      </p>
                    </li>
                    <li>
                      <p>
                      pictureCaption :{" "}
                          <input type="text" name="pictureCaption" onInput={updateField} />
                      </p>
                    </li>
                </ul>
                <button type="submit">Create Appliance</button>
                </form>
            </div>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
    </>
    )
}

export default ApplianceManipulation;
