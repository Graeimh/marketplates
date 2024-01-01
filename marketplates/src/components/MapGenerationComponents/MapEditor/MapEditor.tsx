import { useContext, useEffect, useState } from "react";
import styles from "./MapEditor.module.scss";
import * as mapService from "../../../services/mapService.js";
import * as placeIterationService from "../../../services/placeIterationService.js";
import * as placeService from "../../../services/placeService.js";
import * as tagService from "../../../services/tagService.js";
import { useNavigate } from "react-router-dom";
import { ITag } from "../../../common/types/tagTypes/tagTypes.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Tag from "../Tag/Tag.js";
import MapValuesManager from "../MapValuesManager/MapValuesManager.js";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider.js";
import {
  IMarkersForMap,
  IPlace,
  IPlaceFilterQuery,
  IPlaceIteration,
  IPlaceUpdated,
  ITagFilterQuery,
} from "../../../common/types/placeTypes/placeTypes.js";
import {
  IMapValues,
  PrivacyStatus,
} from "../../../common/types/mapTypes/mapTypes.js";
import { IGPSCoordinates } from "../../../common/types/commonTypes.ts/commonTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { Helmet } from "react-helmet";

function MapEditor(props: { editedMap: string | undefined }) {
  // Setting states
  // Contains the data needed to create a map
  const [formData, setFormData] = useState<IMapValues>({
    name: "MyMap",
    description: "My map's description",
    privacyStatus: PrivacyStatus.Public,
    participants: [],
    placeIterations: [],
  });

  // Response message display
  const [responseMessage, setResponseMessage] = useState("");

  // Contains all the tags available for the user pulled from the database
  const [tagList, setTagList] = useState<ITag[]>([]);

  // Contains the tags remaining post filtering
  const [tagFilterList, setTagFilterList] = useState<ITag[]>([]);

  //
  const [newResults, setNewResults] = useState<SearchResult<RawResult>[]>([]);
  const [coordinates, setCoordinates] = useState<IGPSCoordinates>({
    longitude: 3.066667,
    latitude: 50.633333,
  });

  // Error message display
  const [error, setError] = useState(null);

  // Contains all the places available for all maps
  const [placeList, setPlaceList] = useState<IPlace[]>([]);

  // Contains the address' value to be used with the OpenStreetMapProvider
  const [addressQuery, setAddressQuery] = useState<string>("");

  // Checks if the values for the map's data fit a criteria before allowing its creation or editing
  const [isValidForSending, setIsValidForSending] = useState<boolean>(false);

  // Checks if the values for the place iterations's data fit a criteria before allowing its creation or editing
  const [isValidPlaceIterationForSending, setIsValidPlaceIterationForSending] =
    useState<boolean>(false);

  // Contains the values used to create an iteration for the map itself before being sent to backend alongside with it
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

  // Contains all the iterations already present or created for the map
  const [iterationsList, setIterationsList] = useState<IPlaceUpdated[]>([]);

  // Contains the values used to filter places and iterations, either via name, or via tags which can be filtered using tagName
  const [placeFilterQuery, setPlaceFilterQuery] = useState<IPlaceFilterQuery>({
    name: "",
    tagName: "",
    tags: [],
  });

  // Contains the values used to filter iterations via name mostly for now
  const [iterationTagFilterQuery, setIterationTagFilterQuery] =
    useState<ITagFilterQuery>({
      tagName: "",
    });

  const value = useContext(UserContext);
  const navigate = useNavigate();

  // Allows to interact with a map address search api
  const provider = new OpenStreetMapProvider();

  async function handleAdressButton(): Promise<void> {
    const results = await provider.search({ query: addressQuery });
    setNewResults(results);

    // If there is only one result possible, its address is assigned to the place
    if (results.length === 1) {
      setCoordinates({ latitude: results[0].y, longitude: results[0].x });
    }
  }

  async function getMapEditorTools() {
    try {
      if (checkPermission(value.status, UserType.User)) {
        // Getting all the tags available for the user
        const allTags = await tagService.fetchTagsForUser();
        const allTagsData: ITag[] = allTags.data;
        setTagList(allTagsData);
        setTagFilterList(allTagsData);

        // Getting all the places available for basic maps
        const allPlaces = await placeService.fetchAllPlaces();
        const allPlacesData: IPlace[] = allPlaces.data;
        setPlaceList(allPlacesData);

        // If the map is being edited, fetch the place iterations it already had and pre-fill all fields with the map's current values in the database
        if (props.editedMap) {
          const mapToEdit = await mapService.fetchMapsByIds([props.editedMap]);

          let mapToEditIterations: IPlaceUpdated[] = [];

          if (mapToEdit.data[0].placeIterationIds.length > 0) {
            const mapIterations =
              await placeIterationService.fetchPlaceIterationsByIds(
                mapToEdit.data[0].placeIterationIds
              );

            const mapIterationsData: IPlaceIteration[] = mapIterations.data;

            const adressData: string[] = mapIterationsData
              .map(
                (iteration) =>
                  allPlacesData.find((place) => place._id === iteration.placeId)
                    ?.address
              )
              .map((iterationAdress) =>
                iterationAdress !== undefined ? iterationAdress : ""
              );

            const lol: IPlaceUpdated[] = mapIterationsData.map(
              (iteration, index) => ({
                address: adressData[index],
                description: iteration.customDescription,
                gpsCoordinates: {
                  longitude: iteration.gpsCoordinates.longitude,
                  latitude: iteration.gpsCoordinates.latitude,
                },
                _id: iteration._id,
                name: iteration.customName,
                place_id: iteration.placeId,
                tagsIdList: iteration.customTagIds,
                tagsList: allTagsData.filter((tag) =>
                  iteration.customTagIds.some(
                    (iterationTag) => tag._id === iterationTag
                  )
                ),
              })
            );

            mapToEditIterations = [...mapToEditIterations, ...lol];
          }

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
      }
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    getMapEditorTools();
    decideMapValidity();
  }, []);

  useEffect(() => {
    decideMapValidity();
  }, [formData]);

  useEffect(() => {
    decidePlaceIterationValidity();
  }, [iterationValues]);

  function decideMapValidity() {
    setIsValidForSending(
      formData.name.length > 1 && formData.description.length > 1
    );
  }

  function decidePlaceIterationValidity() {
    setIsValidPlaceIterationForSending(
      iterationValues.name.length > 1 && iterationValues.description.length > 1
    );
  }

  function updateField(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function updatePlaceIterationField(event) {
    setIterationValues({
      ...iterationValues,
      [event.target.name]: event.target.value,
    });
  }

  function manageIteration(place: IPlaceUpdated) {
    setIterationValues(place);
    setIsValidPlaceIterationForSending(true);
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
      tagsList: [...tagList].filter((tag) => place.tagsList.includes(tag._id)),
    };
    mapmarkers.push(marker);
  }

  // Places are replaced with iterations if their ids or place ids match
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
      //Check if the iteration is being updated and not created
      if (
        iterationsList.some(
          (iteration) => iteration._id === iterationValues._id
        )
      ) {
        // Update the iteration
        const iterationToFind = iterationsList.find(
          (iteration) => iteration._id === iterationValues._id
        );
        const iterationIndex = iterationToFind
          ? iterationsList.indexOf(iterationToFind)
          : "0";
        iterationsList[iterationIndex] = iterationValues;
        setIterationsList(iterationsList);
      } else {
        // Create the iteration
        setFormData({
          ...formData,
          placeIterations: [...formData.placeIterations, iterationValues],
        });
        setIterationsList([...iterationsList, iterationValues]);
      }
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
      if (checkPermission(value.status, UserType.User)) {
        if (!props.editedMap) {
          await mapService.generateMap(formData);
        } else {
          await mapService.updateMapById(props.editedMap, formData);
        }
        navigate("/mymaps");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // A smaller selection of tags to avoid overcrowding the user's page
  const tagSelection: ITag[] = [...tagFilterList].slice(0, 10);

  // Once a tag is bound to an iteration it is no longer within the available tags
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

  const tagListForIterationWithoutSelected: ITag[] = [
    ...new Set(
      tagFilterList.filter(
        (tag) => !iterationValues.tagsIdList.includes(tag._id)
      )
    ),
  ];

  // Tags are also filtered through user input if they are looking for specific tags
  const tagListWithoutSelectedAndFiltered: ITag[] = [
    ...tagListWithoutSelected,
  ].filter((tag) => new RegExp(placeFilterQuery.tagName).test(tag.name));

  const tagListToDisplay: ITag[] =
    placeFilterQuery.tagName.length > 0
      ? tagListWithoutSelectedAndFiltered
      : tagSelection;

  // The same process goes for the tags list involved when creating or editing an iteration
  const tagListForIterationWithoutSelectedAndFiltered: ITag[] = [
    ...tagListForIterationWithoutSelected,
  ].filter((tag) => new RegExp(iterationTagFilterQuery.tagName).test(tag.name));

  const tagListForIterationToDisplay: ITag[] =
    iterationTagFilterQuery.tagName.length > 0
      ? tagListForIterationWithoutSelectedAndFiltered
      : tagListForIterationWithoutSelected;

  const mapMarkersAfterFilter: IMarkersForMap[] = [...mapMarkersAndIterations]
    .filter((marker) => new RegExp(placeFilterQuery.name).test(marker.name))
    .filter((marker) =>
      placeFilterQuery.tags.every((tag) => marker.tagsList.includes(tag))
    );
  return (
    <>
      {props.editedMap ? (
        <Helmet>
          <title>Edit map : {formData.name}</title>
          <link rel="canonical" href="http://localhost:5173/createmap" />
        </Helmet>
      ) : (
        <Helmet>
          <title>Create map : {formData.name}</title>
          <link rel="canonical" href="http://localhost:5173/createmap" />
        </Helmet>
      )}
      <h1>Map editor</h1>
      {/* Here we give the map's basic values according to screen size, for now the placement is arbitrary, but later we could center the map on the user's location in the database */}
      <MapContainer
        style={{ height: "30rem", width: "100%" }}
        center={{ lat: 50.633333, lng: 3.066667 }}
        zoom={13}
        maxZoom={18}
      >
        <MapValuesManager
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          doubleClickEvent={doubleClickMaphandler}
          startingZoom={13}
        />
        {/* Defines the style of the map */}
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
              key={place._id}
            >
              {/* Upon clicking the user either sees a place's data, or the iteration values for it*/}
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
                      onClick={() => manageIteration(place)}
                    >
                      Create iteration
                    </button>
                  )}
                  {place.isIteration && (
                    <button
                      type="button"
                      onClick={() => manageIteration(place)}
                    >
                      Edit iteration
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

      <h3>Filter map markers</h3>
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
          <h2>
            {iterationsList.some(
              (iteration) => iteration._id === iterationValues._id
            )
              ? "Edit an iteration"
              : "Create an iteration"}
          </h2>
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
                      updatePlaceIterationField(e);
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
                    onInput={(e) => updatePlaceIterationField(e)}
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
              <p>
                <label>Filter tags: </label>
                <input
                  type="text"
                  name="filterTagQuery"
                  required
                  onInput={(e) => {
                    setIterationTagFilterQuery({
                      ...iterationTagFilterQuery,
                      tagName: e.target.value,
                    });
                  }}
                  value={iterationTagFilterQuery.tagName}
                />
              </p>
              <p>Select tags:</p>
              {tagListForIterationToDisplay.length > 0 &&
                tagListForIterationToDisplay.map((tag) => (
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
                        tagsIdList: [...iterationValues.tagsIdList, tag._id],
                      });
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
              disabled={!isValidPlaceIterationForSending}
            >
              {iterationsList.some(
                (iteration) => iteration._id === iterationValues._id
              )
                ? "Edit iteration"
                : "Create iteration"}
            </button>
          </form>
        </>
      )}

      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <button
        type="button"
        onClick={(e) => {
          sendRegistrationForm(e);
        }}
        disabled={!isValidForSending}
      >
        {props.editedMap ? "Edit map" : "Create map"}
      </button>
    </>
  );
}

export default MapEditor;
