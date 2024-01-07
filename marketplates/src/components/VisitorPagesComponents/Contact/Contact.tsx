import { Helmet } from "react-helmet";
import styles from "./Contact.module.scss";

function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact</title>
        <link rel="canonical" href="http://localhost:5173/contact" />
      </Helmet>
      <article id={styles.contactContainer}>
        <h1>Contact</h1>
        <h2>Keep the pot boiling!</h2>
        <div id={styles.contactDisposition}>
          <section className={styles.contactSections}>
            <h3>Give us feedback</h3>
            <p>
              If you find a bug of any kind, want to suggest a feature or report
              a bug please send a mail to the following email address.
              <br />
              <a
                href="mailto: marketplatesowner@gmail.com"
                aria-label="Send mail to marketplatesowner@gmail.com"
              >
                Send us some love!
              </a>
            </p>
          </section>

          <section className={styles.contactSections}>
            <h3>Legal mentions</h3>
            <p>
              This website has been developped by Quentin Guinier, 23 Rue Jean
              Jaurès, Lesquin, you can email me at the email address specified
              above.
            </p>
            <p>
              Our map system is made using{" "}
              <a href="https://react-leaflet.js.org/">React Leaflet</a>. We are
              hosted by ...
            </p>
          </section>
        </div>
      </article>
    </>
  );
}

export default Contact;
