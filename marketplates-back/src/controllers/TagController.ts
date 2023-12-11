import sanitizeHtml from "sanitize-html";
import TagsModel from "../models/Tags.js";
import { ITag } from "../types.js";


export async function createTag(req, res) {
    try {
        const tag: ITag = {
            backgroundColor: sanitizeHtml(req.body.formData.backgroundColor, { allowedTags: [] }),
            creatorId: req.body.creatorId,
            name: sanitizeHtml(req.body.formData.tagName, { allowedTags: [] }),
            nameColor: sanitizeHtml(req.body.formData.nameColor, { allowedTags: [] }),
            isOfficial: req.body.isOfficial,
        };

        await TagsModel.create(tag);

        res.status(201).json({
            message: '(201 Created)-Tag successfully created',
            success: true
        });
    } catch (err) {
        res.status(403).json({
            message: '(403 Forbidden)-The data sent created a tag-type conflict',
            success: false
        });
    };
}

export async function getAllTags(req, res) {
    try {
        const allTags = await TagsModel.find();
        res.status(200).json({
            data: allTags,
            message: '(200 OK)-Successfully fetched all tags',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No tag was found',
            success: false
        });
    }
}

export async function getAllOfficialTags(req, res) {
    try {
        const allOfficialTags = await TagsModel.find({ isOfficial: true });
        res.status(200).json({
            data: allOfficialTags,
            message: '(200 OK)-Successfully fetched all official tags',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No tag was found',
            success: false
        });
    }
}

export async function getUserSingleTags(req, res) {
    try {
        const allUserTags = await TagsModel.find({ $or: [{ creatorId: req.body.userId }, { isOfficial: true }] });
        res.status(200).json({
            data: allUserTags,
            message: '(200 OK)-Successfully fetched all the tags for this user',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No tag was found',
            success: false
        });
    }
}

export async function getCommonMapperTags(req, res) {
    //GET TAGS FROM THE USERS IN THE MAP
    try {
        const allParticipantTags = await TagsModel.find({ $or: [{ creatorId: req.body.userIdGroup }, { isOfficial: true }] });
        res.status(200).json({
            data: allParticipantTags,
            message: '(200 OK)-Successfully fetched all the tags for these users',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No tag was found',
            success: false
        });
    }
}

export async function getTagsByIds(req, res) {
    try {
        const tagsByIds = await TagsModel.find({ _id: { $in: req.params.ids.split("&") } });
        res.status(200).json({
            data: tagsByIds,
            message: '(200 OK)-Successfully fetched all the tags',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No tag matching was found',
            success: false
        });
    }
}

export async function updateTagById(req, res) {
    try {
        const tagById: ITag = await TagsModel.findOne({ _id: { $in: req.body.tagId } });

        const tagToUpdate = await TagsModel.updateOne({ _id: { $in: req.body.tagId } }, {
            backgroundColor: sanitizeHtml(req.body.backgroundColor, { allowedTags: [] }) ? sanitizeHtml(req.body.backgroundColor, { allowedTags: [] }) : tagById.backgroundColor,
            name: sanitizeHtml(req.body.tagName, { allowedTags: [] }) ? sanitizeHtml(req.body.tagName, { allowedTags: [] }) : tagById.name,
            nameColor: sanitizeHtml(req.body.nameColor, { allowedTags: [] }) ? sanitizeHtml(req.body.nameColor, { allowedTags: [] }) : tagById.nameColor,
        }
        );

        res.status(204).json({
            message: '(204 No Content)-Tag successfully updated',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-Tag to be updated was not found',
            success: false
        });
    }
}

export async function deleteTagById(req, res) {
    try {
        const tagToDelete = await TagsModel.deleteOne({ _id: { $in: req.body.tagId } });

        res.status(204).json({
            message: '(204 No Content)-Appliance successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-Appliance to be deleted was not found',
            success: false
        });
    }
}

export async function deleteTagsByIds(req, res) {
    try {
        const tagsToDelete = await TagsModel.deleteMany({ _id: { $in: req.body.tagIds } });

        res.status(204).json({
            message: '(204 No Content)-Tags successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-One or several tags to be deleted were not found',
            success: false
        });
    }
}
