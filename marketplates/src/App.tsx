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
import LayoutLogged from "./components/Layouts/LayoutLogged/index.js";
import UserManipulation from "./components/AdminDashboard/UserManipulation/index.js";
import TagManipulation from "./components/AdminDashboard/TagManipulation/index.js";
import RegisterPlace from "./components/MapGenerationComponents/RegisterPlace/index.js";
import EditPlaceWrapper from "./components/MapGenerationComponents/EditPlaceWrapper/index.js";
import PlaceManipulation from "./components/AdminDashboard/PlaceManipulation/index.js";
import MapEditor from "./components/MapGenerationComponents/MapEditor/index.js";
import MyMaps from "./components/UserPagesComponents/MyMaps/index.js";
import EditProfile from "./components/UserPagesComponents/EditProfile/index.js";
import EditMapWrapper from "./components/MapGenerationComponents/EditMapWrapper/index.js";
import { IUserContext } from "./common/types/userTypes/userTypes.js";

function App() {
  const [message, setMessage] = useState(null);
  const [sessionData, setSessionData] = useState<IUserContext>({
    email: "",
    displayName: "",
    userId: "",
    status: "",
    iat: 0,
  });

  useEffect(() => {
    async function getResponse() {
      try {
        const loadedSessionData = await authenticationService.getSessionData();
        setSessionData(jose.decodeJwt(loadedSessionData.cookie));
      } catch (err) {
        setMessage(err.message);
      }
    }
    getResponse();
  }, []);

  return (
    <>
      <UserContext.Provider value={sessionData}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout contextSetter={setSessionData} />}>
              <Route path="" element={<Explore />} />
              <Route path="aboutus" element={<AboutUs />} />
            </Route>
            <Route element={<LayoutLogged />}>
              <Route
                path="profile"
                element={
                  <UserPathResolver userTypes={sessionData.status}>
                    <Profile />
                  </UserPathResolver>
                }
              />
              <Route
                path="createplace"
                element={<RegisterPlace editPlaceId={undefined} />}
              />
              <Route
                path="createmap"
                element={<MapEditor editedMap={undefined} />}
              />
              <Route path="editmap/:id" element={<EditMapWrapper />} />

              <Route path="editplace/:id" element={<EditPlaceWrapper />} />
              <Route
                path="dashboard"
                element={
                  <AdminPathResolver userTypes={sessionData.status}>
                    <Dashboard />
                  </AdminPathResolver>
                }
              />
              <Route path="myplaces" element={<MyPlaces />} />
            </Route>
            <Route path="mymaps" element={<MyMaps />} />

            <Route element={<LayoutForms />}>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route path="users" element={<UserManipulation />} />
            <Route path="tags" element={<TagManipulation />} />
            <Route path="places" element={<PlaceManipulation />} />
            <Route
              path="createplace"
              element={<RegisterPlace editPlaceId={undefined} />}
            />
            <Route
              path="myprofile"
              element={<EditProfile userId={sessionData.userId} />}
            />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
