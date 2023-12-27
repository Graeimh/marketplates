import sanitizeHtml from "sanitize-html";
import PlacesModel from "../models/Places.js";
import PlaceIterationsModel from "../models/PlaceIterations.js";
import { IPlaceIteration } from "../types/placeIterationTypes.js";

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

        res.status(201).json({
            message: '(201 Created)-Place iteration successfully created',
            success: true
        });
    } catch (err) {
        res.status(500).json({
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
        res.status(200).json({
            data: allPlacesIterations,
            message: '(200 OK)-Successfully fetched all iterations',
            success: true
        });
    } catch (err) {
        res.status(404).json({
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
        res.status(200).json({
            data: someIterations,
            message: '(200 OK)-Successfully fetched all iterations by Ids',
            success: true
        });
    } catch (err) {
        res.status(404).json({
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
        res.status(200).json({
            data: allPlacesIterationsFromPlace,
            message: '(200 OK)-Successfully fetched all iterations from the given place',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No iteration was found for the given place',
            success: false
        });
    }
}

/**
   * Fetches all place iterations from a given owner
   *
   *
   * @param req - The request object associated with the route parameters, specifically the single id contained in the ids from the params property
   * @param res - The response object associated with the route
   * 
   * @catches - If no place iteration is found (404)
   * @responds - With an array of all the place iterations matching the given owner Id in the database (200)
*/
export async function getPlaceIterationForUser(req, res) {
    try {
        const allPlacesIterationsForUser = await PlaceIterationsModel.find({ creatorId: req.params.ids });
        res.status(200).json({
            data: allPlacesIterationsForUser,
            message: '(200 OK)-Successfully fetched all place iterations for the given user',
            success: true
        });
    } catch (err) {
        res.status(404).json({
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

        if (!placeIterationById) {
            res.status(400).json({
                message: '(404 Not Found)-The place iteration to update was not found',
                success: false
            });
        }

        // Updating the place iteration's data following the IPlaceIteration interface
        await PlaceIterationsModel.updateOne({ _id: { $in: req.body.placeIterationId } }, {
            customName: req.body.customName ? sanitizeHtml(req.body.customName, { allowedTags: [] }) : placeIterationById.customName,
            customDescription: req.body.customDescription ? sanitizeHtml(req.body.customDescription, { allowedTags: [] }) : placeIterationById.customDescription,
            customTagIds: req.body.customTagIds ? req.body.customTagIds : placeIterationById.customTagIds,

        })

        res.status(204).json({
            message: '(204 No Content)-Place iteration successfully updated',
            success: true
        });

    } catch (err) {
        res.status(500).json({
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
        await PlaceIterationsModel.deleteMany({ _id: { $in: req.body.iterationId } });

        res.status(204).json({
            message: '(204 No Content)-Iteration successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
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
        await PlaceIterationsModel.deleteMany({ _id: { $in: req.body.iterationIds } });

        res.status(204).json({
            message: '(204 No Content)-Place iterations successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-One or several place iterations to be deleted were not found',
            success: false
        });
    }
}