import { Router } from "express";
import { generateCSRFToken } from "../controllers/SecurityController.js";

const securityRouter = Router();

securityRouter.get("/csrfGeneration", generateCSRFToken);

export default securityRouter;
