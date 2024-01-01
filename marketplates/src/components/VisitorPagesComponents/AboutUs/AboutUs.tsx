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
    </>
  );
}

export default AboutUs;
