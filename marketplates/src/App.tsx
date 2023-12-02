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

function App() {
  const [message, setMessage] = useState(null);
  const [sessionData, setSessionData] = useState(null);

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
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="aboutus" element={<AboutUs />} />
              <Route path="explore" element={<Explore />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="profile" element={<Profile />} />
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
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
