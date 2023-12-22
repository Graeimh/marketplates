import { useEffect, useState } from "react";
import styles from "./RegisterPlace.module.scss";
import * as APIService from "../../services/api.js";
import { IPlaceRegisterValues } from "../../common/types/userTypes/userTypes.js";
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
  IPlaceData,
} from "../../common/types/placeTypes/placeTypes.js";

function RegisterPlace(props: { editPlaceId: string | undefined }) {
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
  const [temporaryCoordinates, setTemporaryCoordinates] =
    useState<IGPSCoordinates>({
      longitude: null,
      latitude: null,
    });
  const [tagQuery, setTagQuery] = useState("");

  const [error, setError] = useState(null);
  const provider = new OpenStreetMapProvider();

  const tagSelection: ITag[] = [...tagList].slice(0, 10);

  const tagListWithoutSelected: ITag[] = [
    ...new Set(
      tagList
        .filter(
          (tag) =>
            !formData.tagList
              .map((formDataTag) => formDataTag._id)
              .includes(tag._id)
        )
        .map((x) => JSON.stringify(x))
    ),
  ]
    .map((x) => JSON.parse(x))
    .sort((a: ITag, b: ITag) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );

  const tagListWithoutSelectedAndFiltered: ITag[] = [
    ...tagListWithoutSelected,
  ].filter((tag) => new RegExp(tagQuery).test(tag.name));

  const tagListToDisplay: ITag[] =
    tagQuery.length > 0 ? tagListWithoutSelectedAndFiltered : tagSelection;

  async function handleAdressButton(): Promise<void> {
    const results = await provider.search({ query: formData.address });
    setNewResults(results);
    if (results.length === 1) {
      setFormData({
        ...formData,
        address: results[0].label,
        gpsCoordinates: { latitude: results[0].y, longitude: results[0].x },
      });
    }
  }

  async function getUserTags() {
    try {
      const allTags = await APIService.fetchTagsForUser();
      setTagList(allTags.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function getPlaceEditValue(id: string) {
    try {
      const currentPlace = await APIService.fetchPlacesByIds([id]);
      const currentPlaceData: IPlaceData = currentPlace.data[0];
      const currentPlaceTagIds = currentPlaceData.tagsList;
      const placeTags = await APIService.fetchTagsByIds(currentPlaceTagIds);

      setFormData({
        name: currentPlaceData.name,
        description: currentPlaceData.description,
        address: currentPlaceData.address,
        gpsCoordinates: {
          longitude: currentPlaceData.gpsCoordinates.longitude,
          latitude: currentPlaceData.gpsCoordinates.latitude,
        },
        tagList: placeTags.data,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getUserTags();
    if (props.editPlaceId !== undefined) {
      getPlaceEditValue(props.editPlaceId);
    }
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

  function doubleClickMaphandler(lon: number, lat: number) {
    setFormData({
      ...formData,
      address: "",
      gpsCoordinates: {
        longitude: lon,
        latitude: lat,
      },
    });
  }

  async function sendRegistrationForm(event) {
    event.preventDefault();
    try {
      if (props.editPlaceId === undefined) {
        const response = await APIService.generatePlace(formData);
        setResponseMessage(response.message);
      } else {
        const response = await APIService.updatePlaceById(
          formData,
          props.editPlaceId
        );
        setResponseMessage(response.message);
      }
      navigate("/myplaces");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleManualCoordinates() {
    setFormData({
      ...formData,
      gpsCoordinates: {
        longitude: temporaryCoordinates.longitude
          ? temporaryCoordinates.longitude
          : formData.gpsCoordinates.longitude
          ? formData.gpsCoordinates.longitude
          : 0,
        latitude: temporaryCoordinates.latitude
          ? temporaryCoordinates.latitude
          : formData.gpsCoordinates.latitude
          ? formData.gpsCoordinates.latitude
          : 0,
      },
    });
  }

  return (
    <>
      <h1>Register a place</h1>
      <div className={styles.registerContainer}>
        <form>
          <ul>
            <li>
              <p>
                <label>Name : </label>
                <input
                  type="text"
                  name="name"
                  required
                  onInput={updateField}
                  value={formData.name}
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
                  value={formData.description}
                />
              </p>
            </li>
            <li>
              <p>
                <label>Address : </label>
                <input
                  type="text"
                  name="address"
                  onInput={updateField}
                  value={formData.address}
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
                            address: result.label,
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
            <li>
              <p>
                Off the grid? Write the coordinates here!
                <label>Latitude : </label>
                <input
                  type="number"
                  name="latitude"
                  min="-90"
                  max="90"
                  onChange={(e) => {
                    setTemporaryCoordinates({
                      ...temporaryCoordinates,
                      latitude: Number(e.target.value),
                    });
                  }}
                  placeholder={
                    formData.gpsCoordinates.latitude !== null
                      ? formData.gpsCoordinates.latitude.toString()
                      : "0"
                  }
                />
                <label>Longitude : </label>
                <input
                  type="number"
                  name="longitude"
                  min="-180"
                  max="180"
                  onChange={(e) =>
                    setTemporaryCoordinates({
                      ...temporaryCoordinates,
                      longitude: Number(e.target.value),
                    })
                  }
                  placeholder={
                    formData.gpsCoordinates.longitude !== null
                      ? formData.gpsCoordinates.longitude.toString()
                      : "0"
                  }
                />
                <button type="button" onClick={handleManualCoordinates}>
                  Use coordinates instead!
                </button>
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
              doubleClickEvent={doubleClickMaphandler}
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
                  <Popup>
                    <h3>{formData.name}</h3>
                    <p>{formData.description}</p>
                    <ul>
                      {formData.tagList.map((tag) => (
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
                    </ul>
                  </Popup>
                </Marker>
              )}
          </MapContainer>

          <label>Search for a tag : </label>
          <input
            type="text"
            name="tagQuery"
            onChange={(e) => {
              setTagQuery(e.target.value);
            }}
          />

          <p>Select tags:</p>
          {tagListToDisplay.length > 0 &&
            tagListToDisplay.map((tag) => (
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
                isTiny={false}
                key={tag.name}
              />
            ))}
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
                isTiny={false}
                key={tag.name}
              />
            ))}

          <button
            type="button"
            disabled={!isValidForSending}
            onClick={sendRegistrationForm}
          >
            {props.editPlaceId === undefined ? "Register place" : "Edit place"}
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
