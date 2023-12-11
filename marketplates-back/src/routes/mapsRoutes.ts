import { Router } from "express";
import { createMap, deleteMapById, deleteMapsByIds, getAllMaps, getAllMapsAvailable, getAllPublicMaps, getMapsByIds, updateMapById } from "../controllers/MapController.js";


const mapRouter = Router();

mapRouter.get("/", getAllMaps);
mapRouter.get("/public", getAllPublicMaps);
mapRouter.get("/available/:userId", getAllMapsAvailable);
mapRouter.get("/:ids", getMapsByIds);
mapRouter.post("/create", createMap);
mapRouter.post("/update", updateMapById);
mapRouter.post("/delete", deleteMapById);
mapRouter.post("/deleteMany", deleteMapsByIds);

export default mapRouter;
