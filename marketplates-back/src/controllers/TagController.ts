import sanitizeHtml from "sanitize-html";
import TagsModel from "../models/Tags.js";
import jwt from "jsonwebtoken"
import { ITag } from "../common/types/tagTypes.js";
import checkOwnership from "../common/functions/checkOwnership.js";

/**
   * Creates a tag
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData held within the body
   * @param res - The response object associated with the route
   * 
   * @catches - If the data provided causes an error in the creation of the tag (403)
   * @responds - By informing the user the tag has been created (201)
*/

export async function createTag(req, res) {

    try {
        // Creating the tag according to the ITag interface, sanitizing every text input given using sanitizeHtml
        const tag: ITag = {
            backgroundColor: sanitizeHtml(req.body.formData.tagBackgroundColor, { allowedTags: [] }),
            creatorId: req.body.userId,
            name: sanitizeHtml(req.body.formData.tagName, { allowedTags: [] }),
            nameColor: sanitizeHtml(req.body.formData.tagNameColor, { allowedTags: [] }),
            isOfficial: req.body.formData.isOfficial ? req.body.formData.isOfficial : false,
        };
        await TagsModel.create(tag);

        return res.status(201).json({
            message: '(201 Created)-Tag successfully created',
            success: true
        });
    } catch (err) {
        return res.status(403).json({
            message: '(403 Forbidden)-The data sent created a tag-type conflict',
            success: false
        });
    };
}

/**
   * Fetches all tags
   *
   *
   * @param req - The request object associated with the route parameters, not used here
   * @param res - The response object associated with the route
   * 
   * @catches - If no tag is found (404)
   * @responds - With an array of all the tags in the database (200)
*/
export async function getAllTags(req, res) {
    try {
        const allTags = await TagsModel.find();
        return res.status(200).json({
            data: allTags,
            message: '(200 OK)-Successfully fetched all tags',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No tag was found',
            success: false
        });
    }
}

/**
   * Fetches all tags whose isOfficial value is true
   *
   *
   * @param req - The request object associated with the route parameters, not used here
   * @param res - The response object associated with the route
   * 
   * @catches - If no tag is found (404)
   * @responds - With an array of all the official tags in the database (200)
*/
export async function getAllOfficialTags(req, res) {
    try {
        const allOfficialTags = await TagsModel.find({ isOfficial: true });
        return res.status(200).json({
            data: allOfficialTags,
            message: '(200 OK)-Successfully fetched all official tags',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No tag was found',
            success: false
        });
    }
}

/**
   * Fetches all tags who are either official or belonging to a user
   *
   *
   * @param req - The request object associated with the route parameters, not used here
   * @param res - The response object associated with the route
   * 
   * @catches - If no tag is found (404)
   * @responds - With an array of all the matching tags in the database (200)
*/
export async function getUserSingleTags(req, res) {
    try {
        // Get access token from the front end and the key that serves to create and verify them
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookieValue = jwt.verify(req.cookies.token, LOG_TOKEN_KEY);

        const allUserTags = await TagsModel.find({ $or: [{ creatorId: decryptedCookieValue.userId }, { isOfficial: true }] });
        return res.status(200).json({
            data: allUserTags,
            message: '(200 OK)-Successfully fetched all the tags for this user',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No tag was found',
            success: false
        });
    }
}

/**
   * Fetches all tags who are either official or belonging to a tag creator whose id matches
   *
   *
   * @param req - The request object associated with the route parameters, specifically the Ids within the parameter property
   * @param res - The response object associated with the route
   * 
   * @catches - If no tag is found (404)
   * @responds - With an array of all the matching tags in the database (200)
*/
export async function getCommonMapperTags(req, res) {
    try {
        // Ids, when sent in groups are sent in a single string, each Id tied to the others by a & character, hence the need for a split on that character
        const allParticipantTags = await TagsModel.find({ $or: [{ creatorId: { $in: req.params.ids.split("&") } }, { isOfficial: true }] });
        return res.status(200).json({
            data: allParticipantTags,
            message: '(200 OK)-Successfully fetched all the tags for these users',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No tag was found',
            success: false
        });
    }
}

