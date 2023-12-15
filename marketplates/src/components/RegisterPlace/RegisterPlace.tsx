import { useContext, useEffect, useState } from "react";
import styles from "./RegisterPlace.module.scss";
import * as APIService from "../../services/api.js";
import { IPlaceRegisterValues } from "../../common/types/userTypes/userTypes.js";
import { useNavigate } from "react-router-dom";
import { ITag } from "../../common/types/tagTypes/tagTypes.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import UserContext from "../UserContext/UserContext.js";
import Tag from "../Tag/Tag.js";
import MapValuesManager from "../MapValuesManager/MapValuesManager.js";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";

function RegisterPlace() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IPlaceRegisterValues>({
    name: "",
    description: "",
    address: "",
    gpsCoordinates: {
      longitude: null,
      latitude: null,
    },
    tagList: [],
  });
  const [isValidForSending, setIsValidForSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [tagList, setTagList] = useState<ITag[]>([]);
  const [newResults, setNewResults] = useState<SearchResult<RawResult>[]>([]);

  const [error, setError] = useState(null);

  console.log(newResults);

  const provider = new OpenStreetMapProvider();

  async function handleAdressButton(): void {
    const results = await provider.search({ query: formData.address });
    setNewResults(results);
  }

  async function getUserTags() {
    try {
      const allTags = await APIService.fetchTagsForUser();
      setTagList(allTags.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getUserTags();
  }, []);

  function decideRegistration() {
    setIsValidForSending(
      formData.name.length > 1 &&
        formData.description.length > 1 &&
        formData.address.length > 1
    );
  }

  useEffect(() => {
    decideRegistration();
  }, [
    formData.name,
    formData.description,
    formData.address,
    formData.gpsCoordinates,
  ]);

  function updateField(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function sendRegistrationForm(event) {
    event.preventDefault();
    const token = "";
    try {
      const response = await APIService.generatePlace(formData, token);
      setResponseMessage(response.message);
      navigate("/myplaces");
    } catch (err) {
      setError(err.message);
    }
    console.log("Poop!");
  }

  return (
    <>
      <h1>Register a place</h1>
      <div className={styles.registerContainer}>
        <form onSubmit={sendRegistrationForm}>
          <ul>
            <li>
              <p>
                <label>Name : </label>
                <input type="text" name="name" required onInput={updateField} />
              </p>
            </li>
            <li>
              <p>
                <label>Description : </label>
                <input
                  type="text"
                  name="description"
                  required
                  onInput={updateField}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Address : </label>
                <input
                  type="text"
                  name="address"
                  required
                  onInput={updateField}
                />
                <button type="button" onClick={handleAdressButton}>
                  Get locations
                </button>
                {newResults.length > 1 && (
                  <ul>
                    {newResults.map((result) => (
                      <li
                        onClick={() => {
                          setFormData({
                            ...formData,
                            gpsCoordinates: {
                              longitude: result.x,
                              latitude: result.y,
                            },
                          });
                          setNewResults([]);
                        }}
                      >
                        {result.label}
                      </li>
                    ))}
                  </ul>
                )}
              </p>
            </li>
          </ul>

          <MapContainer
            style={{ height: "30rem", width: "100%" }}
            center={[48.85, 2.34]}
            zoom={5}
            maxZoom={18}
          >
            <MapValuesManager
              latitude={formData.gpsCoordinates.latitude}
              longitude={formData.gpsCoordinates.longitude}
            />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {formData.gpsCoordinates.latitude !== null &&
              formData.gpsCoordinates.longitude !== null && (
                <Marker
                  position={[
                    formData.gpsCoordinates.latitude,
                    formData.gpsCoordinates.longitude,
                  ]}
                >
                  <Popup>Hi!</Popup>
                </Marker>
              )}
          </MapContainer>

          <p>Selected tags :</p>
          {formData.tagList.length > 0 &&
            formData.tagList.map((tag) => (
              <Tag
                customStyle={{
                  color: tag.nameColor,
                  backgroundColor: tag.backgroundColor,
                }}
                tagName={tag.name}
                onClose={() => {
                  setFormData({
                    ...formData,
                    tagList: formData.tagList.filter(
                      (tagId) => tagId._id !== tag._id
                    ),
                  });
                  setTagList([...tagList, tag]);
                }}
                isIn={formData.tagList.some(
                  (tagData) => tagData._id === tag._id
                )}
              />
            ))}
          <p>Select tags:</p>
          {tagList.length > 0 &&
            tagList.map((tag) => (
              <Tag
                customStyle={{
                  color: tag.nameColor,
                  backgroundColor: tag.backgroundColor,
                }}
                tagName={tag.name}
                onClick={() => {
                  setFormData({
                    ...formData,
                    tagList: [...formData.tagList, tag],
                  });
                  setTagList(tagList.filter((tagId) => tagId._id !== tag._id));
                }}
                isIn={formData.tagList.some(
                  (tagData) => tagData._id === tag._id
                )}
                key={tag.name}
              />
            ))}
          <button type="submit" disabled={isValidForSending}>
            Register place
          </button>
        </form>
      </div>

      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
}

export default RegisterPlace;
