import { Outlet, useNavigate } from "react-router-dom";
import styles from "./LayoutDashboard.module.scss";

const LayoutDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div id={styles.dashboardContainer}>
        <nav>
          <button type="button" onClick={() => navigate(-1)}>
            {"<"}
          </button>
        </nav>

        <div id={styles.dashboardContentContainer}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default LayoutDashboard;
