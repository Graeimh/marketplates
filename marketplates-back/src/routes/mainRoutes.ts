import { Router } from "express";
import authentication from "./routers/authenticationRoutes.js"
import maps from "./routers/mapsRoutes.js"
import placeIterations from "./routers/placeIterationsRoutes.js"
import places from "./routers/placeRoutes.js"
import tags from "./routers/tagRoutes.js"
import users from "./routers/userRoutes.js"
import { checkAccessToken } from "../middlewares/checkAccessToken.js";

// Serves to collect every routes
const appRouter = Router();

// Serves for login, logout, session status checking and access token generation
appRouter.use("/auth", authentication);

// Serves for the maps' CRUD
appRouter.use("/maps", checkAccessToken, maps);

// Serves for the place iterations' CRUD
appRouter.use("/placeIterations", checkAccessToken, placeIterations);

// Serves for the places' CRUD
appRouter.use("/places", checkAccessToken, places);

// Serves for the tags' CRUD
appRouter.use("/tags", checkAccessToken, tags);

// Serves for the maps' CRUD as well as user registration
appRouter.use("/users", users);

export default appRouter;
