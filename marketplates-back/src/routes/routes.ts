import { Router } from "express";
import { checkToken } from "../middlewares/checkToken.js";
import { createAppliance } from "../controllers/ApplianceController.js";
import appliances from "./applianceRoutes.js"
import miscellaneous from "./miscellaneousRoutes.js"
import users from "./userRoutes.js"
import authentication from "./authenticationRoutes.js"

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.json({
    message: "API OK !",
  });
});

appRouter.use("/appliances", appliances);
appRouter.use("/auth", authentication);
appRouter.use("/miscellaneous", miscellaneous);
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
