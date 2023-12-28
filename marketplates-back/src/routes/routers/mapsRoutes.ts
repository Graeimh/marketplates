import { Router } from "express";
import { createMap, deleteMapById, deleteMapsByIds, getAllMaps, getAllMapsAvailable, getAllPublicMaps, getMapsByIds, getUserMaps, updateMapById } from "../../controllers/MapController.js";
import { idChecker } from "../../middlewares/idChecker.js";

const mapRouter = Router();

// Fetches all maps, will be used in the future for the admin dashboard
mapRouter.get("/", getAllMaps);

// Fetches all public maps, will be used in the future to create a search function to explore maps
mapRouter.get("/public", getAllPublicMaps);

// Fetches all maps available to the user, will be used in the future to create a feed
mapRouter.get("/available/:ids", idChecker, getAllMapsAvailable);

// Fetches one or a specific group of maps, serves to retrieve map data in the map editor
mapRouter.get("/byId/:ids", idChecker, getMapsByIds);

// Fetches all the maps owned by the user, serves for the MyMaps component
mapRouter.get("/byUser", getUserMaps);

// Allows to create a map along with custom map markers
mapRouter.post("/create", createMap);

// Reserved for the owning user or an admin, serves to update a map's data in the database
mapRouter.put("/update", updateMapById);

// Reserved for the owning user or an admin, serves to delete a map's data from the database
mapRouter.post("/delete", deleteMapById);

// For admins only, will serve to delete one or several maps from the database
mapRouter.post("/deleteMany", deleteMapsByIds);

export default mapRouter;
