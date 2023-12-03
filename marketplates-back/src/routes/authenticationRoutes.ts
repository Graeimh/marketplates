import { Router } from "express";
import { checkToken } from "../middlewares/checkToken.js";
import { login, checkSessionStatus, checkIfActive } from "../controllers/AutenthicationController.js"
import { csrfTokenChecker } from "../middlewares/csrfTokenChecker.js";
import { checkCaptcha } from "../middlewares/checkCaptcha.js";

const authenticationRouter = Router();

authenticationRouter.post("/login", checkCaptcha, login);
authenticationRouter.get('/checkSession', checkSessionStatus);
authenticationRouter.post('/tester', csrfTokenChecker, checkIfActive);

export default authenticationRouter;
