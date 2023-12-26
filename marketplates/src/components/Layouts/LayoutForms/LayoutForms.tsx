import { Outlet } from "react-router-dom";
import styles from "./LayoutForms.module.scss";

const LayoutForms = () => {
  return (
    <>
      <h1>New layout!</h1>

      <Outlet />
    </>
  );
};

export default LayoutForms;
