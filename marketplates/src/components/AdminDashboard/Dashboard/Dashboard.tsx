import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <h1>Hi! Welcome to the dashboard!</h1>
      <ul>
        <li>
          <Link to="/users">Manipulate users</Link>
        </li>
        <li>
          <Link to="/tags">Manipulate tags</Link>
        </li>
        <li>
          <Link to="/places">Manipulate places</Link>
        </li>
      </ul>
    </>
  );
}

export default Dashboard;
