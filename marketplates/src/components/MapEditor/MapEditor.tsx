import { useEffect, useState } from "react";
import styles from "./MapEditor.module.scss";
import * as APIService from "../../services/api.js";
import {
  IMapValues,
  IPlaceRegisterValues,
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
  IPlaceData,
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
  const [temporaryCoordinates, setTemporaryCoordinates] =
    useState<IGPSCoordinates>({
      longitude: null,
      latitude: null,
    });
  const [error, setError] = useState(null);
  const provider = new OpenStreetMapProvider();

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

  // async function getMapEditValue(id: string) {
  //   try {
  //     const currentPlace = await APIService.fetchPlacesByIds([id]);
  //     const currentPlaceData: IPlaceData = currentPlace.data[0];
  //     const currentPlaceTagIds = currentPlaceData.tagsList;
  //     const placeTags = await APIService.fetchTagsByIds(currentPlaceTagIds);

  //     setFormData({
  //       name: currentPlaceData.name,
  //       description: currentPlaceData.description,
  //       address: currentPlaceData.address,
  //       gpsCoordinates: {
  //         longitude: currentPlaceData.gpsCoordinates.longitude,
  //         latitude: currentPlaceData.gpsCoordinates.latitude,
  //       },
  //       tagList: placeTags.data,
  //     });
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // }

  useEffect(() => {
    getUserTags();
    if (props.editedMap !== undefined) {
      // getPlaceEditValue(props.editPlaceId);
    }
  }, []);

  function decideRegistration() {
    setIsValidForSending(
      formData.name.length > 1 &&
        formData.description.length > 1 &&
        formData.address.length > 1
    );
  }

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

  console.log(formData.gpsCoordinates);
  return (
    <>
      <h1>Register a place</h1>

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
              <Popup>Hi!</Popup>
            </Marker>
          )}
      </MapContainer>

      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
}

export default MapEditor;
