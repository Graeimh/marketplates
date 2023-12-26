import generateApiInstance from "../common/functions/generateApiInstance";
import { IPlaceRegisterValues } from "../common/types/placeTypes/placeTypes";

const placeInstance = generateApiInstance();

export async function generatePlace(formData: IPlaceRegisterValues) {
    const response = await placeInstance.post('/places/create', {
        formData,
    });
    return response.data;
}

export async function fetchAllPlaces() {
    const response = await placeInstance.get(`/places/`);
    return response.data;
}

export async function fetchUserPlaces() {
    const response = await placeInstance.get(`/places/forUser`);
    return response.data;
}

export async function fetchPlacesByIds(placeIds: string[]) {
    const applianceIdsParameter = placeIds.join('&');
    const response = await placeInstance.get(`/places/byId/${applianceIdsParameter}`);
    return response.data;
}

export async function updatePlaceById(formData: IPlaceRegisterValues, placeId: string) {

    const response = await placeInstance.post('/places/update', {
        formData,
        placeId,
    });
    return response.data;
}

export async function deletePlaceById(placeId: string) {

    const response = await placeInstance.post('/places/delete', {
        placeId,
    });
    return response.data;
}

export async function deletePlacesByIds(placeIds: string[]) {

    const response = await placeInstance.post('/places/deleteMany', {
        placeIds,
    });
    return response.data;
}