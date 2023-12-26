import generateApiInstance from "../common/functions/generateApiInstance";
import { IMapValues } from "../common/types/mapTypes/mapTypes";

const mapInstance = generateApiInstance();

export async function generateMap(formData: IMapValues) {
    const response = await mapInstance.post('/maps/create', {
        formData,
    });
    return response.data;
}

export async function updateMapById(mapId: string, formData: IMapValues) {
    const response = await mapInstance.post('/maps/update', {
        mapId,
        formData,
    });
    return response.data;
}

export async function fetchAllMaps() {
    const response = await mapInstance.get(`/maps/`);
    return response.data;
}

export async function fetchAllPublicMaps() {
    const response = await mapInstance.get(`/maps/public/`);
    return response.data;
}

export async function fetchUserMaps() {
    const response = await mapInstance.get(`/maps/byUser/`);
    return response.data;
}

export async function fetchMapsAvailableToUser(userId: string) {
    const response = await mapInstance.get(`/maps/available/${userId}`);
    return response.data;
}


export async function fetchMapsByIds(mapIds: string[]) {
    const mapIdsParameter = mapIds.join('&');
    const response = await mapInstance.get(`/maps/byId/${mapIdsParameter}`);
    return response.data;
}

export async function deleteMapById(mapId: string) {

    const response = await mapInstance.post('/maps/delete', {
        mapId,
    });
    return response.data;
}

export async function deleteMapsByIds(mapIds: string[]) {

    const response = await mapInstance.post('/maps/deleteMany', {
        mapIds,
    });
    return response.data;
}