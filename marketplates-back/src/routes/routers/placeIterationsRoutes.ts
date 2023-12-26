import { Router } from "express";
import { createPlaceIterationById, deletePlaceIterationById, deletePlaceIterationsByIds, getAllPlaceIterations, getAllPlaceIterationsFromPlace, getPlaceIterationByIds, getPlaceIterationForUser, updatePlaceIterationById } from "../../controllers/PlaceIterationController.js"
import { idChecker } from "../../middlewares/idChecker.js";

const placeIterationsRouter = Router();

placeIterationsRouter.get("/", getAllPlaceIterations);
placeIterationsRouter.post("/create", createPlaceIterationById);
placeIterationsRouter.get("/byIds/:ids", idChecker, getPlaceIterationByIds);
placeIterationsRouter.get("/userIterations/:ids", idChecker, getPlaceIterationForUser);
placeIterationsRouter.get("/places/:ids", idChecker, getAllPlaceIterationsFromPlace);
placeIterationsRouter.post("/update", updatePlaceIterationById);
placeIterationsRouter.post("/delete", deletePlaceIterationById);
placeIterationsRouter.post("/deleteMany", deletePlaceIterationsByIds);

export default placeIterationsRouter;
