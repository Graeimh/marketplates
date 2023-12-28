import { Outlet, useNavigate } from "react-router-dom";
import styles from "./LayoutDashboard.module.scss";

const LayoutDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" onClick={() => navigate(-1)}>
        {"<"}
      </button>
      <h1>New layout for the dashboard!</h1>

      <Outlet />
    </>
  );
};

export default LayoutDashboard;
