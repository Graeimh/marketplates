import { Router } from "express";
import appliances from "./applianceRoutes.js"
import authentication from "./authenticationRoutes.js"
import maps from "./mapsRoutes.js"
import placeIterations from "./placeIterationsRoutes.js"
import places from "./placeRoutes.js"
import security from "./securityRoutes.js"
import tags from "./tagRoutes.js"
import users from "./userRoutes.js"
import { checkAccessToken } from "../middlewares/checkAccessToken.js";


const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.json({
    message: "API OK !",
  });
});

appRouter.use("/appliances", checkAccessToken, appliances);
appRouter.use("/auth", authentication);
appRouter.use("/maps", checkAccessToken, maps);
appRouter.use("/placeIterations", checkAccessToken, placeIterations);
appRouter.use("/places", checkAccessToken, places);
appRouter.use("/security", checkAccessToken, security);
appRouter.use("/tags", checkAccessToken, tags);
appRouter.use("/users", users);


/*


CRUD for all collections
appliances
baskets
iterations
menuItems
menus
menuSections
opinions
places
products
recipes
tags
users*/

export default appRouter;
