import { Router } from "express";
import { createUser, deleteUserById, deleteUsersByIds, getAllUsers, getUsersById, updateUserById } from "../../controllers/UserController.js"
import { checkAccessToken } from "../../middlewares/checkAccessToken.js";
import { idChecker } from "../../middlewares/idChecker.js";

const usersRouter = Router();

usersRouter.get("/", checkAccessToken, getAllUsers);
usersRouter.post("/create", createUser);
usersRouter.get("/byId/:ids", checkAccessToken, idChecker, getUsersById);
usersRouter.post("/update", checkAccessToken, updateUserById);
usersRouter.post("/delete", checkAccessToken, deleteUserById);
usersRouter.post("/deleteMany", checkAccessToken, deleteUsersByIds);

export default usersRouter;
