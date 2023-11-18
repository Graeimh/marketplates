import { Router } from "express";
import { authToken } from "../middlewares/authToken.js";
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

// appRouter.get("/pastries", authToken, getPastriesData);
// appRouter.get("/pastries/remaining", getRemainingPastriesData);
// appRouter.post("/pastries/prizes", authToken, getPrizes);

// appRouter.post("/user/", authToken, getUserData);
// appRouter.post("/user/results", authToken, getUserResults);
// appRouter.post("/user/reroll", authToken, setRerolledUserResults);
// appRouter.post("/user/trials", authToken, getUserTries);

// appRouter.patch("/user/trials", authToken, setUserTries);
// appRouter.patch("/user/results", authToken, setUserResults);

// appRouter.post("/dice", authToken, getNewDiceResults);

/*
keep AuthToken
create an Admin AuthToken

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
