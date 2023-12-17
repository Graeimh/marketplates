import { Router } from "express";
import { login, checkSessionStatus, checkIfActive, logout, produceNewAccessToken } from "../controllers/AutenthicationController.js"
import { checkCaptcha } from "../middlewares/checkCaptcha.js";
import { checkAccessToken } from "../middlewares/checkAccessToken.js";

const authenticationRouter = Router();

authenticationRouter.post("/login", checkCaptcha, login);
authenticationRouter.post('/logout', logout);
authenticationRouter.get('/checkSession', checkAccessToken, checkSessionStatus);
authenticationRouter.post('/tester', checkAccessToken, checkIfActive);
authenticationRouter.post('/accessToken', produceNewAccessToken)


export default authenticationRouter;
