import { Router } from "express";
import authentication from "./routers/authenticationRoutes.js"
import maps from "./routers/mapsRoutes.js"
import placeIterations from "./routers/placeIterationsRoutes.js"
import places from "./routers/placeRoutes.js"
import tags from "./routers/tagRoutes.js"
import users from "./routers/userRoutes.js"
import { checkAccessToken } from "../middlewares/checkAccessToken.js";

const appRouter = Router();

appRouter.use("/auth", authentication);
appRouter.use("/maps", checkAccessToken, maps);
appRouter.use("/placeIterations", checkAccessToken, placeIterations);
appRouter.use("/places", checkAccessToken, places);
appRouter.use("/tags", checkAccessToken, tags);
appRouter.use("/users", users);

export default appRouter;
