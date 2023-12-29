import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./LayoutForms.module.scss";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const LayoutForms = () => {
  const navigate = useNavigate();

  return (
    <>
      <div id={styles.formsContainer}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          id={styles.formsButton}
        >
          <FontAwesomeIcon icon={solid("rotate-left")} />
        </button>
        <img
          src="https://storage.needpix.com/rsynced_images/kitchen-85270_1280.jpg"
          alt="pots and pans"
          id={styles.formsImage}
        />
        <div id={styles.formsContentContainer}>
          <div id={styles.formsContent}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutForms;
