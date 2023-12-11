import sanitizeHtml from "sanitize-html";
import { IMaps, PrivacyStatus, UserPrivileges } from "../types.js";
import MapsModel from "../models/Maps.js";


export async function createMap(req, res) {
    try {
        const map: IMaps = {
            description: sanitizeHtml(req.body.formData.description, { allowedTags: [] }),
            name: sanitizeHtml(req.body.formData.name, { allowedTags: [] }),
            participants: [{
                userId: req.body.formData.userId,
                userPrivileges: [UserPrivileges.Owner],
            }],
            placeIterationIds: [],
            privacyStatus: req.body.formData.privacyStatus
        };

        await MapsModel.create(map);

        res.status(201).json({
            message: '(201 Created)-Map successfully created',
            success: true
        });
    } catch (err) {
        res.status(403).json({
            message: '(403 Forbidden)-The data sent created a map-type conflict',
            success: false
        });
    };
}

export async function getAllMaps(req, res) {
    try {
        const allMaps = await MapsModel.find();
        res.status(200).json({
            data: allMaps,
            message: '(200 OK)-Successfully fetched all maps',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No map was found',
            success: false
        });
    }
}

export async function getAllPublicMaps(req, res) {
    try {
        const allPublicMaps = await MapsModel.find({ privacyStatus: PrivacyStatus.Public });
        res.status(200).json({
            data: allPublicMaps,
            message: '(200 OK)-Successfully fetched all official maps',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No map was found',
            success: false
        });
    }
}

export async function getAllMapsAvailable(req, res) {
    try {
        const allAvailableMaps = await MapsModel.find({ $or: [{ privacyStatus: PrivacyStatus.Public }, { "participants.userId": req.params.userId }] });
        res.status(200).json({
            data: allAvailableMaps,
            message: '(200 OK)-Successfully fetched all maps for the user',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No map was found',
            success: false
        });
    }
}

export async function getMapsByIds(req, res) {
    try {
        const allPublicMaps = await MapsModel.find({ $in: req.params.ids.split("&") });
        res.status(200).json({
            data: allPublicMaps,
            message: '(200 OK)-Successfully fetched all maps by id',
            success: true
        });
    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-No map was found',
            success: false
        });
    }
}

export async function updateMapById(req, res) {
    try {
        const mapById: IMaps = await MapsModel.findOne({ _id: { $in: req.body.mapId } });

        if (mapById) {
            res.status(400).json({
                message: '(404 Not Found)-The map to update was not found',
                success: false
            });
        }

        const mapToUpdate = await MapsModel.updateOne({ _id: { $in: req.body.mapId } }, {
            description: req.body.formData.description ? sanitizeHtml(req.body.formData.description, { allowedTags: [] }) : mapById.description,
            name: req.body.formData.name ? sanitizeHtml(req.body.formData.name, { allowedTags: [] }) : mapById.name,
            participants: req.body.formData.participants,
            privacyStatus: (req.body.formData.privacyStatus && req.body.creatorId === mapById.participants.some(user => user.userPrivileges.includes(UserPrivileges.Owner))) ?
                req.body.formData.privacyStatus : mapById.privacyStatus,
            placeIterationIds: (req.body.formData.placeIterations && req.body.creatorId === mapById.participants.some(user => user.userPrivileges.includes(UserPrivileges.Owner) || user.userPrivileges.includes(UserPrivileges.Editer)))
                ?
                req.body.formData.placeIterations : mapById.placeIterationIds,

        })

        res.status(204).json({
            message: '(204 No Content)-Map successfully updated',
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false
        });
    }
}

export async function deleteMapById(req, res) {
    try {
        const mapToDelete = await MapsModel.deleteOne({ _id: { $in: req.body.mapId } });

        res.status(204).json({
            message: '(204 No Content)-Map successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-Map to be deleted was not found',
            success: false
        });
    }
}

export async function deleteMapsByIds(req, res) {
    try {
        const mapsToDelete = await MapsModel.deleteMany({ _id: { $in: req.body.mapIds } });

        res.status(204).json({
            message: '(204 No Content)-Maps successfully deleted',
            success: true
        });

    } catch (err) {
        res.status(404).json({
            message: '(404 Not found)-Maps or several places to be deleted were not found',
            success: false
        });
    }
}