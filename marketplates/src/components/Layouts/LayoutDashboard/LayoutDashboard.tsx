import { Link, Outlet } from "react-router-dom";
import styles from "./LayoutDashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const LayoutDashboard = () => {
  return (
    <>
      <div id={styles.dashboardContainer}>
        <header>
          <nav>
            <ul id={styles.small}>
              <li>
                <Link id={styles.homeButton} to="/">
                  &#8205;
                </Link>
              </li>
              <li>
                <Link to="/dashboard/users">
                  <FontAwesomeIcon icon={solid("users")} />
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tags">
                  <FontAwesomeIcon icon={solid("tags")} />
                </Link>
              </li>
              <li>
                <Link to="/dashboard/places">
                  <FontAwesomeIcon icon={solid("shop")} />
                </Link>
              </li>
            </ul>
            <ul id={styles.tablet}>
              <li>
                <Link id={styles.homeButton} to="/">
                  &#8205;
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  <FontAwesomeIcon icon={solid("house")} /> <br />
                  Index
                </Link>
              </li>
              <li>
                <Link to="/dashboard/users">
                  <FontAwesomeIcon icon={solid("users")} />
                  <br />
                  Users
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tags">
                  <FontAwesomeIcon icon={solid("tags")} />
                  <br />
                  Tags
                </Link>
              </li>
              <li>
                <Link to="/dashboard/places">
                  <FontAwesomeIcon icon={solid("shop")} />
                  <br />
                  Places
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <div id={styles.dashboardContentContainer}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default LayoutDashboard;
