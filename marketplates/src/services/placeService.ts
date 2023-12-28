import generateApiInstance from "../common/functions/generateApiInstance";
import { IPlaceRegisterValues } from "../common/types/placeTypes/placeTypes";

// Generating a place-specific axios instance
const placeInstance = generateApiInstance();

/**
   * Allows a user to create a place
   *
   *
   * @param {IPlaceRegisterValues} formData - Contains the required values to create a place
   * 
   * @returns A JSON containing the success status as well as a message,
*/
export async function generatePlace(formData: IPlaceRegisterValues) {
    const response = await placeInstance.post('/places/create', {
        formData,
    });
    return response.data;
}

/**
   * Allows an admin to fetch all places
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of place data
*/
export async function fetchAllPlaces() {
    const response = await placeInstance.get(`/places/`);
    return response.data;
}


/**
   * Allows a user to fetch all the places they created
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of place data
*/
export async function fetchUserPlaces() {
    const response = await placeInstance.get(`/places/forUser`);
    return response.data;
}

/**
   * Allows a user to fetch the data for one or several places, used to fetch values for editing
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of place data
*/
export async function fetchPlacesByIds(placeIds: string[]) {
    const applianceIdsParameter = placeIds.join('&');
    const response = await placeInstance.get(`/places/byId/${applianceIdsParameter}`);
    return response.data;
}

/**
   * Allows a user to fetch the data for one or several places, used to fetch values for editing
   *
   * 
   * @param {IPlaceRegisterValues} formData - Contains the required values to update a place
   * @param {string} placeId - Allows the back end to fetch the place to update
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function updatePlaceById(formData: IPlaceRegisterValues, placeId: string) {

    const response = await placeInstance.put('/places/update', {
        formData,
        placeId,
    });
    return response.data;
}

/**
   * Allows a place-owner user or admin to delete a place
   *
   * 
   * @param {string} placeId - Allows the back end to fetch the place to delete
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function deletePlaceById(placeId: string) {

    const response = await placeInstance.post('/places/delete', {
        placeId,
    });
    return response.data;
}

/**
   * Allows an admin to delete one or several places at once
   *
   * 
   * @param {string[]} placeIds - Allows the back end to fetch the places to delete
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function deletePlacesByIds(placeIds: string[]) {

    const response = await placeInstance.post('/places/deleteMany', {
        placeIds,
    });
    return response.data;
}