import { Link } from "react-router-dom";
import styles from "./Dashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Helmet } from "react-helmet";

function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <link rel="canonical" href="http://localhost:5173/dashboard" />
      </Helmet>

      <ul id={styles.dashboardPanel}>
        <li>
          <Link to="/dashboard/users">
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
          <Link to="/dashboard/tags">
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
          <Link to="/dashboard/places">
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
