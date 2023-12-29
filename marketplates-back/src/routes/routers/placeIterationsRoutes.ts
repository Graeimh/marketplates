import { Router } from "express";
import { createPlaceIterationById, deletePlaceIterationById, deletePlaceIterationsByIds, getAllPlaceIterations, getAllPlaceIterationsFromPlace, getPlaceIterationsByIds, getPlaceIterationForUser, updatePlaceIterationById } from "../../controllers/PlaceIterationController.js"
import { idChecker } from "../../middlewares/idChecker.js";

const placeIterationsRouter = Router();

// Fetches all place iterations, will be used in the future for the dashboard
placeIterationsRouter.get("/", getAllPlaceIterations);

// Allows to create a place iteration, a user-made custom copy of a place's data
placeIterationsRouter.post("/create", createPlaceIterationById);

// Fetches data for a specific group of place iterations, is used to fetch custom markers for user maps
placeIterationsRouter.get("/byIds/:ids", idChecker, getPlaceIterationsByIds);

// Fetches all iterations owned by a user, will be used in the future to allow editing without using the map editor
placeIterationsRouter.get("/userIterations/", idChecker, getPlaceIterationForUser);

// Fetches all iterations from a specific place, will be used in the future for statistics
placeIterationsRouter.get("/places/:ids", idChecker, getAllPlaceIterationsFromPlace);

// Reserved for the owning user or an admin, updates a place iteration's data in the database
placeIterationsRouter.put("/update", updatePlaceIterationById);

// Reserved for the owning user or an admin, removes a place iteration's data from the database
placeIterationsRouter.delete("/delete/:ids", idChecker, deletePlaceIterationById);

// For admins only, removes one or several place iterations' data from the database
placeIterationsRouter.delete("/deleteMany/:ids", idChecker, deletePlaceIterationsByIds);

export default placeIterationsRouter;
