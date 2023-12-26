import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.scss";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import * as authenticationService from "../../../services/authenticationService.js";
import UserContext from "../../Contexts/UserContext/index.js";

const Layout = (contextSetter: Dispatch<SetStateAction<null>>) => {
  const [message, setMessage] = useState(null);
  const value = useContext(UserContext);

  async function logoutUser() {
    try {
      const status = await authenticationService.logout(
        sessionStorage.getItem("refreshToken")
      );
      contextSetter(null);
      setMessage(status);
      //REDIRECT NEEDED
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <header id={styles.header}>
        <div id={styles.banner}>
          <h1 id={styles.mainTitle}>Marketplates</h1>
        </div>
        <h1>API STATUS</h1>

        {value && (
          <div>
            <span>{value.displayName}</span>
          </div>
        )}
        {sessionStorage.getItem("refreshToken") && (
          <button type="button" onClick={logoutUser}>
            Log out
          </button>
        )}
        {message && <h2>{message ? message.message : "Nope"}</h2>}
        <nav>
          <ul>
            <li className={styles.navigationOption}>
              <Link to="/">Explore</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/aboutus">About us</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/register">Register</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/login">Login</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/profile">Profile</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/users">Manipulate users</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/tags">Manipulate tags</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/places">Manipulate places</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/myplaces">My places</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/mymaps">My maps</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/myprofile">Edit profile</Link>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />
    </>
  );
};

export default Layout;
