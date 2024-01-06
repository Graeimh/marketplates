import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./LayoutForms.module.scss";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const LayoutForms = () => {
  const navigate = useNavigate();

  return (
    <>
      <div id={styles.formsContainer}>
        <header>
          <button
            type="button"
            onClick={() => navigate(-1)}
            id={styles.formsButton}
          >
            <FontAwesomeIcon icon={solid("rotate-left")} />
          </button>
        </header>
        <div id={styles.formsBackground}></div>

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
