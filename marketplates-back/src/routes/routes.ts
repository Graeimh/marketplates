import { Router } from "express";
import appliances from "./applianceRoutes.js"
import authentication from "./authenticationRoutes.js"
import maps from "./mapsRoutes.js"
import miscellaneous from "./miscellaneousRoutes.js"
import placeIterations from "./placeIterationsRoutes.js"
import places from "./placeRoutes.js"
import security from "./securityRoutes.js"
import tags from "./tagRoutes.js"
import users from "./userRoutes.js"


const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.json({
    message: "API OK !",
  });
});

appRouter.use("/appliances", appliances);
appRouter.use("/auth", authentication);
appRouter.use("/maps", maps);
appRouter.use("/miscellaneous", miscellaneous);
appRouter.use("/placeIterations", placeIterations);
appRouter.use("/places", places);
appRouter.use("/security", security);
appRouter.use("/tags", tags);
appRouter.use("/users", users);


/*
keep checkToken
create an Admin checkToken

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
