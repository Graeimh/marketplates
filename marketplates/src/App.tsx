import { useEffect, useState } from "react";
import * as authenticationService from "../src/services/authenticationService.js";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import LayoutLogged from "./components/Layouts/LayoutLogged/index.js";
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
    getResponse();
    // Setting the access token anew every 9 minute and 50 seconds whenever the user is logged in to avoid having windows where the user does not have an access token
    if (sessionStorage.getItem("refreshToken")) {
      const refreshAccessTokenInterval = setInterval(async () => {
        await authenticationService.generateAccessToken();
      }, 590000);

      return () => clearInterval(refreshAccessTokenInterval);
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

              {/* If the user isn't logged in, the routes to interact with user concent in do not exist*/}
              {sessionValue.userId.length !== 0 && (
                // LayoutLogged is used if the user accesses pages where the user is supposed to be logged in *
                <Route element={<LayoutLogged />}>
                  <Route
                    path="explore"
                    element={
                      <UserPathResolver userTypes={sessionValue.status}>
                        <Explore />
                      </UserPathResolver>
                    }
                  />

                  <Route
                    path="profile"
                    element={
                      // A path resolver redirects non-logged users that could have had access to the login page
                      <UserPathResolver userTypes={sessionValue.status}>
                        <Profile />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="createplace"
                    element={
                      <UserPathResolver userTypes={sessionValue.status}>
                        <PlaceEditor editPlaceId={undefined} />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="createmap"
                    element={
                      <UserPathResolver userTypes={sessionValue.status}>
                        <MapEditor editedMap={undefined} />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="editmap/:id"
                    element={
                      <UserPathResolver userTypes={sessionValue.status}>
                        <EditMapWrapper />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="editplace/:id"
                    element={
                      <UserPathResolver userTypes={sessionValue.status}>
                        <EditPlaceWrapper />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="myplaces"
                    element={
                      <UserPathResolver userTypes={sessionValue.status}>
                        <MyPlaces />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="mymaps"
                    element={
                      <UserPathResolver userTypes={sessionValue.status}>
                        <MyMaps />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="editprofile"
                    element={
                      <UserPathResolver userTypes={sessionValue.status}>
                        <EditProfile userId={sessionValue.userId} />
                      </UserPathResolver>
                    }
                  />
                </Route>
              )}
            </Route>

            {/* If the user is logged in, the routes to register or log in do not exist*/}
            {sessionValue.userId.length === 0 && (
              <Route element={<LayoutForms />}>
                <>
                  <Route path="register" element={<Register />} />
                  <Route
                    path="login"
                    element={<Login contextSetter={setSessionValue} />}
                  />
                </>
              </Route>
            )}

            {/* If the user is not an admin, the routes to use the dashboard do not exist*/}
            {sessionValue.status.split("&").indexOf("Admin") !== -1 && (
              <Route element={<LayoutDashboard />}>
                <Route
                  path="dashboard"
                  element={
                    // A path resolver redirects non-admin or logged users that could have had access to the front page
                    <AdminPathResolver userTypes={sessionValue.status}>
                      <Dashboard />
                    </AdminPathResolver>
                  }
                />
                <Route
                  path="/dashboard/users"
                  element={
                    <AdminPathResolver userTypes={sessionValue.status}>
                      <UserManipulation />
                    </AdminPathResolver>
                  }
                />
                <Route
                  path="/dashboard/tags"
                  element={
                    <AdminPathResolver userTypes={sessionValue.status}>
                      <TagManipulation />
                    </AdminPathResolver>
                  }
                />
                <Route
                  path="/dashboard/places"
                  element={
                    <AdminPathResolver userTypes={sessionValue.status}>
                      <PlaceManipulation />
                    </AdminPathResolver>
                  }
                />
              </Route>
            )}
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
