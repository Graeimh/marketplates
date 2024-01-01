import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from "./Layout.module.scss";
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
      <header id={styles.header}>
        <div id={styles.banner}>
          <Link to="/">
            <img
              src="src\assets\logo.png"
              alt="logo"
              height="80px"
              width="80px"
            />
          </Link>
          <h1 id={styles.mainTitle}>Marketplates</h1>
        </div>
        <h1>API STATUS</h1>

        {value.userId.length > 0 && (
          <>
            <div>
              <span>{value.displayName}</span>
            </div>

            <button type="button" onClick={logoutUser}>
              Log out
            </button>
          </>
        )}
        {message.length > 0 && <h2>{message}</h2>}
        <nav>
          <ul>
            <li className={styles.navigationOption}>
              <Link to="/">About us</Link>
            </li>
            {value.userId.length === 0 && (
              <>
                <li className={styles.navigationOption}>
                  <Link to="/register">Register</Link>
                </li>
                <li className={styles.navigationOption}>
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
            {value.userId.length > 0 && (
              <>
                <li className={styles.navigationOption}>
                  <Link to="/explore">Explore</Link>
                </li>
                <li className={styles.navigationOption}>
                  <Link to="/profile">Profile</Link>
                </li>
                <li className={styles.navigationOption}>
                  <Link to="/myplaces">My places</Link>
                </li>
                <li className={styles.navigationOption}>
                  <Link to="/mymaps">My maps</Link>
                </li>
              </>
            )}
            {value.status.split("&").indexOf("Admin") !== -1 && (
              <li className={styles.navigationOption}>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <Outlet />
    </>
  );
};

export default Layout;
