import { useContext, useEffect, useState } from "react";
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
  IMarkersForMap,
  IPlace,
  IPlaceFilterQuery,
  IPlaceUpdated,
} from "../../common/types/placeTypes/placeTypes.js";
import UserContext from "../UserContext/UserContext.js";

function MapEditor(props: { editedMap: string | undefined }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IMapValues>({
    name: "",
    description: "",
    privacyStatus: PrivacyStatus.Public,
    participants: [],
    placeIterations: [],
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [tagList, setTagList] = useState<ITag[]>([]);
  const [tagFilterList, setTagFilterList] = useState<ITag[]>([]);
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
    _id: "",
    name: "",
    tagsIdList: [],
    tagsList: [],
  });
  const [iterationsList, setIterationsList] = useState<IPlaceUpdated[]>([]);
  const [placeFilterQuery, setPlaceFilterQuery] = useState<IPlaceFilterQuery>({
    name: "",
    tagName: "",
    tags: [],
  });
  const provider = new OpenStreetMapProvider();

  async function handleAdressButton(): Promise<void> {
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
      setTagFilterList(allTags.data);
      const allPlaces = await APIService.fetchAllPlaces();
      setPlaceList(allPlaces.data);
      if (props.editedMap) {
        const mapToEdit = await APIService.fetchMapsByIds([props.editedMap]);
        const mapIterations = await APIService.fetchPlaceIterationsByIds(
          mapToEdit.data[0].placeIterationIds
        );
        const mapToEditIterations: IPlaceUpdated[] = mapIterations.data.map(
          (iteration) => ({
            address: allPlaces.data.find(
              (place) => place._id === iteration.placeId
            )?.address,
            description: iteration.customDescription,
            gpsCoordinates: {
              longitude: iteration.gpsCoordinates.longitude,
              latitude: iteration.gpsCoordinates.latitude,
            },
            _id: iteration._id,
            name: iteration.customName,
            place_id: iteration.placeId,
            tagsIdList: iteration.customTagIds,
            tagsList: allTags.data.filter((tag) =>
              iteration.customTagIds.some(
                (iterationTag) => tag._id === iterationTag
              )
            ),
          })
        );

        setFormData({
          name: mapToEdit.data[0].name,
          description: mapToEdit.data[0].description,
          privacyStatus: mapToEdit.data[0].privacyStatus,
          participants: mapToEdit.data[0].participants,
          placeIterations: mapToEditIterations,
        });
        setIterationsList(mapToEditIterations);
        setIsValidForSending(true);
      }
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    getMapEditorTools();
  }, []);

  function decideMapValidity() {
    setIsValidForSending(
      formData.name.length > 1 && formData.description.length > 1
    );
  }

  function updateField(event) {
    decideMapValidity();
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function doubleClickMaphandler(lon: number, lat: number) {
    setCoordinates({
      longitude: lon,
      latitude: lat,
    });
  }

  const mapmarkers: IPlaceUpdated[] = [];
  for (const place of placeList) {
    const marker: IPlaceUpdated = {
      ...place,
      tagsIdList: place.tagsList,
      tagsList: tagList.filter((tag) => place.tagsList.includes(tag._id)),
    };
    mapmarkers.push(marker);
  }

  const mapMarkersAndIterations: IMarkersForMap[] = [];
  for (const marker of mapmarkers) {
    const iterationToList = iterationsList.find(
      (iteration) =>
        iteration._id === marker._id || iteration.place_id === marker._id
    );
    if (iterationToList) {
      const iteration = { ...iterationToList, isIteration: true };
      mapMarkersAndIterations.push(iteration);
    } else {
      const regularMarker = { ...marker, isIteration: false };
      mapMarkersAndIterations.push(regularMarker);
    }
  }

  async function createIteration(event) {
    event.preventDefault();
    if (iterationValues.name.length > 0) {
      setFormData({
        ...formData,
        placeIterations: [...formData.placeIterations, iterationValues],
      });
      setIterationsList([...iterationsList, iterationValues]);
      setIterationValues({
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
    }
  }

  async function sendRegistrationForm(event) {
    event.preventDefault();
    try {
      await APIService.generateMap(formData);
    } catch (err) {
      setError(err.message);
    }
  }

  const tagSelection: ITag[] = [...tagFilterList].slice(0, 10);

  const tagListWithoutSelected: ITag[] = [
    ...new Set(
      tagFilterList.filter(
        (tag) =>
          !placeFilterQuery.tags
            .map((formDataTag) => formDataTag._id)
            .includes(tag._id)
      )
    ),
  ];

  const tagListWithoutSelectedAndFiltered: ITag[] = [
    ...tagListWithoutSelected,
  ].filter((tag) => new RegExp(placeFilterQuery.tagName).test(tag.name));

  const tagListToDisplay: ITag[] =
    placeFilterQuery.tagName.length > 0
      ? tagListWithoutSelectedAndFiltered
      : tagSelection;

  const mapMarkersAfterFilter: IMarkersForMap[] = [...mapMarkersAndIterations]
    .filter((marker) => new RegExp(placeFilterQuery.name).test(marker.name))
    .filter((marker) =>
      placeFilterQuery.tags.every((tag) => marker.tagsList.includes(tag))
    );

  return (
    <>
      <h1>Map editor</h1>

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

        {mapMarkersAfterFilter.length > 0 &&
          mapMarkersAfterFilter.map((place) => (
            <Marker
              position={[
                place.gpsCoordinates.latitude
                  ? place.gpsCoordinates.latitude
                  : 0,
                place.gpsCoordinates.longitude
                  ? place.gpsCoordinates.longitude
                  : 0,
              ]}
              key={place.name}
            >
              <Popup key={place.name}>
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
                        key={tag._id}
                      />
                    </li>
                  ))}
                  {!place.isIteration && (
                    <button
                      type="button"
                      onClick={() => {
                        setIterationValues(place);
                      }}
                    >
                      Create iteration
                    </button>
                  )}
                </ul>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      <h3>Map data</h3>
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
        </ul>

        <h3>Privacy</h3>

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
            checked={formData.privacyStatus === PrivacyStatus.Private}
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
            checked={formData.privacyStatus === PrivacyStatus.Protected}
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
            checked={formData.privacyStatus === PrivacyStatus.Public}
          />
          <label htmlFor="privacyStatus3">Public</label>
        </div>

        <h3>Find an address</h3>

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
              key={result.label}
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

      <h3>Filter</h3>
      <p>
        <label>Filter places by name: </label>
        <input
          type="text"
          name="filterNameQuery"
          required
          onInput={(e) => {
            setPlaceFilterQuery({
              ...placeFilterQuery,
              name: e.target.value,
            });
          }}
          value={placeFilterQuery.name}
        />
      </p>
      <label>Filter places by tags: </label>
      <input
        type="text"
        name="filterTagQuery"
        required
        onInput={(e) => {
          setPlaceFilterQuery({
            ...placeFilterQuery,
            tagName: e.target.value,
          });
        }}
        value={placeFilterQuery.tagName}
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
              setPlaceFilterQuery({
                ...placeFilterQuery,
                tags: [...placeFilterQuery.tags, tag],
              });
              setTagFilterList(
                tagFilterList.filter((tagId) => tagId._id !== tag._id)
              );
            }}
            isIn={placeFilterQuery.tags.some(
              (tagData) => tagData._id === tag._id
            )}
            isTiny={false}
            key={tag.name}
          />
        ))}
      <p>Selected tags :</p>
      {placeFilterQuery.tags.length > 0 &&
        placeFilterQuery.tags.map((tag) => (
          <Tag
            customStyle={{
              color: tag.nameColor,
              backgroundColor: tag.backgroundColor,
            }}
            tagName={tag.name}
            onClose={() => {
              setPlaceFilterQuery({
                ...placeFilterQuery,
                tags: placeFilterQuery.tags.filter(
                  (tagId) => tagId._id !== tag._id
                ),
              });
              setTagFilterList([...tagFilterList, tag]);
            }}
            isIn={placeFilterQuery.tags.some(
              (tagData) => tagData._id === tag._id
            )}
            isTiny={false}
            key={tag.name}
          />
        ))}
      <button
        onClick={() => {
          setPlaceFilterQuery({
            name: "",
            tagName: "",
            tags: [],
          });
        }}
      >
        Clear filter
      </button>

      {iterationValues.address.length > 0 && (
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
                    onInput={(e) => {
                      setIterationValues({
                        ...iterationValues,
                        description: e.target.value,
                      });
                    }}
                    value={iterationValues.description}
                  />
                </p>
              </li>
              <p>Selected tags :</p>
              {iterationValues.tagsList.length > 0 &&
                iterationValues.tagsList.map((tag) => (
                  <Tag
                    customStyle={{
                      color: tag.nameColor,
                      backgroundColor: tag.backgroundColor,
                    }}
                    tagName={tag.name}
                    onClose={() => {
                      setIterationValues({
                        ...iterationValues,
                        tagsList: iterationValues.tagsList.filter(
                          (tagId) => tagId._id !== tag._id
                        ),
                      });
                      setTagList([...tagList, tag]);
                    }}
                    isIn={iterationValues.tagsList.some(
                      (tagData) => tagData._id === tag._id
                    )}
                    isTiny={false}
                    key={tag.name}
                  />
                ))}
              <p>Select tags:</p>
              {tagListWithoutSelected.length > 0 &&
                tagListWithoutSelected.map((tag) => (
                  <Tag
                    customStyle={{
                      color: tag.nameColor,
                      backgroundColor: tag.backgroundColor,
                    }}
                    tagName={tag.name}
                    onClick={() => {
                      setIterationValues({
                        ...iterationValues,
                        tagsList: [...iterationValues.tagsList, tag],
                      });
                      setTagList(
                        tagList.filter((tagId) => tagId._id !== tag._id)
                      );
                    }}
                    isIn={iterationValues.tagsList.some(
                      (tagData) => tagData._id === tag._id
                    )}
                    isTiny={false}
                    key={tag.name}
                  />
                ))}
            </ul>
            <button
              onClick={(e) => {
                createIteration(e);
              }}
            >
              Create iteration
            </button>
          </form>
        </>
      )}

      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      {props.editedMap ? (
        <button
          type="button"
          onClick={(e) => {
            sendRegistrationForm(e);
            navigate("mymaps");
          }}
          disabled={!isValidForSending}
        >
          Edit map
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            sendRegistrationForm(e);
            navigate("mymaps");
          }}
          disabled={!isValidForSending}
        >
          Create map
        </button>
      )}
    </>
  );
}

export default MapEditor;
