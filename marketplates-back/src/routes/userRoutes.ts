import { Router } from "express";
import { checkToken } from "../middlewares/checkToken.js";
import { createUser } from "../controllers/UserController.js"

const usersRouter = Router();

// usersRouter.get("/", getAppliances);
// usersRouter.get("/:ids", getAppliancesByIds);
usersRouter.post("/create", createUser);
// usersRouter.post("/update", updateApplianceById);
// usersRouter.post("/delete", deleteApplianceById);
// usersRouter.post("/deleteMany", deleteAppliancesByIds);

export default usersRouter;
