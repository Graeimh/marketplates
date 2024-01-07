import { Link } from "react-router-dom";
import stylesUserDashboard from "../../../common/styles/Dashboard.module.scss";
import styles from "./Profile.module.scss";
import * as jose from "jose";
import * as authenticationService from "../../../services/authenticationService.js";
import * as userService from "../../../services/userService.js";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { ISessionValues } from "../../../common/types/userTypes/userTypes.js";
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes.js";
function Profile(props: {
  contextSetter: React.Dispatch<ISessionValues>;
  messageSetter: React.Dispatch<IMessageValues>;
}) {
  async function deleteUser() {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        const userData = localStorage.getItem("refreshToken");
        if (userData !== null) {
          const userDataDecrypted: ISessionValues = jose.decodeJwt(userData);
          await userService.deleteUserById(userDataDecrypted.userId);
          await authenticationService.logout(userData);
          props.messageSetter({
            message: "Goodbye! We hope you had a good time using Marketplates!",
            successStatus: true,
          });
          props.contextSetter({
            email: "",
            displayName: "",
            userId: "",
            status: "",
            iat: 0,
            exp: 0,
          });
        }
      } catch (err) {
        props.messageSetter({
          message: "An error has occured and we could not delete your profile.",
          successStatus: false,
        });
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Profile</title>
        <link rel="canonical" href="http://localhost:5173/profile" />
      </Helmet>
      <div id={stylesUserDashboard.dashboardContentContainer}>
        <ul id={stylesUserDashboard.dashboardPanel}>
          <li>
            <Link to="/editprofile" aria-label="Navigate to Edit Profile">
              <span className={stylesUserDashboard.dashboardOptionChevron}>
                <FontAwesomeIcon icon={solid("chevron-right")} />
              </span>
              <span className={stylesUserDashboard.dashboardOptionText}>
                Edit my profile
              </span>
              <span className={stylesUserDashboard.dashboardOptionDecorator}>
                <FontAwesomeIcon icon={regular("user")} />
              </span>
            </Link>
          </li>
          <li>
            <Link to="/mymaps" aria-label="Navigate to My Maps">
              <span className={stylesUserDashboard.dashboardOptionChevron}>
                <FontAwesomeIcon icon={solid("chevron-right")} />
              </span>
              <span className={stylesUserDashboard.dashboardOptionText}>
                My Maps
              </span>
              <span className={stylesUserDashboard.dashboardOptionDecorator}>
                <FontAwesomeIcon icon={solid("map")} />
              </span>
            </Link>
          </li>
          <li>
            <Link to="/myplaces" aria-label="Navigate to My Places">
              <span className={stylesUserDashboard.dashboardOptionChevron}>
                <FontAwesomeIcon icon={solid("chevron-right")} />
              </span>
              <span className={stylesUserDashboard.dashboardOptionText}>
                My Places
              </span>
              <span className={stylesUserDashboard.dashboardOptionDecorator}>
                <FontAwesomeIcon icon={solid("map-location-dot")} />
              </span>
            </Link>
          </li>
          <li className={stylesUserDashboard.deleteButton}>
            <div>
              <Link to="/" onClick={deleteUser} aria-label="Delete my account">
                <span className={stylesUserDashboard.dashboardOptionChevron}>
                  <FontAwesomeIcon icon={solid("chevron-right")} />
                </span>
                <span className={stylesUserDashboard.dashboardOptionText}>
                  Delete my account
                </span>
                <span className={stylesUserDashboard.dashboardOptionDecorator}>
                  <FontAwesomeIcon icon={solid("user-slash")} />
                </span>
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Profile;
