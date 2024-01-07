import { Link, Outlet } from "react-router-dom";
import styles from "./LayoutDashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const LayoutDashboard = () => {
  return (
    <>
      <div id={styles.dashboardContainer}>
        <header aria-label="Admin dashboard header">
          <nav>
            <ul id={styles.small}>
              <li>
                <Link
                  className={styles.homeButton}
                  to="/"
                  aria-label="Navigate to Home"
                >
                  &#8205;
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/users"
                  aria-label="Navigate to Manage Users"
                >
                  <FontAwesomeIcon icon={solid("users")} />
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tags" aria-label="Navigate to Manage Tags">
                  <FontAwesomeIcon icon={solid("tags")} />
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/places"
                  aria-label="Navigate to Manage Places"
                >
                  <FontAwesomeIcon icon={solid("shop")} />
                </Link>
              </li>
            </ul>
            <ul id={styles.tablet}>
              <li>
                <Link
                  className={styles.homeButton}
                  to="/"
                  aria-label="Navigate to Home"
                >
                  &#8205;
                </Link>
              </li>
              <li>
                <Link to="/dashboard" aria-label="Navigate to Dashboard Index">
                  <FontAwesomeIcon icon={solid("house")} /> <br />
                  Index
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/users"
                  aria-label="Navigate to Manage Users"
                >
                  <FontAwesomeIcon icon={solid("users")} />
                  <br />
                  Users
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tags" aria-label="Navigate to Manage Tags">
                  <FontAwesomeIcon icon={solid("tags")} />
                  <br />
                  Tags
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/places"
                  aria-label="Navigate to Manage Places"
                >
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
