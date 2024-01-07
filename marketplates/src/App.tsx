import { useEffect, useState } from "react";
import * as authenticationService from "../src/services/authenticationService.js";
import styles from "./common/styles/Message.module.scss";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layouts/Layout/index.js";
import Home from "./components/VisitorPagesComponents/Home/index.js";
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
import Contact from "./components/VisitorPagesComponents/Contact/Contact.js";
import MessageContext from "./components/Contexts/MessageContext/MessageContext.js";
import { IMessageValues } from "./common/types/commonTypes.ts/commonTypes.js";

function App() {
  // Setting states
  // Session values tied to the user, logged or not
  const [sessionValue, setSessionValue] = useState<ISessionValues>({
    email: "",
    displayName: "",
    userId: "",
    status: "",
    iat: 0,
    exp: 0,
  });

  // Messages meant to give users feedback on the state of their actions, passed down to nearly all components
  const [messageValue, setMessageValue] = useState<IMessageValues>({
    message: "",
    successStatus: true,
  });

  // Upon setting a new message
  useEffect(() => {
    if (messageValue.message.length > 0) {
      const messageTimer = setTimeout(() => {
        setMessageValue({
          message: "",
          successStatus: true,
        });
      }, 1500);

      return () => {
        clearTimeout(messageTimer);
      };
    }
  }, [messageValue]);

  // Upon rendering
  useEffect(() => {
    async function getResponse() {
      try {
        // Obtaining the session's data through the access token stored in the cookie
        const loadedSessionData = await authenticationService.getSessionData();
        setSessionValue(jose.decodeJwt(loadedSessionData.cookie));
      } catch (err) {
        setMessageValue({
          message: "We could not reach your session yet, please log in",
          successStatus: false,
        });
      }
    }

    // Setting the access token anew every 9 minute and 50 seconds whenever the user is logged in to avoid having windows where the user does not have an access token
    const refreshValue = localStorage.getItem("refreshToken");

    if (refreshValue && refreshValue !== null) {
      const userSessionData: ISessionValues = jose.decodeJwt(refreshValue);
      setSessionValue(userSessionData);

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
      {messageValue.message !== undefined &&
        messageValue.message.length > 0 && (
          <div
            aria-label={`User message : ${messageValue.message}`}
            className={
              messageValue.successStatus
                ? `${styles.isSuccess} ${styles.messageContainer} ${styles.top}`
                : `${styles.isError} ${styles.messageContainer} ${styles.top}`
            }
          >
            <div>{messageValue.message}</div>
          </div>
        )}
      <MessageContext.Provider value={messageValue}>
        <UserContext.Provider value={sessionValue}>
          <BrowserRouter>
            <Routes>
              {/* setSessionValue is given to the layout for the logout button, it's aim is to set the session data back to its base value*/}
              <Route
                element={
                  <Layout
                    contextSetter={setSessionValue}
                    messageSetter={setMessageValue}
                  />
                }
              >
                <Route path="" element={<Home />} />
                <Route path="contact" element={<Contact />} />
                <>
                  <Route
                    path="profile"
                    element={
                      // A path resolver redirects non-logged users that could have had access to the login page
                      <UserPathResolver>
                        <Profile
                          contextSetter={setSessionValue}
                          messageSetter={setMessageValue}
                        />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="createplace"
                    element={
                      <UserPathResolver>
                        <PlaceEditor
                          editPlaceId={undefined}
                          messageSetter={setMessageValue}
                        />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="createmap"
                    element={
                      <UserPathResolver>
                        <MapEditor
                          editedMap={undefined}
                          messageSetter={setMessageValue}
                        />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="editmap/:id"
                    element={
                      <UserPathResolver>
                        <EditMapWrapper messageSetter={setMessageValue} />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="editplace/:id"
                    element={
                      <UserPathResolver>
                        <EditPlaceWrapper messageSetter={setMessageValue} />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="myplaces"
                    element={
                      <UserPathResolver>
                        <MyPlaces messageSetter={setMessageValue} />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="mymaps"
                    element={
                      <UserPathResolver>
                        <MyMaps messageSetter={setMessageValue} />
                      </UserPathResolver>
                    }
                  />
                  <Route
                    path="editprofile"
                    element={
                      <UserPathResolver>
                        <EditProfile
                          userId={sessionValue.userId}
                          messageSetter={setMessageValue}
                        />
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
                        <Register messageSetter={setMessageValue} />
                      </NonLoggedPathResolver>
                    }
                  />
                  <Route
                    path="login"
                    element={
                      <NonLoggedPathResolver>
                        <Login
                          contextSetter={setSessionValue}
                          messageSetter={setMessageValue}
                        />
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
                      <UserManipulation messageSetter={setMessageValue} />
                    </AdminPathResolver>
                  }
                />
                <Route
                  path="/dashboard/tags"
                  element={
                    <AdminPathResolver>
                      <TagManipulation messageSetter={setMessageValue} />
                    </AdminPathResolver>
                  }
                />
                <Route
                  path="/dashboard/places"
                  element={
                    <AdminPathResolver>
                      <PlaceManipulation messageSetter={setMessageValue} />
                    </AdminPathResolver>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </MessageContext.Provider>
      {messageValue.message !== undefined &&
        messageValue.message.length > 0 && (
          <div
            className={
              messageValue.successStatus
                ? `${styles.isSuccess} ${styles.messageContainer} ${styles.bottom}`
                : `${styles.isError} ${styles.messageContainer} ${styles.bottom}`
            }
          >
            <div>{messageValue.message}</div>
          </div>
        )}
    </>
  );
}

export default App;
