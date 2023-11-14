import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.scss";
import { useEffect, useState } from "react";
import * as APIService from "../../services/api";

const Layout = () => {  
  const [message, setMessage] = useState(null)

  useEffect(() => {
    async function getResponse() {
      try {
        const status = await APIService.getApiStatus();
          setMessage(status);
      } catch (err) {
        setMessage(err.message);
      }
    }
    getResponse();
  }, []);

  return (
    <>
      <header id={styles.header}>
        <div id={styles.banner}>
          <h1 id={styles.mainTitle}>Marketplates</h1>
        </div>
        <h1>API STATUS</h1>
      {message && (
        <h2>{message ? message.message : "Nope"}</h2>
      )}
        <nav>
          <ul>
            <li className={styles.navigationOption}>
              <Link to="/">Home</Link>
            </li>
            <li className={styles.navigationOption}>
              <Link to="/appliances">appliancesManipulation</Link>
            </li>
            <li className={styles.navigationOption}>
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
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />
    </>
  );
};

export default Layout;
