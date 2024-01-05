import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from "../../../common/styles/Dashboard.module.scss";
import { useContext, useState } from "react";
import * as authenticationService from "../../../services/authenticationService.js";
import { ISessionValues } from "../../../common/types/userTypes/userTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";

const Layout = (props: { contextSetter: React.Dispatch<ISessionValues> }) => {
  const [message, setMessage] = useState("");
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
      <div id={styles.dashboardContainer}>
        {value.userId.length > 0 ? (
          <header>
            <nav>
              <ul id={styles.small}>
                <Link to="/">
                  <img
                    src="src\assets\logo.png"
                    alt="logo"
                    height="80px"
                    width="80px"
                  />
                </Link>
                <li>
                  <button>(Explore Edit profile, My Maps, My place)</button>
                </li>
                <li>
                  <button>(User Data + log out)</button>
                </li>
                {value.status.split("&").indexOf("Admin") !== -1 && (
                  <li className={styles.navigationOption}>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                )}
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
              <ul id={styles.tablet}>
                <Link to="/">
                  <img
                    src="src\assets\logo.png"
                    alt="logo"
                    height="80px"
                    width="80px"
                  />
                </Link>
                <li>Marketplates</li>
                <li>
                  <button>(Explore Edit profile, My Maps, My place)</button>
                </li>
                {value.status.split("&").indexOf("Admin") !== -1 && (
                  <li className={styles.navigationOption}>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                )}
                <li>
                  <button>(User Data + log out)</button>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
          </header>
        ) : (
          <header>
            <nav>
              <ul id={styles.small}>
                <li>
                  <Link to="/">
                    <img
                      src="src\assets\logo.png"
                      alt="logo"
                      height="80px"
                      width="80px"
                    />
                  </Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
              <ul id={styles.tablet}>
                <li>
                  <Link to="/">
                    <img
                      src="src\assets\logo.png"
                      alt="logo"
                      height="80px"
                      width="80px"
                    />
                  </Link>
                </li>
                <li>Marketplates</li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
          </header>
        )}

        <button type="button" onClick={logoutUser}>
          Log out
        </button>

        <Outlet />
      </div>
    </>
  );
};

export default Layout;
