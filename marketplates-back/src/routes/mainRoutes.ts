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
appRouter.use("/marketplates/dist/auth", authentication); ///marketplates/dist

// Serves for the maps' CRUD
appRouter.use("/marketplates/dist/maps", checkAccessToken, maps);

// Serves for the place iterations' CRUD
appRouter.use("/marketplates/dist/placeIterations", checkAccessToken, placeIterations);

// Serves for the places' CRUD
appRouter.use("/marketplates/dist/places", checkAccessToken, places);

// Serves for the tags' CRUD
appRouter.use("/marketplates/dist/tags", checkAccessToken, tags);

// Serves for the maps' CRUD as well as user registration
appRouter.use("/marketplates/dist/users", users);

export default appRouter;
