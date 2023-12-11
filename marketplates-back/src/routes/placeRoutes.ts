import { Router } from "express";
import { checkToken } from "../middlewares/checkToken.js";
import { createPlace, deletePlaceById, deletePlacesByIds, getAllPlaces, getPlacesByIds, updatePlaceById } from "../controllers/PlaceController.js"

const placesRouter = Router();


placesRouter.post("/create", createPlace);
placesRouter.get("/", getAllPlaces);
placesRouter.get("/:ids", getPlacesByIds);
placesRouter.post("/update", updatePlaceById);
placesRouter.post("/delete", deletePlaceById);
placesRouter.post("/deleteMany", deletePlacesByIds);

export default placesRouter;
