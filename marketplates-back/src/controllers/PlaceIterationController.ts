import sanitizeHtml from "sanitize-html";
import PlacesModel from "../models/Places.js";
import jwt from "jsonwebtoken";
import PlaceIterationsModel from "../models/PlaceIterations.js";
import { IPlaceIteration } from "../common/types/placeIterationTypes.js";
import checkOwnership from "../common/functions/checkOwnership.js";

/**
   * Creates a place iteration associated with a place
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData held within the body
   * @param res - The response object associated with the route
   * 
   * @catches - If the place the iteration is created for couldn't be found (404), if the place could not be created due to a problem with data (500)
   * @responds - By informing the user the place iteration has been created (201)
*/
export async function createPlaceIterationById(req, res) {
    try {
        // Find the matching place
        const placeToIterateUpon = await PlacesModel.findOne({ _id: req.body.originalPlaceId });

        if (!placeToIterateUpon) {
            res.status(400).json({
                message: '(404 Not Found)-The place to iterate upon was not found',
                success: false
            });
        }

        // Creating the place iteration according to the IPlaceIteration interface, sanitizing every text input given using sanitizeHtml
        const iteration: IPlaceIteration = {
            associatedMapIds: [],
            creatorId: req.body.formData.userId,
            customName: req.body.formData.customName ? sanitizeHtml(req.body.formData.customName, { allowedTags: [] }) : placeToIterateUpon.name,
            customDescription: req.body.formData.customDescription ? sanitizeHtml(req.body.formData.customDescription, { allowedTags: [] }) : placeToIterateUpon.description,
            customTagIds: placeToIterateUpon.tagsList,
            gpsCoordinates: { longitude: req.body.formData.longitude, latitude: req.body.formData.latitude },
            placeId: placeToIterateUpon._id,
        }

        await PlaceIterationsModel.create(iteration);

        return res.status(201).json({
            message: '(201 Created)-Place iteration successfully created',
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false
        });
    }
}

/**
   * Fetches all place iterations
   *
   *
   * @param req - The request object associated with the route parameters, not used here
   * @param res - The response object associated with the route
   * 
   * @catches - If no place iteration is found (404)
   * @responds - With an array of all the place iterations in the database (200)
*/
export async function getAllPlaceIterations(req, res) {
    try {
        const allPlacesIterations = await PlaceIterationsModel.find();
        return res.status(200).json({
            data: allPlacesIterations,
            message: '(200 OK)-Successfully fetched all iterations',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No iteration was found',
            success: false
        });
    }
}

/**
   * Fetches all place iterations matching the given Ids
   *
   *
   * @param req - The request object associated with the route parameters, specifically the ids contained in the params property
   * @param res - The response object associated with the route
   * 
   * @catches - If no place iteration is found (404)
   * @responds - With an array of all the place iterations matching the given Ids in the database (200)
*/
export async function getPlaceIterationsByIds(req, res) {
    try {
        // Ids, when sent in groups are sent in a single string, each Id tied to the others by a & character, hence the need for a split on that character
        const someIterations = await PlaceIterationsModel.find({ _id: { $in: req.params.ids.split("&") } });
        return res.status(200).json({
            data: someIterations,
            message: '(200 OK)-Successfully fetched all iterations by Ids',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No iterations were found',
            success: false
        });
    }
}

/**
   * Fetches all place iterations matching the given place Id
   *
   *
   * @param req - The request object associated with the route parameters, specifically the single id contained in the ids from the params property
   * @param res - The response object associated with the route
   * 
   * @catches - If no place iteration is found (404)
   * @responds - With an array of all the place iterations matching the given place Id in the database (200)
*/
export async function getAllPlaceIterationsFromPlace(req, res) {
    try {
        const allPlacesIterationsFromPlace = await PlaceIterationsModel.find({ placeId: req.params.ids });
        return res.status(200).json({
            data: allPlacesIterationsFromPlace,
            message: '(200 OK)-Successfully fetched all iterations from the given place',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No iteration was found for the given place',
            success: false
        });
    }
}

