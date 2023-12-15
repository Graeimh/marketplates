import { Router } from "express";
import { getAllTags, getTagsByIds, getAllOfficialTags, getUserSingleTags, getCommonMapperTags, createTag, updateTagById, deleteTagById, deleteTagsByIds } from "../controllers/TagController.js";


const tagRouter = Router();

tagRouter.get("/", getAllTags);
tagRouter.get("/byId/:ids", getTagsByIds);
tagRouter.get("/officialIds", getAllOfficialTags);
tagRouter.get("/userTags", getUserSingleTags);
tagRouter.get("/mapperTags/:userIds", getCommonMapperTags);
tagRouter.post("/create", createTag);
tagRouter.post("/update", updateTagById);
tagRouter.post("/delete", deleteTagById);
tagRouter.post("/deleteMany", deleteTagsByIds);

export default tagRouter;
