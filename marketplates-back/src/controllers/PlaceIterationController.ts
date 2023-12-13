import sanitizeHtml from "sanitize-html";
import PlacesModel from "../models/Places.js";
import { IPlaceIteration } from "../types.js";
import PlaceIterationsModel from "../models/PlaceIterations.js";
import IterationsModel from "../models/Iterations.js";

export async function createPlaceIterationById(req, res) {
    try {
        const placeToIterateUpon = await PlacesModel.findOne({ _id: req.body.originalPlaceId });

        if (!placeToIterateUpon) {
            res.status(400).json({
                message: '(404 Not Found)-The place to iterate upon was not found',
                success: false
            });
        }

        const iteration: IPlaceIteration = {
            associatedMapIds: [],
            creatorId: req.body.formData.userId,
            customName: req.body.formData.customName ? sanitizeHtml(req.body.formData.customName, { allowedTags: [] }) : placeToIterateUpon.name,
            customDescription: req.body.formData.customDescription ? sanitizeHtml(req.body.formData.customDescription, { allowedTags: [] }) : placeToIterateUpon.description,
            customTagIds: placeToIterateUpon.tagsList,
            placeId: placeToIterateUpon._id,
        }

        await PlaceIterationsModel.create(iteration);

    } catch (err) {
        res.status(500).json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false
        });
    }
}

export async function getAllPlaceIterations(req, res) {
    try {
        const allPlacesIterations = await PlaceIterationsModel.find();
        res.json({
            data: allPlacesIterations,
            message: '(200 OK)-Successfully fetched all iterations',
            success: true
        });
    } catch (err) {
        res.json({
            message: '(404 Not found)-No iteration was found',
            success: false
        });
    }
}

export async function getPlaceIterationsByIds(req, res) {
    try {
        const someIterations = await PlaceIterationsModel.find({ _id: { $in: req.params.ids.split("&") } });
        res.json({
            data: someIterations,
            message: '(200 OK)-Successfully fetched all iterations by Ids',
            success: true
        });
    } catch (err) {
        res.json({
            message: '(404 Not found)-No iterations were found',
            success: false
        });
    }
}

export async function getAllPlaceIterationsFromPlace(req, res) {
    try {
        const allPlacesIterationsFromPlace = await PlaceIterationsModel.find({ placeId: req.params.placeId });
        res.json({
            data: allPlacesIterationsFromPlace,
            message: '(200 OK)-Successfully fetched all iterations from the given place',
            success: true
        });
    } catch (err) {
        res.json({
            message: '(404 Not found)-No iteration was found for the given place',
            success: false
        });
    }
}

export async function updatePlaceIterationById(req, res) {
    try {
        const placeIterationById: IPlaceIteration = await PlaceIterationsModel.findOne({ _id: { $in: req.body.placeIterationId } });

        if (!placeIterationById) {
            res.status(400).json({
                message: '(404 Not Found)-The placeIteration to update was not found',
                success: false
            });
        }

        const placeIterationToUpdate = await PlaceIterationsModel.updateOne({ _id: { $in: req.body.placeIterationId } }, {
            customName: req.body.customName ? sanitizeHtml(req.body.customName, { allowedTags: [] }) : placeIterationById.customName,
            customDescription: req.body.customDescription ? sanitizeHtml(req.body.customDescription, { allowedTags: [] }) : placeIterationById.customDescription,
            customTagIds: req.body.customTagIds ? req.body.customTagIds : placeIterationById.customTagIds,

        })
    }

    catch (err) {
        res.status(500).json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false
        });
    }
}


export async function getPlaceIterationByIds(req, res) {
    try {
        const allPlacesIterationsByIds = await PlaceIterationsModel.find({ $in: req.params.ids.split("&") });
        res.status(200).json({
            data: allPlacesIterationsByIds,
            message: '(200 OK)-Successfully fetched all place iterations by id',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No place iteration was found',
            success: false
        });
    }
}

export async function getPlaceIterationForUser(req, res) {
    try {
        const allPlacesIterationsForUser = await PlaceIterationsModel.find({ creatorId: req.params.userId });
        res.json({
            data: allPlacesIterationsForUser,
            message: '(200 OK)-Successfully fetched all place iterations for the given user',
            success: true
        });
    } catch (err) {
        res.json({
            message: '(404 Not found)-No place iteration was found for the given user',
            success: false
        });
    }
}

export async function deleteIterationById(req, res) {
    try {
        const iterationToDelete = await IterationsModel.deleteMany({ _id: { $in: req.body.iterationId } });

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

export async function deleteIterationsByIds(req, res) {
    try {
        const iterationsToDelete = await IterationsModel.deleteMany({ _id: { $in: req.body.iterationIds } });

        res.status(204).json({
            message: '(204 No Content)-Iterations successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-One or several iterations to be deleted were not found',
            success: false
        });
    }
}