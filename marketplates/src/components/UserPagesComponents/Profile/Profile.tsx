import { Link } from "react-router-dom";
import styles from "./Profile.module.scss";
import { Helmet } from "react-helmet";
function Profile() {
  return (
    <>
      <Helmet>
        <title>Profile</title>
        <link rel="canonical" href="http://localhost:5173/profile" />
      </Helmet>

      <h1>Profile</h1>
      <li>
        <Link to="/editprofile">Edit my profile</Link>
      </li>
    </>
  );
}

export default Profile;
