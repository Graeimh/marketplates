import { Router } from "express";
import { createPlace, deletePlaceById, deletePlacesByIds, getAllPlaces, getPlacesByIds, getPlacesForUser, updatePlaceById } from "../../controllers/PlaceController.js"
import { idChecker } from "../../middlewares/idChecker.js";

const placesRouter = Router();

// Fetches all places, used for to fill the default maps and admin dashboard
placesRouter.get("/", getAllPlaces);

// Allows get a specific group of places
placesRouter.get("/byId/:ids", idChecker, getPlacesByIds);

// Allows to fetch all the places created by a user, serves for the MyPlaces component
placesRouter.get("/forUser", getPlacesForUser);

// Allows to create a place displayed on every default maps
placesRouter.post("/create", createPlace);

// Reserved for the owning user or an admin, serves to update a place's data in the database
placesRouter.put("/update", updatePlaceById);

// Reserved for the owning user or an admin, serves to delete a single place from the database
placesRouter.delete("/delete/:ids", deletePlaceById);

// For admins only, serves to delete one or several places from the database
placesRouter.delete("/deleteMany/:ids", deletePlacesByIds);

export default placesRouter;
