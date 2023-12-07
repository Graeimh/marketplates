import { Router } from "express";
import { getAllTags, getTagsByIds, getAllOfficialTags, getUserSingleTags, getCommonMapperTags, createTag, updateTagById, deleteTagById, deleteTagsByIds } from "../controllers/TagController.js";


const tagRouter = Router();

tagRouter.get("/", getAllTags);
tagRouter.get("/:ids", getTagsByIds);
tagRouter.get("/officialIds", getAllOfficialTags);
tagRouter.get("/:userId", getUserSingleTags);
tagRouter.get("/:userIds", getCommonMapperTags);
tagRouter.post("/create", createTag);
tagRouter.post("/update", updateTagById);
tagRouter.post("/delete", deleteTagById);
tagRouter.post("/deleteMany", deleteTagsByIds);



export default tagRouter;
