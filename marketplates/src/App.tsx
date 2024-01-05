import { useEffect, useState } from "react";
import * as authenticationService from "../src/services/authenticationService.js";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layouts/Layout/index.js";
import AboutUs from "./components/VisitorPagesComponents/AboutUs/index.js";
import Explore from "./components/UserPagesComponents/Explore/index.js";
import Register from "./components/VisitorPagesComponents/Register/index.js";
import Login from "./components/VisitorPagesComponents/Login/index.js";
import Profile from "./components/UserPagesComponents/Profile/index.js";
import * as jose from "jose";
import UserContext from "./components/Contexts/UserContext/index.js";
import UserPathResolver from "./components/PathResolvers/UserPathResolver/index.js";
import AdminPathResolver from "./components/PathResolvers/AdminPathResolver/index.js";
import Dashboard from "./components/AdminDashboard/Dashboard/index.js";
import MyPlaces from "./components/UserPagesComponents/MyPlaces/index.js";
import LayoutForms from "./components/Layouts/LayoutForms/index.js";
import UserManipulation from "./components/AdminDashboard/UserManipulation/index.js";
import TagManipulation from "./components/AdminDashboard/TagManipulation/index.js";
import PlaceEditor from "./components/MapGenerationComponents/PlaceEditor/index.js";
import EditPlaceWrapper from "./components/MapGenerationComponents/EditPlaceWrapper/index.js";
import PlaceManipulation from "./components/AdminDashboard/PlaceManipulation/index.js";
import MapEditor from "./components/MapGenerationComponents/MapEditor/index.js";
import MyMaps from "./components/UserPagesComponents/MyMaps/index.js";
import EditProfile from "./components/UserPagesComponents/EditProfile/index.js";
import EditMapWrapper from "./components/MapGenerationComponents/EditMapWrapper/index.js";
import { ISessionValues } from "./common/types/userTypes/userTypes.js";
import LayoutDashboard from "./components/Layouts/LayoutDashboard/LayoutDashboard.js";
import { Helmet } from "react-helmet";
import NonLoggedPathResolver from "./components/PathResolvers/NonLoggedPathResolver/index.js";

function App() {
  // Setting states
  // Messages meant to give users feedback on the state of their actions
  const [message, setMessage] = useState(null);

  // Session values tied to the user, logged or not
  const [sessionValue, setSessionValue] = useState<ISessionValues>({
    email: "",
    displayName: "",
    userId: "",
    status: "",
    iat: 0,
    exp: 0,
  });

  // Upon rendering
  useEffect(() => {
    async function getResponse() {
      try {
        // Obtaining the session's data through the access token stored in the cookie
        const loadedSessionData = await authenticationService.getSessionData();
        setSessionValue(jose.decodeJwt(loadedSessionData.cookie));
      } catch (err) {
        setMessage(err.message);
      }
    }

    const refreshValue = localStorage.getItem("refreshToken");

    if (refreshValue && refreshValue !== null) {
      const userSessionData: ISessionValues = jose.decodeJwt(refreshValue);
      setSessionValue(userSessionData);

      // Setting the access token anew every 9 minute and 50 seconds whenever the user is logged in to avoid having windows where the user does not have an access token
      const refreshAccessTokenInterval = setInterval(async () => {
        await authenticationService.generateAccessToken();
      }, 590000);

      return () => clearInterval(refreshAccessTokenInterval);
    } else {
      getResponse();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Marketplates</title>
        <link rel="canonical" href="http://localhost:5173/" />
      </Helmet>

      <UserContext.Provider value={sessionValue}>
        <BrowserRouter>
          <Routes>
            {/* setSessionData is given to the layout for the logout button, it's aim is to set the session data back to its base value*/}
            <Route element={<Layout contextSetter={setSessionValue} />}>
              <Route path="" element={<AboutUs />} />
              <>
                <Route
                  path="explore"
                  element={
                    <UserPathResolver>
                      <Explore />
                    </UserPathResolver>
                  }
                />

                <Route
                  path="profile"
                  element={
                    // A path resolver redirects non-logged users that could have had access to the login page
                    <UserPathResolver>
                      <Profile contextSetter={setSessionValue} />
                    </UserPathResolver>
                  }
                />
                <Route
                  path="createplace"
                  element={
                    <UserPathResolver>
                      <PlaceEditor editPlaceId={undefined} />
                    </UserPathResolver>
                  }
                />
                <Route
                  path="createmap"
                  element={
                    <UserPathResolver>
                      <MapEditor editedMap={undefined} />
                    </UserPathResolver>
                  }
                />
                <Route
                  path="editmap/:id"
                  element={
                    <UserPathResolver>
                      <EditMapWrapper />
                    </UserPathResolver>
                  }
                />
                <Route
                  path="editplace/:id"
                  element={
                    <UserPathResolver>
                      <EditPlaceWrapper />
                    </UserPathResolver>
                  }
                />
                <Route
                  path="myplaces"
                  element={
                    <UserPathResolver>
                      <MyPlaces />
                    </UserPathResolver>
                  }
                />
                <Route
                  path="mymaps"
                  element={
                    <UserPathResolver>
                      <MyMaps />
                    </UserPathResolver>
                  }
                />
                <Route
                  path="editprofile"
                  element={
                    <UserPathResolver>
                      <EditProfile userId={sessionValue.userId} />
                    </UserPathResolver>
                  }
                />
              </>
            </Route>

            <Route element={<LayoutForms />}>
              <>
                <Route
                  path="register"
                  element={
                    <NonLoggedPathResolver>
                      <Register />
                    </NonLoggedPathResolver>
                  }
                />
                <Route
                  path="login"
                  element={
                    <NonLoggedPathResolver>
                      <Login contextSetter={setSessionValue} />
                    </NonLoggedPathResolver>
                  }
                />
              </>
            </Route>

            <Route element={<LayoutDashboard />}>
              <Route
                path="dashboard"
                element={
                  // A path resolver redirects non-admin or logged users that could have had access to the front page
                  <AdminPathResolver>
                    <Dashboard />
                  </AdminPathResolver>
                }
              />
              <Route
                path="/dashboard/users"
                element={
                  <AdminPathResolver>
                    <UserManipulation />
                  </AdminPathResolver>
                }
              />
              <Route
                path="/dashboard/tags"
                element={
                  <AdminPathResolver>
                    <TagManipulation />
                  </AdminPathResolver>
                }
              />
              <Route
                path="/dashboard/places"
                element={
                  <AdminPathResolver>
                    <PlaceManipulation />
                  </AdminPathResolver>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
