import { useEffect, useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./ApplianceManipulationItem.module.scss";
import { IAppliance } from "../../common/types/applianceTypes/appliance.js";

function ApplianceManipulationItem(props: {appliance: IAppliance, primeForDeletion: (applainceId:string) => void, IsSelected: boolean}) {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
    const [isPrimed, setIsPrimed] = useState(false);
    const [validForUpdating, setValidForUpdating] = useState(false);

    function updateField(event) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
    
    function handleDeletePrimer(){
      props.primeForDeletion(props.appliance._id);
      setIsPrimed(!isPrimed);
    }

    
    async function sendUpdateForm(event) {
      event.preventDefault();
  
      try {
         const response = await APIService.updateApplianceById(
           props.appliance._id,
           formData.applianceName,
           formData.pictureURL,
           formData.pictureCaption,
        );
        setResponseMessage(response.message);
      } catch (err) {
        setError(err.message);
      }
    }

    async function sendDeleteApplianceCall() {
      try {
        const response = await APIService.deleteApplianceById(props.appliance._id)
        setResponseMessage(response.message);
      } catch (err) {
        setError(err.message);
      }
    }
    return(
        <>
        <h4>Appliance : {props.appliance.applianceName}</h4>
            <div className={props.IsSelected ? styles.primedContainer : styles.applianceManipulationItemContainer}>
            <button type="button" className={props.IsSelected ? styles.primedButton : ""} onClick={()=> handleDeletePrimer()}>{props.IsSelected  ? "●" : "○"}</button>
            <button type="button" onClick={sendDeleteApplianceCall}>Delete Appliance</button>
                <form onSubmit={sendUpdateForm}>
                <ul>
                    <li>
                      <p>
                          name :{" "}
                          <input type="text" name="applianceName" onInput={()=> {updateField(event); setValidForUpdating(!(event?.target.value === props.appliance.applianceName || event?.target.value.length === 0))}} placeholder={props.appliance.applianceName}/>
                      </p>
                    </li>
                    <li>
                      <p>
                      pictureURL :{" "}
                          <input type="text" name="pictureURL" onInput={()=> {updateField(event); setValidForUpdating(!(event?.target.value === props.appliance.picture.imageURL || event?.target.value.length === 0))}} placeholder={props.appliance.picture.imageURL}/>
                      </p>
                    </li>
                    <li>
                      <p>
                      pictureCaption :{" "}
                          <input type="text" name="pictureCaption" onInput={()=> {updateField(event); setValidForUpdating(!(event?.target.value === props.appliance.picture.imageCaption || event?.target.value.length === 0))}} placeholder={props.appliance.picture.imageCaption}/>
                      </p>
                    </li>
                </ul>
                <button type="submit" disabled={!validForUpdating}>Update Appliance</button>
                </form>
            </div>
            

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}

      
    </>
    )
}

export default ApplianceManipulationItem;
