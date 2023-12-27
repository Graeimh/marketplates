import sanitizeHtml from "sanitize-html";
import PlacesModel from "../models/Places.js";
import jwt from "jsonwebtoken"
import { IPlace } from "../types/placeTypes.js";

/**
   * Creates a place
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData held within the body
   * @param res - The response object associated with the route
   * 
   * @catches - If a place has the same name (400), if the place could not be created due to a problem with data (403)
   * @responds - By informing the user the place has been created (201)
*/
export async function createPlace(req, res) {
    try {
        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        // Check if a place with the same name doesn't already exist
        const preExistingPlace = await PlacesModel.find({ name: sanitizeHtml(req.body.formData.name, { allowedTags: [] }) });

        if (preExistingPlace.length > 0) {
            res.status(400).json({
                message: '(400 Bad Request)-A place named like this already exists',
                success: false
            });
        }

        // Creating a place variable according to the IPlace interface
        const place: IPlace = {
            address: sanitizeHtml(req.body.formData.address, { allowedTags: [] }),
            description: sanitizeHtml(req.body.formData.description, { allowedTags: [] }),
            gpsCoordinates: {
                longitude: req.body.formData.gpsCoordinates.longitude,
                latitude: req.body.formData.gpsCoordinates.latitude,
            },
            name: sanitizeHtml(req.body.formData.name, { allowedTags: [] }),
            owner_id: decryptedCookie.userId,
            tagsList: req.body.formData.tagList.map(tag => tag._id),
        };

        // Creating the place within the database
        await PlacesModel.create(place);

        res.status(201).json({
            message: '(201 Created)-Place successfully created',
            success: true
        });
    } catch (err) {
        res.status(403).json({
            message: '(403 Forbidden)-The data sent created a place-type conflict',
            success: false
        });
    };
}


/**
   * Fetches all places
   *
   *
   * @param req - The request object associated with the route parameters, not used here
   * @param res - The response object associated with the route
   * 
   * @catches - If no place was found (404)
   * @responds -  With an array of all the places in the database (200)
*/
export async function getAllPlaces(req, res) {
    try {
        const allPlaces = await PlacesModel.find();
        res.status(200).json({
            data: allPlaces,
            message: '(200 OK)-Successfully fetched all places',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No place was found',
            success: false
        });
    }
}

/**
   * Fetches one or several places using their Ids
   *
   *
   * @param req - The request object associated with the route parameters,  specifically the Ids in the params
   * @param res - The response object associated with the route
   * 
   * @catches - If no place was found (404)
   * @responds -  With an array of all the places whose Id matches one of those given (200)
*/
export async function getPlacesByIds(req, res) {
    try {
        const somePlaces = await PlacesModel.find({ _id: { $in: req.params.ids.split("&") } });
        res.status(200).json({
            data: somePlaces,
            message: '(200 OK)-Successfully fetched all places by Ids',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No places were found',
            success: false
        });
    }
}

/**
   * Fetches the places owned by a logged user
   *
   *
   * @param req - The request object associated with the route parameters,  specifically the Ids in the params
   * @param res - The response object associated with the route
   * 
   * @catches - If no place was found (404)
   * @responds -  With an array of all the places whose Id matches one of those given (200)
*/
export async function getPlacesForUser(req, res) {
    try {
        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        const somePlaces = await PlacesModel.find({ owner_id: { $in: decryptedCookie.userId } });
        res.status(200).json({
            data: somePlaces,
            message: '(200 OK)-Successfully fetched all places for user',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No places were found belonging to this user',
            success: false
        });
    }
}



/**
   * Updates a place's data
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData in the body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no place was found (404) or if the route was not found or the place could not be updated (500)
   * @responds -  With an array of all the places whose Id matches one of those given (200)
*/
export async function updatePlaceById(req, res) {
    try {
        // Finding the matching place
        const placeById: IPlace = await PlacesModel.findOne({ _id: { $in: req.body.placeId } });

        // Checking if the matching place exists
        if (!placeById) {
            res.status(400).json({
                message: '(404 Not Found)-The place to update was not found',
                success: false
            });
        }

        // Updating the matching place whilst following the IPlace interface and sanitizing any http text input given
        await PlacesModel.updateOne({ _id: { $in: req.body.placeId } }, {
            address: sanitizeHtml(req.body.formData.address, { allowedTags: [] }) ? sanitizeHtml(req.body.formData.address, { allowedTags: [] }) : placeById.address,
            description: sanitizeHtml(req.body.formData.description, { allowedTags: [] }) ? sanitizeHtml(req.body.formData.description, { allowedTags: [] }) : placeById.description,
            gpsCoordinates: {
                longitude: req.body.formData.gpsCoordinates.longitude ? req.body.formData.gpsCoordinates.longitude : placeById.gpsCoordinates.longitude,
                latitude: req.body.formData.gpsCoordinates.latitude ? req.body.formData.gpsCoordinates.latitude : placeById.gpsCoordinates.latitude,
            },
            name: sanitizeHtml(req.body.formData.name, { allowedTags: [] }) ? sanitizeHtml(req.body.formData.name, { allowedTags: [] }) : placeById.name,
            tagsList: req.body.formData.tagList.map(tag => tag._id),
        });

        res.status(204).json({
            message: '(204 No Content)-Place successfully updated',
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
   * Deletes a place's data from the database
   *
   *
   * @param req - The request object associated with the route parameters, specifically the placeId in the body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no place was found (404)
   * @responds -  With a message informing the user the deletion has been carried out (204)
*/
export async function deletePlaceById(req, res) {
    try {
        const placeToDelete = await PlacesModel.deleteOne({ _id: { $in: req.body.placeId } });

        res.status(204).json({
            message: '(204 No Content)-Place successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-Place to be deleted was not found',
            success: false
        });
    }
}

/**
   * Deletes a specific set of places from the database
   *
   *
   * @param req - The request object associated with the route parameters, especially the placeIds in the body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no place was found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deletePlacesByIds(req, res) {
    try {
        await PlacesModel.deleteMany({ _id: { $in: req.body.placeIds } });

        res.status(204).json({
            message: '(204 No Content)-Places successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-One or several places to be deleted were not found',
            success: false
        });
    }
}
