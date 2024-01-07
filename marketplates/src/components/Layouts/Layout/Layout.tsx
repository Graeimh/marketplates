import { Outlet, Link, useNavigate } from "react-router-dom";
import stylesUserDashboard from "../../../common/styles/Dashboard.module.scss";
import stylesAdminDashboard from "../LayoutDashboard/LayoutDashboard.module.scss";
import styles from "./Layout.module.scss";
import { useContext, useState } from "react";
import * as authenticationService from "../../../services/authenticationService.js";
import { ISessionValues } from "../../../common/types/userTypes/userTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Layout = (props: { contextSetter: React.Dispatch<ISessionValues> }) => {
  const [message, setMessage] = useState("");
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  sessionStorage.getItem("refreshToken");
  const navigate = useNavigate();

  const value = useContext(UserContext);

  async function logoutUser() {
    try {
      const status = await authenticationService.logout(
        sessionStorage.getItem("refreshToken")
      );
      props.contextSetter({
        email: "",
        displayName: "",
        userId: "",
        status: "",
        iat: 0,
        exp: 0,
      });
      setMessage(status);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <div id={stylesUserDashboard.dashboardContainer}>
        {value.userId.length > 0 ? (
          <header aria-label="Website header">
            <nav>
              <ul id={stylesUserDashboard.small}>
                <li>
                  <Link
                    id={stylesAdminDashboard.homeButton}
                    aria-label="Navigate to Home"
                    to="/"
                  >
                    &#8205;
                  </Link>
                </li>
                <li>
                  <button
                    aria-label="Open or close burger menu"
                    onClick={() => {
                      setIsBurgerOpen(!isBurgerOpen);
                    }}
                    className={isBurgerOpen ? styles.burgerIsOpened : ""}
                  >
                    <FontAwesomeIcon icon={solid("bars")} />
                  </button>
                </li>
                {value.status.split("&").indexOf("Admin") !== -1 && (
                  <li className={stylesUserDashboard.navigationOption}>
                    <Link to="/dashboard" aria-label="Navigate to Dashboard">
                      <FontAwesomeIcon icon={solid("gauge")} />
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/contact" aria-label="Navigate to Contact">
                    <FontAwesomeIcon icon={solid("square-envelope")} />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={logoutUser}
                    id={styles.logout}
                    aria-label="Log out"
                  >
                    <FontAwesomeIcon icon={solid("right-from-bracket")} />
                  </button>
                </li>
              </ul>
              <ul id={stylesAdminDashboard.tablet}>
                <li>
                  <Link id={stylesAdminDashboard.homeButton} to="/">
                    &#8205;
                  </Link>
                </li>

                <li>
                  <Link to="/mymaps" aria-label="Navigate to My Maps">
                    <FontAwesomeIcon icon={solid("map")} />
                    <br />
                    My Maps
                  </Link>
                </li>
                <li>
                  <Link to="/myplaces" aria-label="Navigate to My Places">
                    <FontAwesomeIcon icon={solid("shop")} />
                    <br />
                    My Places
                  </Link>
                </li>

                <li>
                  <Link to="/profile" aria-label="Navigate to Profile">
                    <FontAwesomeIcon icon={regular("user")} />
                    <br />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/contact" aria-label="Navigate to Contact">
                    <FontAwesomeIcon icon={solid("square-envelope")} />
                    <br />
                    Contact
                  </Link>
                </li>

                {value.status.split("&").indexOf("Admin") !== -1 && (
                  <li className={stylesUserDashboard.navigationOption}>
                    <Link to="/dashboard" aria-label="Navigate to Dashboard">
                      <FontAwesomeIcon icon={solid("gauge")} />
                      <br />
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button type="button" onClick={logoutUser} id={styles.logout}>
                    <FontAwesomeIcon icon={solid("right-from-bracket")} />
                    <br />
                    Log out
                  </button>
                </li>
              </ul>
            </nav>
          </header>
        ) : (
          <header>
            <nav>
              <ul id={stylesUserDashboard.small}>
                <li>
                  <Link
                    id={stylesAdminDashboard.homeButton}
                    to="/"
                    aria-label="Navigate to Home"
                  >
                    &#8205;
                  </Link>
                </li>
                <li>
                  <Link to="/register" aria-label="Navigate to Register">
                    <FontAwesomeIcon icon={solid("user-plus")} />
                  </Link>
                </li>
                <li>
                  <Link to="/login" aria-label="Navigate to Login">
                    <FontAwesomeIcon icon={solid("right-to-bracket")} />
                  </Link>
                </li>
                <li>
                  <Link to="/contact" aria-label="Navigate to Contact">
                    <FontAwesomeIcon icon={solid("square-envelope")} />
                  </Link>
                </li>
              </ul>
              <ul id={stylesAdminDashboard.tablet}>
                <li>
                  <Link
                    id={stylesAdminDashboard.homeButton}
                    to="/"
                    aria-label="Navigate to Home"
                  >
                    &#8205;
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <FontAwesomeIcon icon={solid("user-plus")} />
                    <br />
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" aria-label="Navigate to Login">
                    <FontAwesomeIcon icon={solid("right-to-bracket")} />
                    <br />
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/contact" aria-label="Navigate to Contact">
                    <FontAwesomeIcon icon={solid("square-envelope")} />
                    <br />
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
        )}

        <div id={styles.siteContentContainer}>
          <Outlet />
        </div>
      </div>
      <div id={isBurgerOpen ? styles.burgerOpen : styles.burgerClosed}>
        <Link
          to="/profile"
          onClick={() => setIsBurgerOpen(!isBurgerOpen)}
          aria-label="Navigate to Profile"
        >
          <FontAwesomeIcon icon={regular("user")} />
          Profile
        </Link>
        <Link
          to="/mymaps"
          onClick={() => setIsBurgerOpen(!isBurgerOpen)}
          aria-label="Navigate to My Maps"
        >
          <FontAwesomeIcon icon={solid("map")} />
          My Maps
        </Link>

        <Link
          to="/myplaces"
          onClick={() => setIsBurgerOpen(!isBurgerOpen)}
          aria-label="Navigate to My Places"
        >
          <FontAwesomeIcon icon={solid("shop")} />
          My Businesses
        </Link>
      </div>
    </>
  );
};

export default Layout;
