import { useEffect, useState } from "react";
import styles from "./MapEditor.module.scss";
import * as APIService from "../../services/api.js";
import {
  IMapValues,
  PrivacyStatus,
  UserPrivileges,
} from "../../common/types/userTypes/userTypes.js";
import { useNavigate } from "react-router-dom";
import { ITag } from "../../common/types/tagTypes/tagTypes.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Tag from "../Tag/Tag.js";
import MapValuesManager from "../MapValuesManager/MapValuesManager.js";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import {
  IGPSCoordinates,
  IPlace,
  IPlaceUpdated,
} from "../../common/types/placeTypes/placeTypes.js";

function MapEditor(props: { editedMap: string | undefined }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IMapValues>({
    name: "",
    description: "",
    privacyStatus: PrivacyStatus.Public,
    participants: [
      {
        userId: "a",
        userPrivileges: UserPrivileges.Owner,
      },
    ],
    placeIterationIds: [],
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [tagList, setTagList] = useState<ITag[]>([]);
  const [newResults, setNewResults] = useState<SearchResult<RawResult>[]>([]);
  const [coordinates, setCoordinates] = useState<IGPSCoordinates>({
    longitude: null,
    latitude: null,
  });
  const [error, setError] = useState(null);
  const [placeList, setPlaceList] = useState<IPlace[]>([]);
  const [addressQuery, setAddressQuery] = useState<string>("");
  const [isValidForSending, setIsValidForSending] = useState<boolean>(false);
  const [iterationValues, setIterationValues] = useState<IPlaceUpdated>({
    address: "",
    description: "",
    gpsCoordinates: {
      longitude: null,
      latitude: null,
    },
    name: "",
    tagsIdList: [],
    tagsList: [],
  });

  const provider = new OpenStreetMapProvider();

  console.log("coordinates", coordinates);
  async function handleAdressButton(): Promise<void> {
    console.log("Wah", addressQuery);
    const results = await provider.search({ query: addressQuery });
    setNewResults(results);
    if (results.length === 1) {
      setCoordinates({ latitude: results[0].y, longitude: results[0].x });
    }
  }

  async function getMapEditorTools() {
    try {
      const allTags = await APIService.fetchTagsForUser();
      setTagList(allTags.data);
      const allPlaces = await APIService.fetchAllPlaces();
      setPlaceList(allPlaces.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getMapEditorTools();
  }, []);

  function decideIterationValidity() {
    setIsValidForSending(
      formData.name.length > 1 && formData.description.length > 1
    );
  }

  function updateField(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function sendRegistrationForm(event) {
    event.preventDefault();
    try {
      const response = await APIService.generateMap(formData);
    } catch (err) {
      setError(err.message);
    }
  }

  function doubleClickMaphandler(lon: number, lat: number) {
    setCoordinates({
      longitude: lon,
      latitude: lat,
    });
  }

  // function handleManualCoordinates() {
  //   setFormData({
  //     ...formData,
  //     gpsCoordinates: {
  //       longitude: temporaryCoordinates.longitude
  //         ? temporaryCoordinates.longitude
  //         : formData.gpsCoordinates.longitude
  //         ? formData.gpsCoordinates.longitude
  //         : 0,
  //       latitude: temporaryCoordinates.latitude
  //         ? temporaryCoordinates.latitude
  //         : formData.gpsCoordinates.latitude
  //         ? formData.gpsCoordinates.latitude
  //         : 0,
  //     },
  //   });
  // }

  const mapmarkers: IPlaceUpdated[] = [];
  for (const place of placeList) {
    const marker: IPlaceUpdated = {
      ...place,
      tagsIdList: place.tagsList,
      tagsList: tagList.filter((tag) => place.tagsList.includes(tag._id)),
    };
    mapmarkers.push(marker);
  }

  return (
    <>
      <h1>Map editor</h1>
      <form>
        <div>
          <input
            type="radio"
            id="privacyStatus1"
            name="privacyStatus"
            value={PrivacyStatus.Private}
            onChange={() => {
              setFormData({
                ...formData,
                privacyStatus: PrivacyStatus.Private,
              });
            }}
          />
          <label htmlFor="privacyStatus1">Private</label>

          <input
            type="radio"
            id="privacyStatus2"
            name="privacyStatus"
            value={PrivacyStatus.Protected}
            onChange={() => {
              setFormData({
                ...formData,
                privacyStatus: PrivacyStatus.Protected,
              });
            }}
          />
          <label htmlFor="privacyStatus2">Friends only</label>

          <input
            type="radio"
            id="privacyStatus3"
            name="privacyStatus"
            value={PrivacyStatus.Public}
            onChange={() => {
              setFormData({ ...formData, privacyStatus: PrivacyStatus.Public });
            }}
          />
          <label htmlFor="privacyStatus3">Public</label>
        </div>
        <label>Get an address : </label>
        <input
          type="text"
          name="address"
          onInput={(e) => {
            setAddressQuery(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            handleAdressButton();
          }}
        >
          Get locations
        </button>
      </form>
      {newResults.length > 1 && (
        <ul>
          {newResults.map((result) => (
            <li
              onClick={() => {
                setCoordinates({
                  longitude: result.x,
                  latitude: result.y,
                });
                setNewResults([]);
              }}
            >
              {result.label}
            </li>
          ))}
        </ul>
      )}

      <MapContainer
        style={{ height: "30rem", width: "100%" }}
        center={[48.85, 2.34]}
        zoom={5}
        maxZoom={18}
      >
        <MapValuesManager
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          doubleClickEvent={doubleClickMaphandler}
        />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {mapmarkers &&
          mapmarkers.map((place) => (
            <Marker
              position={[
                place.gpsCoordinates.latitude
                  ? place.gpsCoordinates.latitude
                  : 0,
                place.gpsCoordinates.longitude
                  ? place.gpsCoordinates.longitude
                  : 0,
              ]}
            >
              <Popup>
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                <ul>
                  {place.tagsList.map((tag) => (
                    <li>
                      <Tag
                        tagName={tag.name}
                        customStyle={{
                          color: tag.nameColor,
                          backgroundColor: tag.backgroundColor,
                        }}
                        isTiny={true}
                      />
                    </li>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIterationValues(place);
                    }}
                  >
                    Create iteration
                  </button>
                </ul>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {iterationValues.name.length > 0 && (
        <>
          <h2>Create an iteration</h2>
          <form>
            {" "}
            <ul>
              <li>
                <p>
                  <label>Name : </label>
                  <input
                    type="text"
                    name="name"
                    required
                    onInput={(e) => {
                      setIterationValues({
                        ...iterationValues,
                        name: e.target.value,
                      });
                    }}
                    value={iterationValues.name}
                  />
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
                    value={(e) => {
                      setIterationValues({
                        ...iterationValues,
                        description: e.target.value,
                      });
                    }}
                  />
                </p>
              </li>
            </ul>
          </form>
        </>
      )}

      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <button
        type="button"
        onClick={() => {
          sendRegistrationForm();
          navigate("mymaps");
        }}
      >
        Save and quit
      </button>
    </>
  );
}

export default MapEditor;
