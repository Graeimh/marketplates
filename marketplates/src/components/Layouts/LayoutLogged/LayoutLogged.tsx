import { Outlet } from "react-router-dom";
import styles from "./LayoutLogged.module.scss";

const LayoutLogged = () => {
  return (
    <>
      <h1>New layout for logged!</h1>

      <Outlet />
    </>
  );
};

export default LayoutLogged;
