import { useContext, useEffect, useState } from "react";
import formStyles from "../../../common/styles/Forms.module.scss";
import styles from "./PlaceEditor.module.scss";
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
  IPlace,
  IPlaceRegisterValues,
} from "../../../common/types/placeTypes/placeTypes.js";
import {
  IGPSCoordinates,
  IMessageValues,
} from "../../../common/types/commonTypes.ts/commonTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import { Helmet } from "react-helmet";

function PlaceEditor(props: {
  editPlaceId: string | undefined;
  messageSetter: React.Dispatch<IMessageValues>;
}) {
  // Setting states
  // Contains the data needed to create a place
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

  // Serves to check if the values sent have at least a certain number of characters
  const [isValidForSending, setIsValidForSending] = useState(false);

  // Contains the list of tags to pick from to associate to the place
  const [tagList, setTagList] = useState<ITag[]>([]);

  // Contains a list of addresses obtained upon making a prompt to find an address
  const [newResults, setNewResults] = useState<SearchResult<RawResult>[]>([]);

  // Contains the current coordinates after the user double clicks on the map
  const [temporaryCoordinates, setTemporaryCoordinates] =
    useState<IGPSCoordinates>({
      longitude: null,
      latitude: null,
    });

  // Contains a string which is used as a regex to filter the list of tags
  const [tagQuery, setTagQuery] = useState("");

  const value = useContext(UserContext);

  const navigate = useNavigate();

  // Allows to interact with a map address search api
  const provider = new OpenStreetMapProvider();

  // A smaller selection of tags to avoid overcrowding the user's page
  const tagSelection: ITag[] = [...tagList].slice(0, 10);

  // Once a tag is bound to a place it is no longer within the available tags
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

  // Tags are also filtered through user input if they are looking for specific tags
  const tagListWithoutSelectedAndFiltered: ITag[] = [
    ...tagListWithoutSelected,
  ].filter((tag) => new RegExp(tagQuery, "i").test(tag.name));

  const tagListToDisplay: ITag[] =
    formData.tagList.length > 0
      ? tagListWithoutSelectedAndFiltered.slice(0, 10)
      : tagSelection;

  async function handleAdressButton(): Promise<void> {
    const results = await provider.search({ query: formData.address });
    setNewResults(results);

    // If there is only one result possible, its address is assigned to the place
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
      if (checkPermission(value.status, UserType.User)) {
        const allTags = await tagService.fetchTagsForUser();
        setTagList(allTags.data);
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we could not fetch your tags.",
        successStatus: false,
      });
    }
  }

  async function getPlaceEditValue(id: string) {
    try {
      if (checkPermission(value.status, UserType.User)) {
        const currentPlace = await placeService.fetchPlacesByIds([id]);
        const currentPlaceData: IPlace = currentPlace.data[0];
        const currentPlaceTagIds = currentPlaceData.tagsList;
        const placeTags = await tagService.fetchTagsByIds(currentPlaceTagIds);

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

        setTemporaryCoordinates({
          latitude: currentPlaceData.gpsCoordinates.latitude,
          longitude: currentPlaceData.gpsCoordinates.longitude,
        });
      }
    } catch (err) {
      props.messageSetter({
        message:
          "An error has occured and we could not fetch your place's data.",
        successStatus: false,
      });
    }
  }

  useEffect(() => {
    getUserTags();
    if (props.editPlaceId !== undefined) {
      getPlaceEditValue(props.editPlaceId);
    }
  }, [value]);

  function decideRegistration() {
    setIsValidForSending(
      formData.name.length > 1 &&
        formData.description.length > 1 &&
        formData.address.length > 1 &&
        formData.gpsCoordinates.longitude !== null &&
        formData.gpsCoordinates.latitude !== null
    );
  }

  useEffect(() => {
    decideRegistration();
  }, [formData]);

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
      if (checkPermission(value.status, UserType.User)) {
        if (props.editPlaceId === undefined) {
          await placeService.generatePlace(formData);
          props.messageSetter({
            message: "Your place has been successfully created.",
            successStatus: true,
          });
        } else {
          await placeService.updatePlaceById(formData, props.editPlaceId);
          props.messageSetter({
            message: "Your place has been successfully edited.",
            successStatus: true,
          });
        }
        navigate("/myplaces");
      }
    } catch (err) {
      props.messageSetter({
        message: `An error has occured and your place could not be ${
          props.editPlaceId === undefined ? "created" : "edited"
        }.`,
        successStatus: false,
      });
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
      {props.editPlaceId ? (
        <Helmet>
          <title>Edit place : {formData.name}</title>
          <link rel="canonical" href="http://localhost:5173/createplace" />
        </Helmet>
      ) : (
        <Helmet>
          <title>
            Create place{formData.name.length > 0 ? `: ${formData.name}` : ""}
          </title>
          <link rel="canonical" href="http://localhost:5173/createplace" />
        </Helmet>
      )}

      <article
        className={formStyles.formContainer}
        id={styles.placeRegisterContainer}
      >
        <section>
          <form>
            <ul>
              <h1>Register a business</h1>
              <li>
                <label>Name : </label>
                <br />
                <input
                  type="text"
                  name="name"
                  required
                  onInput={updateField}
                  value={formData.name}
                />
              </li>
              <li>
                <label>Description : </label>
                <br />
                <input
                  type="text"
                  name="description"
                  required
                  onInput={updateField}
                  value={formData.description}
                />
              </li>
              <li>Locate your business</li>
              <li id={styles.phoneMapContainer}>
                <MapContainer
                  style={{ height: "30rem", width: "100%" }}
                  center={{ lat: 50.633333, lng: 3.066667 }}
                  zoom={13}
                  maxZoom={18}
                >
                  <MapValuesManager
                    latitude={
                      formData.gpsCoordinates.latitude !== null
                        ? formData.gpsCoordinates.latitude
                        : 50.633333
                    }
                    longitude={
                      formData.gpsCoordinates.longitude !== null
                        ? formData.gpsCoordinates.longitude
                        : 3.066667
                    }
                    startingZoom={13}
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
              </li>
              <li>
                <label>Address : </label>
                <br />
                <input
                  type="text"
                  name="address"
                  onInput={updateField}
                  value={formData.address}
                />
              </li>
              <li className={styles.secondaryButton}>
                <button type="button" onClick={handleAdressButton}>
                  Get locations
                </button>
              </li>
              {newResults.length > 1 && (
                <>
                  <li>Select a result:</li>
                  <ul className={formStyles.addressClickables}>
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
                          setTemporaryCoordinates({
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
                </>
              )}
              <li>Off the grid? Write the coordinates here!</li>
              <li>
                <label>Latitude : </label>
                <br />
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
                  value={temporaryCoordinates.latitude?.toString()}
                />
              </li>
              <li>
                <label>Longitude : </label>
                <br />
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
                  value={temporaryCoordinates.longitude?.toString()}
                />
              </li>
              <li className={styles.secondaryButton}>
                <button type="button" onClick={handleManualCoordinates}>
                  Use coordinates instead!
                </button>
              </li>

              <li>
                <label>Search for a tag : </label>
                <input
                  type="text"
                  name="tagQuery"
                  onChange={(e) => {
                    setTagQuery(e.target.value);
                  }}
                />
              </li>

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
                      setTagList(
                        tagList.filter((tagId) => tagId._id !== tag._id)
                      );
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
            </ul>
            <div className={formStyles.finalButtonContainer}>
              <button
                type="button"
                disabled={!isValidForSending}
                onClick={sendRegistrationForm}
              >
                {props.editPlaceId === undefined
                  ? "Register business"
                  : "Edit business"}
              </button>
            </div>
          </form>
        </section>
        <section id={styles.mapDesktopContainer}>
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={{ lat: 50.633333, lng: 3.066667 }}
            zoom={13}
            maxZoom={18}
          >
            <MapValuesManager
              latitude={
                formData.gpsCoordinates.latitude !== null
                  ? formData.gpsCoordinates.latitude
                  : 50.633333
              }
              longitude={
                formData.gpsCoordinates.longitude !== null
                  ? formData.gpsCoordinates.longitude
                  : 3.066667
              }
              startingZoom={13}
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
        </section>
      </article>
    </>
  );
}

export default PlaceEditor;
