import sanitizeHtml from "sanitize-html";
import PlacesModel from "../models/Places.js";
import jwt from "jsonwebtoken"
import { IPlace } from "../types/placeTypes.js";


export async function createPlace(req, res) {
    try {
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        const preExistingPlace = await PlacesModel.find({ name: sanitizeHtml(req.body.name, { allowedTags: [] }) });

        if (preExistingPlace.length > 0) {
            res.status(400).json({
                message: '(400 Bad Request)-A place named like this already exists',
                success: false
            });
        }

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

//PUT FILTERING IN PLACE
export async function getAllPlaces(req, res) {
    try {
        const allPlaces = await PlacesModel.find();
        res.json({
            data: allPlaces,
            message: '(200 OK)-Successfully fetched all places',
            success: true
        });
    } catch (err) {
        res.json({
            message: '(404 Not found)-No place was found',
            success: false
        });
    }
}

export async function getPlacesByIds(req, res) {
    try {
        const somePlaces = await PlacesModel.find({ _id: { $in: req.params.ids.split("&") } });
        res.json({
            data: somePlaces,
            message: '(200 OK)-Successfully fetched all places by Ids',
            success: true
        });
    } catch (err) {
        res.json({
            message: '(404 Not found)-No places were found',
            success: false
        });
    }
}


export async function getPlacesForUser(req, res) {
    try {
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        const somePlaces = await PlacesModel.find({ owner_id: { $in: decryptedCookie.userId } });
        res.json({
            data: somePlaces,
            message: '(200 OK)-Successfully fetched all places for user',
            success: true
        });
    } catch (err) {
        res.json({
            message: '(404 Not found)-No places were found belonging to this user',
            success: false
        });
    }
}



export async function updatePlaceById(req, res) {
    try {
        const placeById: IPlace = await PlacesModel.findOne({ _id: { $in: req.body.placeId } });

        if (!placeById) {
            res.status(400).json({
                message: '(404 Not Found)-The place to update was not found',
                success: false
            });
        }

        const placeToUpdate = await PlacesModel.updateOne({ _id: { $in: req.body.placeId } }, {
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

export async function deletePlacesByIds(req, res) {
    try {
        const placesToDelete = await PlacesModel.deleteMany({ _id: { $in: req.body.placeIds } });

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
