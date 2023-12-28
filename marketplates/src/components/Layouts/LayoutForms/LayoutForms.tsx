import { Outlet, useNavigate } from "react-router-dom";
import styles from "./LayoutForms.module.scss";

const LayoutForms = () => {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" onClick={() => navigate(-1)}>
        {"<"}
      </button>
      <h1>New layout!</h1>

      <Outlet />
    </>
  );
};

export default LayoutForms;
