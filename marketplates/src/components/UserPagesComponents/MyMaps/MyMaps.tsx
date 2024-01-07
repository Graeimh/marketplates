import { useContext, useEffect, useState } from "react";
import * as mapsService from "../../../services/mapService.js";
import formStyles from "../../../common/styles/Forms.module.scss";
import stylesItem from "../../../common/styles/UserItems.module.scss";
import stylesUserDashboard from "../../../common/styles/Dashboard.module.scss";
import styles from "./MyMaps.module.scss";
import { useNavigate } from "react-router-dom";
import { IMaps } from "../../../common/types/mapTypes/mapTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { Helmet } from "react-helmet";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes.js";

function MyPlaces(props: { messageSetter: React.Dispatch<IMessageValues> }) {
  // Setting states
  // Array of user owned maps meant to be edited or deleted
  const [userMapsList, setUserMapsList] = useState<IMaps[]>([]);

  const navigate = useNavigate();

  // Fetching the user's current data
  const userContextValue = useContext(UserContext);

  useEffect(() => {
    getUserMaps();
  }, [userContextValue]);

  async function getUserMaps() {
    try {
      if (checkPermission(userContextValue.status, UserType.User)) {
        const userMaps = await mapsService.fetchUserMaps();
        setUserMapsList(userMaps.data);
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we not could retrieve your maps.",
        successStatus: false,
      });
    }
  }

  async function handleUserMapDeleted(placeId: string) {
    try {
      if (confirm("Are you sure you want to delete this map?")) {
        if (checkPermission(userContextValue.status, UserType.User)) {
          await mapsService.deleteMapById(placeId);
          getUserMaps();
          props.messageSetter({
            message: "Map successfully deleted.",
            successStatus: true,
          });
        }
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we could not delete the map.",
        successStatus: false,
      });
    }
  }

  return (
    <>
      <Helmet>
        <title>My maps</title>
        <link rel="canonical" href="http://localhost:5173/mymaps" />
      </Helmet>
      <article id={stylesItem.itemContainer}>
        <h1>Manage your maps</h1>
        <section className={formStyles.finalButtonContainer}>
          {userMapsList.length > 0 ? (
            <button
              onClick={() => {
                navigate("/createmap");
              }}
            >
              Create a map
            </button>
          ) : (
            <>
              <h2>No map of your own yet?</h2>
              <button
                onClick={() => {
                  navigate("/createmap");
                }}
              >
                Create your first map here
              </button>
            </>
          )}
        </section>

        <div id={stylesItem.itemListContainer}>
          {userMapsList &&
            userMapsList.map((map) => (
              <article className={stylesItem.userItemContainer} key={map.name}>
                <section className={stylesItem.itemDataContainer}>
                  <h2>{map.name}</h2>
                  <p className={styles.mapDescription}>{map.description}</p>
                </section>
                <section className={stylesItem.itemButtonContainer}>
                  <button
                    type="button"
                    onClick={() => navigate(`/editmap/${map._id}`)}
                  >
                    <FontAwesomeIcon icon={solid("pen-to-square")} />
                    Edit map
                  </button>
                  <span className={stylesUserDashboard.deleteButton}>
                    <button
                      type="button"
                      onClick={() => {
                        map._id
                          ? handleUserMapDeleted(map._id)
                          : props.messageSetter({
                              message: "The map was already deleted",
                              successStatus: false,
                            });
                      }}
                    >
                      <FontAwesomeIcon icon={solid("trash-can")} />
                      Delete map
                    </button>
                  </span>
                </section>
              </article>
            ))}
        </div>
      </article>
    </>
  );
}

export default MyPlaces;
