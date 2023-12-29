import generateApiInstance from "../common/functions/generateApiInstance";
import { IPlaceIterationValues, IPlaceUpdated } from "../common/types/placeTypes/placeTypes";

// Generating a place iteration-specific axios instance
const placeIterationInstance = generateApiInstance();

/**
   * Allows a user to create a place iteration
   *
   *
   * @param {IPlaceUpdated} formData - Contains the required values to create a place iteration
   * 
   * @returns A JSON containing the success status as well as a message,
*/
export async function createPlaceIterationById(formData: IPlaceUpdated) {
    const response = await placeIterationInstance.post('/placeIterations/create', {
        formData,
    });
    return response.data;
}

/**
   * Will allow a user to update a place iteration
   *
   *
   * @param {IIterationUpdated} formData - Contains the required values to update a place iteration
   * 
   * @returns A JSON containing the success status as well as a message,
*/
export async function updatePlaceIterationById(formData: IPlaceIterationValues) {
    const response = await placeIterationInstance.put('/placeIterations/update', {
        formData
    });
    return response.data;
}

/**
   * Will allow the admin to fetch all place iterations
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of place iterations data
*/
export async function fetchAllPlaceIterations() {
    const response = await placeIterationInstance.get(`/placeIterations/`);
    return response.data;
}

/**
   * Will allow a place-owner to have access to statistics from all the place iterations made from their place
   *
   * 
   * @param {string[]} placeIds - Contains the required values to update a place iteration
   * 
   * @returns A JSON containing the success status as well as a message and an array of place iterations data
*/
export async function fetchAllPlaceIterationsFromPlace(placeIds: string[]) {
    const response = await placeIterationInstance.get(`/places/${placeIds}`);
    return response.data;
}

/**
   * Allows a user to fetch a set of place iterations with specific ids, from a map in particular
   *
   *
   * @param {string[]} placeIterationIds - Contains the required values to create a place iteration
   * 
   * @returns A JSON containing the success status as well as a message and an array of place iterations data
*/
export async function fetchPlaceIterationsByIds(placeIterationIds: string[]) {
    const applianceIdsParameter = placeIterationIds.join('&');
    if (placeIterationIds.length > 0) {
        const response = await placeIterationInstance.get(`/placeIterations/byIds/${applianceIdsParameter}`);
        return response.data;
    }
}

/**
   * Will allow a user to fetch all the place iterations they created
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of place iterations data
*/
export async function fetchPlaceIterationForUser() {
    const response = await placeIterationInstance.get(`/placeIterations/userIterations/`);
    return response.data;
}

/**
   * Will allow a user to fetch all the place iterations they created
   *
   * 
   * @param {string} iterationId - Allows the back end to find the place iteration to be deleted
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function deletePlaceIterationById(iterationId: string) {

    const response = await placeIterationInstance.delete(`/placeIterations/delete/${iterationId}`);
    return response.data;
}

/**
   * Will allow an admin to fetch all the place iterations they created
   *
   * 
   * @param {string[]} iterationIds - Allows the back end to find the place iterations to be deleted
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function deletePlaceIterationsByIds(iterationIds: string[]) {
    const placeIterationsIdsParameter = iterationIds.join('&');

    const response = await placeIterationInstance.delete(`/placeIterations/deleteMany/${placeIterationsIdsParameter}`);
    return response.data;
}