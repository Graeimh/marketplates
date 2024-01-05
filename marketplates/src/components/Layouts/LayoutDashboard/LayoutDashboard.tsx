import { Outlet, useNavigate } from "react-router-dom";
import styles from "./LayoutDashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const LayoutDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div id={styles.dashboardContainer}>
        <header>
          <nav>
            <ul id={styles.small}>
              <li>
                <button id={styles.homeButton} onClick={() => navigate("/")}>
                  &#8205;
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/users")}
                >
                  <FontAwesomeIcon icon={solid("users")} />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/tags")}
                >
                  <FontAwesomeIcon icon={solid("tags")} />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/places")}
                >
                  <FontAwesomeIcon icon={solid("shop")} />
                </button>
              </li>
            </ul>
            <ul id={styles.tablet}>
              <li>
                <button id={styles.homeButton} onClick={() => navigate("/")}>
                  &#8205;
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate("/dashboard/")}>
                  <FontAwesomeIcon icon={solid("house")} /> Index
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/users")}
                >
                  <FontAwesomeIcon icon={solid("users")} />
                  Users
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/tags")}
                >
                  <FontAwesomeIcon icon={solid("tags")} />
                  Tags
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/places")}
                >
                  <FontAwesomeIcon icon={solid("shop")} />
                  Places
                </button>
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
