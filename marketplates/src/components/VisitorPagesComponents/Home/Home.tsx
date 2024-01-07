import { Helmet } from "react-helmet";
import styles from "./Home.module.scss";
import { useContext } from "react";
import UserContext from "../../Contexts/UserContext";
import { Link } from "react-router-dom";

function Home() {
  // Fetching the user's current data
  const userContextValue = useContext(UserContext);

  return (
    <>
      <Helmet>
        <title>Marketplates</title>
        <link rel="canonical" href="http://localhost:5173" />
      </Helmet>
      <article id={styles.homeContainer}>
        <h1>What's new in the pot?</h1>
        <div id={styles.homeDisposition}>
          <section className={styles.homeSections}>
            <h2>We just launched!</h2>
            <p>
              Welcome aboard everyone, Marketplates is officially online... for
              now!
            </p>
          </section>
          {userContextValue.userId.length > 0 ? (
            <section className={styles.homeSections}>
              <h2>Since you are already here, try our new features out!</h2>
            </section>
          ) : (
            <section className={styles.homeSections}>
              <h2>Not around the table already?</h2>
              <p>
                Consider <Link to="/login">logging in</Link> or{" "}
                <Link to="/register">registering</Link>
              </p>
            </section>
          )}
        </div>
      </article>
      <span id={styles.spoonWrapper}>
        <img src="src\assets\spoon.svg" alt="Pot" id={styles.spoon} />
      </span>
      <img src="src\assets\pot.svg" alt="Spoon" id={styles.pot} />
    </>
  );
}

export default Home;
