import { Router } from "express";
import appliances from "./applianceRoutes.js"
import miscellaneous from "./miscellaneousRoutes.js"
import users from "./userRoutes.js"
import authentication from "./authenticationRoutes.js"
import security from "./securityRoutes.js"
import tags from "./tagRoutes.js"

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.json({
    message: "API OK !",
  });
});

appRouter.use("/appliances", appliances);
appRouter.use("/auth", authentication);
appRouter.use("/miscellaneous", miscellaneous);
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
