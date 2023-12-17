import { Router } from "express";
import { createPlace, deletePlaceById, deletePlacesByIds, getAllPlaces, getPlacesByIds, getPlacesForUser, updatePlaceById } from "../controllers/PlaceController.js"

const placesRouter = Router();


placesRouter.post("/create", createPlace);
placesRouter.get("/", getAllPlaces);
placesRouter.get("/byId/:ids", getPlacesByIds);
placesRouter.get("/forUser", getPlacesForUser);
placesRouter.post("/update", updatePlaceById);
placesRouter.post("/delete", deletePlaceById);
placesRouter.post("/deleteMany", deletePlacesByIds);

export default placesRouter;
