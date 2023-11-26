import { Router } from "express";
import { checkToken } from "../middlewares/checkToken.js";
import { login } from "../controllers/AuthicationController.js"

const authenticationRouter = Router();

authenticationRouter.post("/login", login);


export default authenticationRouter;
