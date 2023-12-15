import { Router } from "express";
import { createAppliance, getAppliances, getAppliancesByIds, updateApplianceById, deleteApplianceById, deleteAppliancesByIds } from "../controllers/ApplianceController.js";

const appliancesRouter = Router();

appliancesRouter.get("/", getAppliances);
appliancesRouter.get("/:ids", getAppliancesByIds);
appliancesRouter.post("/create", createAppliance);
appliancesRouter.post("/update", updateApplianceById);
appliancesRouter.post("/delete", deleteApplianceById);
appliancesRouter.post("/deleteMany", deleteAppliancesByIds);

export default appliancesRouter;
