import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.scss";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import * as APIService from "../../services/api";
import UserContext from "../UserContext";

const Layout = (contextSetter: Dispatch<SetStateAction<null>>) => {
  const [message, setMessage] = useState(null);
  //TYPE OF CONTEXT NEEDS FIXING
  const value = useContext(UserContext);

  useEffect(() => {
    async function getResponse() {
      try {
        // const status = await APIService.getApiStatus();
        const status = await APIService.checkIfActive(
          sessionStorage.getItem("refreshToken")
        );
        setMessage(status);
      } catch (err) {
        setMessage(err.message);
      }
    }
    getResponse();
  }, []);

  async function logoutUser() {
    try {
      const status = await APIService.logout(
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
        {sessionStorage.getItem("refreshToken") && (
          <button type="button" onClick={logoutUser}>
            Log out
          </button>
        )}
        {message && <h2>{message ? message.message : "Nope"}</h2>}
        <nav>
          <ul>
            <li className={styles.navigationOption}>
              <Link to="/">Home</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/aboutus">About us</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/explore">Explore</Link>
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
              <Link to="/placeprofile">My places</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/users">Manipulate users</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/tags">Manipulate tags</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/createplace">Create a place</Link>
            </li>

            {/* <li className={styles.navigationOption}>
              <Link to="/baskets">basketsManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/iterations">iterationsManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/menuitems">menuitemsManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/menus">menusManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/menusections">menusectionsManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/opinions">opinionsManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/posts">postsManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/places">placesManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/products">productsManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/recipes">recipesManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/tags">tagsManipulation</Link>
            </li>
            <li id={styles.navigationOption}>
              <Link to="/users">usersManipulation</Link>
            </li> */}
          </ul>
        </nav>
      </header>

      <Outlet />
    </>
  );
};

export default Layout;
