import { Router } from "express";
import { authToken } from "../middlewares/authToken.js";
import { createAppliance } from "../controllers/ApplianceController.js";
import appliances from "./applianceRoutes.js"

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.json({
    message: "API OK !",
  });
});

appRouter.use("/appliances", appliances);


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

export default appRouter;
