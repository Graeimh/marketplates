import { Router } from "express";
import { createPlaceIterationById } from "../controllers/PlaceIterationController.js"

const placeIterationsRouter = Router();

placeIterationsRouter.get("/", getAllPlaceIterations);
placeIterationsRouter.post("/create", createPlaceIterationById);
placeIterationsRouter.get("/:ids", getPlaceIterationByIds);
placeIterationsRouter.get("/userIterations/:ids", getPlaceIterationForUser);
placeIterationsRouter.post("/update", updateIterationById);
placeIterationsRouter.post("/delete", deleteIterationById);
placeIterationsRouter.post("/deleteMany", deleteIterationsByIds);

export default placeIterationsRouter;
