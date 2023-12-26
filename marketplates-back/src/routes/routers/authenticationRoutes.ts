import { Router } from "express";
import { login, checkSessionStatus, logout, produceNewAccessToken } from "../../controllers/AutenthicationController.js"
import { checkCaptcha } from "../../middlewares/checkCaptcha.js";
import { checkAccessToken } from "../../middlewares/checkAccessToken.js";

const authenticationRouter = Router();

authenticationRouter.post("/login", checkCaptcha, login);
authenticationRouter.post('/logout', logout);
authenticationRouter.get('/checkSession', checkAccessToken, checkSessionStatus);
authenticationRouter.post('/accessToken', produceNewAccessToken)

export default authenticationRouter;
