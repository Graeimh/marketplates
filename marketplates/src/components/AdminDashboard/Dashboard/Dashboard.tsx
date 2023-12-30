import { Link } from "react-router-dom";
import styles from "./Dashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

function Dashboard() {
  return (
    <>
      <ul id={styles.dashboardPanel}>
        <li>
          <Link to="/users">
            <span className={styles.dashboardOptionChevron}>
              <FontAwesomeIcon icon={solid("chevron-right")} />
            </span>
            <span className={styles.dashboardOptionText}>Manipulate users</span>
            <span className={styles.dashboardOptionDecorator}>
              <FontAwesomeIcon icon={solid("users")} />
            </span>
          </Link>
        </li>
        <li>
          <Link to="/tags">
            <span className={styles.dashboardOptionChevron}>
              <FontAwesomeIcon icon={solid("chevron-right")} />
            </span>
            <span className={styles.dashboardOptionText}>Manipulate tags</span>
            <span className={styles.dashboardOptionDecorator}>
              <FontAwesomeIcon icon={solid("tags")} />
            </span>
          </Link>
        </li>
        <li>
          <Link to="/places">
            <span className={styles.dashboardOptionChevron}>
              <FontAwesomeIcon icon={solid("chevron-right")} />
            </span>
            <span className={styles.dashboardOptionText}>
              Manipulate places
            </span>
            <span className={styles.dashboardOptionDecorator}>
              <FontAwesomeIcon icon={solid("shop")} />
            </span>
          </Link>
        </li>
      </ul>
    </>
  );
}

export default Dashboard;
