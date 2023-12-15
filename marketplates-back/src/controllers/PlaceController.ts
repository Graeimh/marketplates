import sanitizeHtml from "sanitize-html";
import TagsModel from "../models/Tags.js";
import { IPlace, IPlaceIteration } from "../types.js";
import PlacesModel from "../models/Places.js";
import PlaceIterationsModel from "../models/PlaceIterations.js";


export async function createPlace(req, res) {
    try {
        const preExistingPlace = await PlacesModel.find({ name: sanitizeHtml(req.body.name, { allowedTags: [] }) });

        if (preExistingPlace.length > 0) {
            res.status(400).json({
                message: '(400 Bad Request)-A place named like this already exists',
                success: false
            });
        }

        const place: IPlace = {
            name: sanitizeHtml(req.body.name, { allowedTags: [] }),
            description: sanitizeHtml(req.body.description, { allowedTags: [] }),
            location: {
                streetAddress: sanitizeHtml(req.body.streetAddress, { allowedTags: [] }),
                county: sanitizeHtml(req.body.county, { allowedTags: [] }),
                city: sanitizeHtml(req.body.city, { allowedTags: [] }),
                country: sanitizeHtml(req.body.country, { allowedTags: [] }),
            },
            gpsCoordinates: sanitizeHtml(req.body.gpsCoordinates, { allowedTags: [] }),
            tagsList: [],
        };

        await PlacesModel.create(place);

        res.status(201).json({
            message: '(201 Created)-Place successfully created',
            success: true
        });
    } catch (err) {
        res.status(403).json({
            message: '(403 Forbidden)-The data sent created a tag-type conflict',
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
            description: req.body.description ? sanitizeHtml(req.body.description, { allowedTags: [] }) : placeById.description,
            location: {
                streetAddress: req.body.streetAddress ? sanitizeHtml(req.body.streetAddress, { allowedTags: [] }) : placeById.location.streetAddress,
                county: req.body.county ? sanitizeHtml(req.body.county, { allowedTags: [] }) : placeById.location.county,
                city: req.body.city ? sanitizeHtml(req.body.city, { allowedTags: [] }) : placeById.location.city,
                country: req.body.country ? sanitizeHtml(req.body.country, { allowedTags: [] }) : placeById.location.country,
            },
            gpsCoordinates: "New calculated GPS coordinates",
            name: req.body.name ? sanitizeHtml(req.body.name, { allowedTags: [] }) : placeById.name,
            tagsList: req.body.tagsList ? req.body.tagsList : placeById.tagsList,
        })


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