/**
   * Fetches all place iterations from a given owner
   *
   *
   * @param req - The request object associated with the route parameters
   * @param res - The response object associated with the route
   * 
   * @catches - If no place iteration is found (404)
   * @responds - With an array of all the place iterations matching the given owner Id in the database (200)
*/
export async function getPlaceIterationForUser(req, res) {
    try {
        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        const allPlacesIterationsForUser = await PlaceIterationsModel.find({ creatorId: decryptedCookie.userId });
        return res.status(200).json({
            data: allPlacesIterationsForUser,
            message: '(200 OK)-Successfully fetched all place iterations for the given user',
            success: true
        });
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-No place iteration was found for the given user',
            success: false
        });
    }
}

/**
   * Updates a place iteration's data
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData within the body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no place iteration is found (404) or the iteration could not be updated (500)
   * @responds - With a message informing the user the update is done (204)
*/
export async function updatePlaceIterationById(req, res) {
    try {
        // Find the matching place iteration
        const placeIterationById: IPlaceIteration = await PlaceIterationsModel.findOne({ _id: { $in: req.body.placeIterationId } });

        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        if (!placeIterationById) {
            return res.status(400).json({
                message: '(404 Not Found)-The place iteration to update was not found',
                success: false
            });
        }

        if (checkOwnership(placeIterationById.creatorId, decryptedCookie.userId, decryptedCookie.status)) {
            // Updating the place iteration's data following the IPlaceIteration interface
            await PlaceIterationsModel.updateOne({ _id: { $in: req.body.placeIterationId } }, {
                customName: req.body.formData.customName ? sanitizeHtml(req.body.formData.customName, { allowedTags: [] }) : placeIterationById.customName,
                customDescription: req.body.formData.customDescription ? sanitizeHtml(req.body.formData.customDescription, { allowedTags: [] }) : placeIterationById.customDescription,
                customTagIds: req.body.formData.customTagIds ? req.body.formData.customTagIds : placeIterationById.customTagIds,

            })

            return res.status(204).json({
                message: '(204 No Content)-Place iteration successfully updated',
                success: true
            });
        } else {
            return res.status(403).json({
                message: '(403 Forbidden)-The user is not the owner of the iteration, or an admin and thus cannot update its data',
                success: false
            });
        }

    } catch (err) {
        return res.status(500).json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false
        });
    }
}



/**
   * Deletes a place iteration
   *
   *
   * @param req - The request object associated with the route parameters, especially its body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no iteration is found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deletePlaceIterationById(req, res) {
    try {
        // Find the matching place iteration
        const placeIterationById: IPlaceIteration = await PlaceIterationsModel.findOne({ _id: { $in: req.params.ids } });

        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        if (checkOwnership(placeIterationById.creatorId, decryptedCookie.userId, decryptedCookie.status)) {
            await PlaceIterationsModel.deleteMany({ _id: { $in: req.params.ids } });

            return res.status(204).json({
                message: '(204 No Content)-Iteration successfully deleted',
                success: true
            });
        } else {
            return res.status(403).json({
                message: '(403 Forbidden)-The user is not the owner of the iteration, or an admin and thus cannot delete it',
                success: false
            })
        }
    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-Iteration to be deleted was not found',
            success: false
        });
    }
}

/**
   * Deletes a set of place iterations
   *
   *
   * @param req - The request object associated with the route parameters, especially its body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no iteration is found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deletePlaceIterationsByIds(req, res) {
    try {
        // Finding the matching place iterations
        const placeIterationsByIds: IPlaceIteration[] = await PlaceIterationsModel.find({ _id: { $in: req.params.ids.split("&") } });

        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        for (const placeIteration of placeIterationsByIds) {
            if (!checkOwnership(placeIteration.creatorId, decryptedCookie.userId, decryptedCookie.status)) {
                return res.status(403).json({
                    message: '(403 Forbidden)-One of place iterations to be deleted does not belong to the user.',
                    success: false
                });
            }
        }

        await PlaceIterationsModel.deleteMany({ _id: { $in: req.params.ids.split("&") } });

        return res.status(204).json({
            message: '(204 No Content)-Place iterations successfully deleted',
            success: true
        });

    } catch (err) {
        return res.status(404).json({
            message: '(404 Not found)-One or several place iterations to be deleted were not found',
            success: false
        });
    }
}