/**
   * Fetches all tags whose Ids match the ones given
   *
   *
   * @param req - The request object associated with the route parameters, specifically the Ids within the parameter property
   * @param res - The response object associated with the route
   * 
   * @catches - If no tag is found (404)
   * @responds - With an array of all the matching tags in the database (200)
*/
export async function getTagsByIds(req, res) {
    try {
        // Ids, when sent in groups are sent in a single string, each Id tied to the others by a & character, hence the need for a split on that character
        const tagsByIds = await TagsModel.find({ _id: { $in: req.params.ids.split("&") } });
        return res.status(200).json({
            data: tagsByIds,
            message: '(200 OK)-Successfully fetched all the tags',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No tag matching was found',
            success: false
        });
    }
}

/**
   * Updates a tag's data in the database
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData held within the body
   * @param res - The response object associated with the route
   * 
   * @catches - If the tag to update was not found (404)
   * @responds - With a message informing the user the update is done (204)
*/
export async function updateTagById(req, res) {
    try {
        // Find the tag to update
        const tagById: ITag = await TagsModel.findOne({ _id: { $in: req.body.tagId } });

        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        if (checkOwnership(tagById.creatorId, decryptedCookie.userId, decryptedCookie.status)) {
            // Updating the tag according to the ITag interface, sanitizing every text input given using sanitizeHtml, keeping the old values if no new one is given
            await TagsModel.updateOne({ _id: { $in: req.body.tagId } }, {
                backgroundColor: sanitizeHtml(req.body.formData.tagBackgroundColor, { allowedTags: [] }) ? sanitizeHtml(req.body.formData.tagBackgroundColor, { allowedTags: [] }) : tagById.backgroundColor,
                name: sanitizeHtml(req.body.formData.tagName, { allowedTags: [] }) ? sanitizeHtml(req.body.formData.tagName, { allowedTags: [] }) : tagById.name,
                nameColor: sanitizeHtml(req.body.formData.tagNameColor, { allowedTags: [] }) ? sanitizeHtml(req.body.formData.tagNameColor, { allowedTags: [] }) : tagById.nameColor,
            }
            );

            return res.status(204).json({
                message: '(204 No Content)-Tag successfully updated',
                success: true
            });
        } else {
            return res.status(403).json({
                message: '(403 Forbidden)-The tag does not belong to the user and will not be updated',
                success: false
            });
        }

    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-Tag to be updated was not found',
            success: false
        });
    }
}

/**
   * Deletes a tag
   *
   *
   * @param req - The request object associated with the route parameters, especially its body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no tag is found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deleteTagById(req, res) {
    try {
        // Find the tag to update
        const tagById: ITag = await TagsModel.findOne({ _id: { $in: req.body.tagId } });

        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        if (checkOwnership(tagById.creatorId, decryptedCookie.userId, decryptedCookie.status)) {

            await TagsModel.deleteOne({ _id: { $in: req.body.tagId } });

            return res.status(204).json({
                message: '(204 No Content)-Appliance successfully deleted',
                success: true
            });
        } else {
            return res.status(403).json({
                message: '(403 Forbidden)-The tag does not belong to the user and will not be deleted',
                success: false
            });
        }

    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-Appliance to be deleted was not found',
            success: false
        });
    }
}

/**
   * Deletes a specific set of tags
   *
   *
   * @param req - The request object associated with the route parameters, especially its body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no tag is found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deleteTagsByIds(req, res) {
    try {
        // Finding the matching tags
        const tagsByIds: ITag[] = await TagsModel.find({ _id: { $in: req.body.tagIds } });

        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        for (const tag of tagsByIds) {
            if (!checkOwnership(tag.creatorId, decryptedCookie.userId, decryptedCookie.status)) {
                return res.status(403).json({
                    message: '(403 Forbidden)-One of tags to be deleted does not belong to the user.',
                    success: false
                });
            }
        }

        await TagsModel.deleteMany({ _id: { $in: req.body.tagIds } });

        return res.status(204).json({
            message: '(204 No Content)-Tags successfully deleted',
            success: true
        });

    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-One or several tags to be deleted were not found',
            success: false
        });
    }
}
