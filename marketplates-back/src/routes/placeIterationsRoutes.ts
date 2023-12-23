import { Router } from "express";
import { createPlaceIterationById, deleteIterationById, deleteIterationsByIds, getAllPlaceIterations, getAllPlaceIterationsFromPlace, getPlaceIterationByIds, getPlaceIterationForUser, updatePlaceIterationById } from "../controllers/PlaceIterationController.js"

const placeIterationsRouter = Router();

placeIterationsRouter.get("/", getAllPlaceIterations);
placeIterationsRouter.post("/create", createPlaceIterationById);
placeIterationsRouter.get("/byIds/:ids", getPlaceIterationByIds);
placeIterationsRouter.get("/userIterations/:userId", getPlaceIterationForUser);
placeIterationsRouter.get("/places/:placeId", getAllPlaceIterationsFromPlace);
placeIterationsRouter.post("/update", updatePlaceIterationById);
placeIterationsRouter.post("/delete", deleteIterationById);
placeIterationsRouter.post("/deleteMany", deleteIterationsByIds);

export default placeIterationsRouter;
