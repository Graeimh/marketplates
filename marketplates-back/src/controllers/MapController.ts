import sanitizeHtml from "sanitize-html";
import MapsModel from "../models/Maps.js";
import jwt from "jsonwebtoken"
import mongoose, { Types } from "mongoose";
import PlaceIterationsModel from "../models/PlaceIterations.js";
import { IMaps, PrivacyStatus, UserPrivileges } from "../types/mapTypes.js";
import { IPlaceIteration, IPlaceUpdated } from "../types/placeIterationTypes.js";

/**
   * Creates a map
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData held within the body
   * @param res - The response object associated with the route
   * 
   * @catches - If the data provided causes an error in the creation of the map or place iterations or if the token isn't verified (403)
   * @responds - By informing the user the map and iterations have been created (201)
*/
export async function createMap(req, res) {
    try {
        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        // Create a map Id for place iterations to be assigned to the map
        const mapId = new mongoose.Types.ObjectId();

        const iterations: IPlaceUpdated[] = req.body.formData.placeIterations;

        // Prepare an empty list to collect the future iterations' Ids
        const listOfIterationIds: Types.ObjectId[] = [];

        for (const iteration of iterations) {
            // Creating iterations according to the IPlaceIteration interface
            const newId = new mongoose.Types.ObjectId();
            const iterationToCreate: IPlaceIteration = {
                _id: newId,
                associatedMapIds: [mapId],
                creatorId: decryptedCookie.userId,
                customName: iteration.name,
                customDescription: iteration.description,
                customTagIds: iteration.tagsList.map(tag => tag._id),
                gpsCoordinates: {
                    longitude: iteration.gpsCoordinates.longitude,
                    latitude: iteration.gpsCoordinates.latitude,
                },
                placeId: iteration._id,

            }
            listOfIterationIds.push(newId);

            await PlaceIterationsModel.create(iterationToCreate);
        }

        // Creating the map according to the IMaps interface, sanitizing every text input given using sanitizeHtml
        const map: IMaps = {
            _id: mapId,
            description: sanitizeHtml(req.body.formData.description, { allowedTags: [] }),
            ownerId: decryptedCookie.userId,
            name: sanitizeHtml(req.body.formData.name, { allowedTags: [] }),
            participants: [...req.body.formData.participants, {
                userId: decryptedCookie.userId,
                userPrivileges: [UserPrivileges.Owner],
            }],
            placeIterationIds: listOfIterationIds,
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

/**
   * Fetches all maps
   *
   *
   * @param req - The request object associated with the route parameters, not used here
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404)
   * @responds - With an array of all the maps in the database (200)
*/
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

/**
   * Fetches all maps whose privacy status is at 'Public'
   *
   *
   * @param req - The request object associated with the route parameters, not used here
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404)
   * @responds - With an array of all the public maps in the database (200)
*/
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

/**
   * Fetches all maps who are either public, owned by the user, or where the user participates in
   *
   *
   * @param req - The request object associated with the route parameters, specifically the Ids in the params
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404)
   * @responds - With an array of maps in the database corresponding to the criteria (200)
*/
export async function getAllMapsAvailable(req, res) {
    try {
        const allAvailableMaps = await MapsModel.find({ $or: [{ privacyStatus: PrivacyStatus.Public }, { ownerId: req.params.ids }, { "participants.userId": req.params.ids }] });
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

/**
   * Fetches all maps owned by the user
   *
   *
   * @param req - The request object associated with the route parameters, specifically the Ids in the params
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404)
   * @responds - With an array of maps owned by the user (200)
*/
export async function getUserMaps(req, res) {
    try {
        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);
        const allUserMaps = await MapsModel.find({ ownerId: decryptedCookie.userId });
        res.status(200).json({
            data: allUserMaps,
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

/**
   * Fetches all maps corresponding to the Ids given
   *
   *
   * @param req - The request object associated with the route parameters, specifically the Ids in the params
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404)
   * @responds - With an array of maps who match the Ids given (200)
*/
export async function getMapsByIds(req, res) {
    try {
        // Ids, when sent in groups are sent in a single string, each Id tied to the others by a & character, hence the need for a split on that character
        const allPublicMaps = await MapsModel.find({ _id: { $in: req.params.ids.split("&") } });
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

/**
   * Updates a map's data and its place iterations
   *
   *
   * @param req - The request object associated with the route parameters, specifically the  cookies and the body
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404) or the map/iterations could not be updated (500)
   * @responds - With a message informing the user the update is done (204)
*/
export async function updateMapById(req, res) {
    try {
        // Get access token from the front end and the key that serves to create and verify them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Get the token's contents, verifying its validity in the process
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        // Find the matching map
        const mapById: IMaps = await MapsModel.findOne({ _id: { $in: req.body.mapId } });

        if (!mapById) {
            res.status(400).json({
                message: '(404 Not Found)-The map to update was not found',
                success: false
            });
        }

        const iterations: IPlaceUpdated[] = req.body.formData.placeIterations;
        const listOfIterationIds: Types.ObjectId[] = [];

        for (const iteration of iterations) {
            // Check if the place iteration already exists
            const foundPreexistingIteration = await PlaceIterationsModel.find({ _id: { $in: [iteration._id] } })

            // If it does, we edit it with the new given values
            if (foundPreexistingIteration) {
                try {
                    await PlaceIterationsModel.updateOne({ _id: { $in: foundPreexistingIteration[0]._id } }, {
                        customName: iteration.name,
                        customDescription: iteration.description,
                        customTagIds: iteration.tagsList.map(tag => tag._id),
                    })
                    listOfIterationIds.push(foundPreexistingIteration[0]._id);
                } catch {
                    res.status(500).json({
                        message: '(500 Internal Server Error)-A server side error has occured.',
                        success: false
                    });
                }
                // If it doesn't, we create it instead
            } else {
                try {
                    const newId = new mongoose.Types.ObjectId();
                    const iterationToCreate: IPlaceIteration = {
                        _id: newId,
                        associatedMapIds: [req.body.mapId],
                        creatorId: decryptedCookie.userId,
                        customName: iteration.name,
                        customDescription: iteration.description,
                        customTagIds: iteration.tagsList.map(tag => tag._id),
                        gpsCoordinates: {
                            longitude: iteration.gpsCoordinates.longitude,
                            latitude: iteration.gpsCoordinates.latitude,
                        },
                        placeId: iteration._id,

                    }
                    listOfIterationIds.push(newId);

                    await PlaceIterationsModel.create(iterationToCreate);
                } catch {
                    res.status(500).json({
                        message: '(500 Internal Server Error)-A server side error has occured.',
                        success: false
                    });
                }
            }
        }

        // Updating the map's data as well when changes are provided
        await MapsModel.updateOne({ _id: { $in: req.body.mapId } }, {
            description: req.body.formData.description ? sanitizeHtml(req.body.formData.description, { allowedTags: [] }) : mapById.description,
            name: req.body.formData.name ? sanitizeHtml(req.body.formData.name, { allowedTags: [] }) : mapById.name,
            participants: req.body.formData.participants,
            privacyStatus: req.body.formData.privacyStatus,
            placeIterationIds: listOfIterationIds,

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

/**
   * Deletes a map
   *
   *
   * @param req - The request object associated with the route parameters, especially its body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deleteMapById(req, res) {
    try {
        await MapsModel.deleteOne({ _id: { $in: req.body.mapId } });

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

/**
   * Deletes a specific set of maps
   *
   *
   * @param req - The request object associated with the route parameters, especially its body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deleteMapsByIds(req, res) {
    try {
        await MapsModel.deleteMany({ _id: { $in: req.body.mapIds } });

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