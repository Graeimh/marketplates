import { useEffect, useState } from "react";
import * as APIService from "../src/services/api";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ApplianceManipulation from "./components/ApplianceManipulation";
// import BasketManipulation from './components/BasketManipulation';
// import IterationManipulation from './components/IterationManipulation';
// import MenuItemManipulation from './components/MenuItemManipulation';
// import MenuManipulation from './components/MenuManipulation';
// import MenusSectionManipulation from './components/MenusSectionManipulation';
// import OpinionManipulation from './components/OpinionManipulation';
// import PlaceManipulation from './components/PlaceManipulation';
// import PostManipulation from './components/PostManipulation';
// import ProductManipulation from './components/ProductManipulation';
// import RecipeManipulation from './components/RecipeManipulation';
// import TagManipulation from './components/TagManipulation';
// import UserManipulation from './components/UserManipulation';
import AboutUs from "./components/AboutUs";
import Explore from "./components/Explore";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import * as jose from "jose";
import UserContext from "./components/UserContext";
import UserPathResolver from "./components/UserPathResolver";
import AdminPathResolver from "./components/AdminPathResolver";
import PlacePathResolver from "./components/PlacePathResolver";
import Dashboard from "./components/Dashboard";
import MyPlaces from "./components/MyPlaces";
import LayoutForms from "./components/LayoutForms";
import LayoutLogged from "./components/LayoutLogged";

interface IUserContext {
  email: string;
  displayName: string;
  userId: string;
  status: string;
  iat: number;
}

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
        const status = await APIService.getApiStatus();
        const loadedSessionData = await APIService.getSessionData();
        setSessionData(jose.decodeJwt(loadedSessionData.cookie));
        setMessage(status);
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
            <Route path="/" element={<Layout contextSetter={setSessionData} />}>
              <Route index element={<Home />} />
              <Route path="aboutus" element={<AboutUs />} />
              <Route path="explore" element={<Explore />} />
            </Route>
            <Route path="/" element={<LayoutLogged />}>
              <Route
                path="profile"
                element={
                  <UserPathResolver userTypes={sessionData.status}>
                    <Profile />
                  </UserPathResolver>
                }
              />
              <Route
                path="dashboard"
                element={
                  <AdminPathResolver userTypes={sessionData.status}>
                    <Dashboard />
                  </AdminPathResolver>
                }
              />
              <Route
                path="placeprofile"
                element={
                  <PlacePathResolver userTypes={sessionData.status}>
                    <MyPlaces />
                  </PlacePathResolver>
                }
              />
            </Route>
            <Route path="/" element={<LayoutForms />}>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* <Route index element={<MyNotifications />} />
              <Route index element={<MyMaps />} />       
              <Route index element={<MyPlaces />} />  
              <Route index element={<Dashboard />} />         */}
            <Route path="appliances" element={<ApplianceManipulation />} />
            {/* <Route path="baskets" element={<BasketManipulation />} />
              <Route path="iterations" element={<IterationManipulation />} />
              <Route path="menuitems" element={<MenuItemManipulation />} />
              <Route path="menus" element={<MenuManipulation />} />
              <Route path="menussections" element={<MenusSectionManipulation />} />
              <Route path="opinions" element={<OpinionManipulation />} />
              <Route path="places" element={<PlaceManipulation />} />
              <Route path="posts" element={<PostManipulation />} />
              <Route path="products" element={<ProductManipulation />} />
              <Route path="recipes" element={<RecipeManipulation />} />
              <Route path="tags" element={<TagManipulation />} />
              <Route path="users" element={<UserManipulation />} /> */}
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
