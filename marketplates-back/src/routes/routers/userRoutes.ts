import { Router } from "express";
import { createUser, deleteUserById, deleteUsersByIds, getAllUsers, getUsersById, updateUserById } from "../../controllers/UserController.js"
import { checkAccessToken } from "../../middlewares/checkAccessToken.js";
import { idChecker } from "../../middlewares/idChecker.js";

const usersRouter = Router();

// Fetches all users for the admin dashboard
usersRouter.get("/", checkAccessToken, getAllUsers);

// Allows for user registration
usersRouter.post("/create", createUser);

// Fetches a single user's data or, in the future seveal users by ids for map interactions
usersRouter.get("/byId/:ids", checkAccessToken, idChecker, getUsersById);

// Updates a user's data
usersRouter.post("/update", checkAccessToken, updateUserById);

// Reserved for the owning user or an admin, serves to delete a user from the database
usersRouter.post("/delete", checkAccessToken, deleteUserById);

// For admins only, allows admins to delete one or several users from the database
usersRouter.post("/deleteMany", checkAccessToken, deleteUsersByIds);

export default usersRouter;
