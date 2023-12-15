import { Router } from "express";
import { createUser, deleteUserById, deleteUsersByIds, getAllUsers, getUsersById, updateUserById } from "../controllers/UserController.js"

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
usersRouter.post("/create", createUser);
usersRouter.get("/:ids", getUsersById);
usersRouter.post("/update", updateUserById);
usersRouter.post("/delete", deleteUserById);
usersRouter.post("/deleteMany", deleteUsersByIds);

export default usersRouter;
