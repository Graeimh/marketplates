import { Link } from "react-router-dom";
import styles from "./Profile.module.scss";
function Profile() {
  return (
    <>
      <h1>Profile</h1>
      <li>
        <Link to="/editprofile">Edit my profile</Link>
      </li>
    </>
  );
}

export default Profile;
