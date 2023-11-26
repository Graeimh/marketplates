import { Router } from "express";
import { checkToken } from "../middlewares/checkToken.js";
import { createAppliance, getAppliances, getAppliancesByIds, updateApplianceById, deleteApplianceById, deleteAppliancesByIds } from "../controllers/ApplianceController.js";

const appliancesRouter = Router();

appliancesRouter.get("/", getAppliances);
appliancesRouter.get("/:ids", getAppliancesByIds);
appliancesRouter.post("/create", createAppliance);
appliancesRouter.post("/update", updateApplianceById);
appliancesRouter.post("/delete", deleteApplianceById);
appliancesRouter.post("/deleteMany", deleteAppliancesByIds);



// appRouter.post("/register", registerUser);
// appRouter.post("/login", loginUser);

// appRouter.get("/pastries", checkToken, getPastriesData);
// appRouter.get("/pastries/remaining", getRemainingPastriesData);
// appRouter.post("/pastries/prizes", checkToken, getPrizes);

// appRouter.post("/user/", checkToken, getUserData);
// appRouter.post("/user/results", checkToken, getUserResults);
// appRouter.post("/user/reroll", checkToken, setRerolledUserResults);
// appRouter.post("/user/trials", checkToken, getUserTries);

// appRouter.patch("/user/trials", checkToken, setUserTries);
// appRouter.patch("/user/results", checkToken, setUserResults);

// appRouter.post("/dice", checkToken, getNewDiceResults);

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

export default appliancesRouter;
