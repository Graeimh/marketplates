import generateApiInstance from "../common/functions/generateApiInstance";
import { IPlaceUpdated } from "../common/types/placeTypes/placeTypes";

const placeIterationInstance = generateApiInstance();

export async function createPlaceIterationById(formData: IPlaceUpdated) {
    const response = await placeIterationInstance.post('/placeIterations/create', {
        formData,
    });
    return response.data;
}

export async function updatePlaceIterationById(token: string, customName?: string, customDescription?: string, customTagIds?: string[],) {
    const response = await placeIterationInstance.post('/placeIterations/update', {
        customName,
        customDescription,
        customTagIds,
        token
    });
    return response.data;
}


export async function fetchAllPlaceIterations() {
    const response = await placeIterationInstance.get(`/placeIterations/`);
    return response.data;
}

export async function fetchAllPlaceIterationsFromPlace(placeId: string[]) {
    const response = await placeIterationInstance.get(`/places/${placeId}`);
    return response.data;
}

export async function fetchPlaceIterationsByIds(placeIterationIds: string[]) {
    const applianceIdsParameter = placeIterationIds.join('&');
    const response = await placeIterationInstance.get(`/placeIterations/byIds/${applianceIdsParameter}`);
    return response.data;
}


export async function fetchPlaceIterationForUser(userId: string) {
    const response = await placeIterationInstance.get(`/placeIterations/userIterations/${userId}`);
    return response.data;
}

export async function deletePlaceIterationById(iterationId: string) {

    const response = await placeIterationInstance.post('/placeIterations/delete', {
        iterationId,
    });
    return response.data;
}

export async function deletePlaceIterationsByIds(iterationIds: string[]) {

    const response = await placeIterationInstance.post('/placeIterations/deleteMany', {
        iterationIds,
    });
    return response.data;
}