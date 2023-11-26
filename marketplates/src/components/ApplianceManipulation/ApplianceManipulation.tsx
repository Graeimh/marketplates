import { useEffect, useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./ApplianceManipulation.module.scss";
import { IAppliance } from "../../common/types/applianceTypes/appliance.js";
import ApplianceManipulationItem from "../ApplianceManipulationItem/ApplianceManipulationItem.js";


function ApplianceManipulation() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [applianceList, setApplianceList] = useState<IAppliance[]>([])
    const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    async function reportResults() {
      try {
        const allAppliances = await APIService.fetchAppliances();
        setApplianceList(allAppliances.data);
        // const oneAppliance = await APIService.fetchAppliancesByIds([allAppliances.data[0]._id, allAppliances.data[1]._id]);
      } catch (err) {
        setError(err.message);
      }
    }

    useEffect(() => {
      reportResults();
    }, []);

    function updateField(event) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }

    function manageDeletionList(id:string) {
      const foundIndex = primedForDeletionList.indexOf(id);
      if (foundIndex === -1) {
        setPrimedForDeletionList([...primedForDeletionList, id])
      } else {
        setPrimedForDeletionList(primedForDeletionList.filter(applianceId => applianceId !== id))
      }
    }

    function selectAllAppliances(){
      if (!isAllSelected && primedForDeletionList.length === 0 || primedForDeletionList.length !== applianceList.length) {
      setPrimedForDeletionList(applianceList.map(appliance => appliance._id));
    } else {
      setPrimedForDeletionList([])
    }
      setIsAllSelected(!isAllSelected);
    }
  
    function cancelSelection(){
      setPrimedForDeletionList([]);
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

    async function deletePrimedForDeletion(){
      try {
        const responseForDelete =  APIService.deleteAppliancesByIds(primedForDeletionList)
        const responseforDataRenewal =  APIService.fetchAppliances();
        
        const combinedResponse = await Promise.all([responseForDelete, responseforDataRenewal]).then((values) => values.join(" ") )
        setResponseMessage(combinedResponse)

        console.log(`Successfully deleted ${primedForDeletionList.length} appliances`)
        setPrimedForDeletionList([])
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

      <button type="button" onClick={()=>deletePrimedForDeletion() }>Delete {primedForDeletionList.length} appliances </button>
      {primedForDeletionList.length !== applianceList.length && <button type="button" onClick={()=>selectAllAppliances() }>Select all ({applianceList.length}) appliances </button>}
      <button type="button" onClick={()=>cancelSelection() }>Cancel selection </button>


      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}

      {applianceList.length > 0 && applianceList.map( appliance => 
        <ApplianceManipulationItem appliance={appliance} primeForDeletion={manageDeletionList} key={appliance._id} IsSelected={primedForDeletionList.indexOf(appliance._id) !== -1}/>)}
    </>
    )
}

export default ApplianceManipulation;
