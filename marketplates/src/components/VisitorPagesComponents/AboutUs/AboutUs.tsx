import { Helmet } from "react-helmet";
import styles from "./AboutUs.module.scss";

function AboutUs() {
  return (
    <>
      <Helmet>
        <title>About us</title>
        <link rel="canonical" href="http://localhost:5173" />
      </Helmet>

      <h1>About us</h1>
      <span id={styles.spoonWrapper}>
        <img src="src\assets\spoon.svg" alt="Pot" id={styles.spoon} />
      </span>
      <img src="src\assets\pot.svg" alt="Spoon" id={styles.pot} />
    </>
  );
}

export default AboutUs;
