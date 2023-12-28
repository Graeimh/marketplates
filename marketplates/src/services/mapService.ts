import generateApiInstance from "../common/functions/generateApiInstance";
import { IMapValues } from "../common/types/mapTypes/mapTypes";

// Generating a map-specific axios instance
const mapInstance = generateApiInstance();

/**
   * Allows a user to create a map
   *
   *
   * @param {IMapValues} formData - Contains the required values to create a map
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function generateMap(formData: IMapValues) {
    const response = await mapInstance.post('/maps/create', {
        formData,
    });
    return response.data;
}

/**
   * Allows an admin to fetch all maps
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchAllMaps() {
    const response = await mapInstance.get(`/maps/`);
    return response.data;
}

/**
   * Allows a user to fetch all public map
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchAllPublicMaps() {
    const response = await mapInstance.get(`/maps/public/`);
    return response.data;
}

/**
   * Allows a user to fetch all the maps they created
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchUserMaps() {
    const response = await mapInstance.get(`/maps/byUser/`);
    return response.data;
}

/**
   * Will allow a user to fetch all the maps they either created or participate in
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchMapsAvailableToUser(userId: string) {
    const response = await mapInstance.get(`/maps/available/${userId}`);
    return response.data;
}

/**
   * Allows a user to fetch one or several specific maps through their Ids
   *
   * 
   * @param {string[]} mapIds - Allows the back end to fetch the maps whose data is required
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchMapsByIds(mapIds: string[]) {
    const mapIdsParameter = mapIds.join('&');
    const response = await mapInstance.get(`/maps/byId/${mapIdsParameter}`);
    return response.data;
}

/**
   * Allows a user to update a map
   *
   *
   * @param {string} mapId - Allows the back end to fetch the map to update
   * @param {IMapValues} formData - Contains the required values to update the map
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function updateMapById(mapId: string, formData: IMapValues) {
    const response = await mapInstance.put('/maps/update', {
        mapId,
        formData,
    });
    return response.data;
}

/**
   * Allows a map-owner or admin to delete a map
   *
   * 
   * @param {string} mapId - Allows the back end to find the map to be deleted
   * 
   * @returns A JSON containing the success status as well as a message.
*/
export async function deleteMapById(mapId: string) {

    const response = await mapInstance.post('/maps/delete', {
        mapId,
    });
    return response.data;
}

/**
   * Will allow an admin to delete a set of maps of their choosing
   * 
   * 
   * @param {string[]} mapIds - Allows the back end to find the maps to be deleted
   *
   * @returns A JSON containing the success status as well as a message.
*/
export async function deleteMapsByIds(mapIds: string[]) {

    const response = await mapInstance.post('/maps/deleteMany', {
        mapIds,
    });
    return response.data;
}