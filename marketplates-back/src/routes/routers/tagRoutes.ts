import { Router } from "express";
import { getAllTags, getTagsByIds, getAllOfficialTags, getUserSingleTags, getCommonMapperTags, createTag, updateTagById, deleteTagById, deleteTagsByIds } from "../../controllers/TagController.js";
import { idChecker } from "../../middlewares/idChecker.js";


const tagRouter = Router();

// Fetches all tags, used for place creation and admin dashboard
tagRouter.get("/", getAllTags);

// Fetches data for a particular group of tags, used to give data to specific places and iterations
tagRouter.get("/byId/:ids", idChecker, getTagsByIds);

// Fetches only the tags created by admins
tagRouter.get("/officialIds", getAllOfficialTags);

// Fetches only the tags created by users
tagRouter.get("/userTags", getUserSingleTags);

// Fetches all the tags, custom or official used by a map's participants 
tagRouter.get("/mapperTags/:ids", idChecker, getCommonMapperTags);

// Allows to create a tag, it will only be official if created by an admin
tagRouter.post("/create", createTag);

// Reserved for the owning user or an admin, serves to update a tag in the database
tagRouter.put("/update", updateTagById);

// Reserved for the owning user or an admin, serves to delete a single tag from the database
tagRouter.post("/delete", deleteTagById);

// For admins only, serves to delete one or several tags from the database
tagRouter.post("/deleteMany", deleteTagsByIds);

export default tagRouter;
