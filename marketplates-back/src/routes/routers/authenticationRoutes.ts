import { Router } from "express";
import { login, checkSessionStatus, logout, produceNewAccessToken } from "../../controllers/AutenthicationController.js"
import { checkCaptcha } from "../../middlewares/checkCaptcha.js";
import { checkAccessToken } from "../../middlewares/checkAccessToken.js";

const authenticationRouter = Router();

// Allows for users to login provided they clicked on the captcha
authenticationRouter.post("/login", checkCaptcha, login);

// Allows for a user to log out from a location
authenticationRouter.post('/logout', logout);

// Serves to obtain a session's data and give it back to the front end
authenticationRouter.get('/checkSession', checkAccessToken, checkSessionStatus);

// Serves to provide a new access token to a user with a valid refresh token
authenticationRouter.post('/accessToken', produceNewAccessToken)

export default authenticationRouter;
