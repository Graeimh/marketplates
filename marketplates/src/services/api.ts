import axios from 'axios';
import { ILoginValues, IMapValues, IPlaceIterationValues, IPlaceValues, IRegisterValues, ITagValues, PrivacyStatus } from '../common/types/userTypes/userTypes';

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiInstance.interceptors.request.use((config) => {
    const clientToken = window.localStorage.getItem('TOKEN');

    if (clientToken) {
        config.headers.Authorization = `Bearer ${clientToken}`;
    }

    return config;
});

apiInstance.interceptors.response.use(
    (config) => config,
    (error) => {
        if (error.response.data) return Promise.reject(error.response.data);

        return Promise.reject(error);
    }
);

export async function getApiStatus() {
    const response = await apiInstance.get('/');
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////
//     SECURITY   ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function getCSRFTokenValue() {
    const response = await apiInstance.get('/security/csrfGeneration');
    return response.data;
}
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//     AUTHENTIFICATION   ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function login(loginData: ILoginValues, captchaToken: string) {
    const response = await apiInstance.post('/auth/login', {
        loginData,
        captchaToken,
    });
    return response.data;
}

export async function logout(refreshToken: string | null) {
    sessionStorage.clear();
    const response = await apiInstance.post('/auth/logout', {
        refreshToken,
    });
    return response.data;
}

export async function getSessionData() {
    const response = await apiInstance.get('/auth/checkSession');
    return response.data;
}

export async function checkIfActive(CSRFValue: string | null, refreshToken: string | null) {
    const response = await apiInstance.post('/auth/tester', { CSRFValue, refreshToken });
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//     USERS   ///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateUser(formData: IRegisterValues, token: string) {
    const response = await apiInstance.post('/users/create', {
        formData,
        token,
    });
    return response.data;
}

export async function fetchAllUsers() {
    const response = await apiInstance.get('/users/');
    return response.data;
}

export async function fetchUsersByIds(userIds: string[]) {
    const userIdsParameter = userIds.join('&');
    const response = await apiInstance.get(`/users/${userIdsParameter}`);
    return response.data;
}

export async function updateUserById(userId: string, token: string, displayName?: string, email?: string, firstName?: string, lastName?: string, streetAddress?: string, county?: string, city?: string, country?: string) {
    const response = await apiInstance.post('/users/update', {
        userId,
        displayName,
        email,
        firstName,
        lastName,
        streetAddress,
        county,
        city,
        country,
        token
    });
    return response.data;
}

export async function deleteUserById(userId: string, token: string) {

    const response = await apiInstance.post('/users/delete', {
        userId,
        token,
    });
    return response.data;
}

export async function deleteUsersByIds(tagIds: string[], token: string) {

    const response = await apiInstance.post('/users/deleteMany', {
        tagIds,
        token
    });
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//     APPLIANCES   //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateAppliance(applianceName: string, imageURL: string, imageCaption: string, token: string) {

    const response = await apiInstance.post('/appliances/create', {
        applianceName,
        imageURL,
        imageCaption,
        token

    });
    return response.data;
}

export async function fetchAppliances() {
    const response = await apiInstance.get('/appliances/');
    return response.data;
}

export async function fetchAppliancesByIds(applianceIds: string[]) {
    const applianceIdsParameter = applianceIds.join('&');
    const response = await apiInstance.get(`/appliances/${applianceIdsParameter}`);
    return response.data;
}

export async function updateApplianceById(token: string, applianceId: string, applianceName?: string, pictureURL?: string, pictureCaption?: string) {

    const response = await apiInstance.post('/appliances/update', {
        applianceId,
        applianceName,
        pictureURL,
        pictureCaption,
        token
    });
    return response.data;
}

export async function deleteApplianceById(applianceId: string, token: string) {

    const response = await apiInstance.post('/appliances/delete', {
        applianceId,
        token
    });
    return response.data;
}

export async function deleteAppliancesByIds(applianceIds: string[], token: string) {

    const response = await apiInstance.post('/appliances/deleteMany', {
        applianceIds,
        token
    });
    return response.data;
}
//////////////////////////////////////////////////////////////////////////////////////
//     MAPS   ////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateMap(formData: IMapValues, token: string) {
    const response = await apiInstance.post('/maps/create', {
        formData,
        token,
    });
    return response.data;
}

export async function updateMapById(userId: string, token: string, description?: string, name?: string, privacyStatus?: PrivacyStatus) {
    const response = await apiInstance.post('/maps/update', {
        description,
        name,
        userId,
        privacyStatus,
        token
    });
    return response.data;
}

export async function fetchAllMaps() {
    const response = await apiInstance.get(`/maps/`);
    return response.data;
}

export async function fetchAllPublicMaps() {
    const response = await apiInstance.get(`/maps/public/`);
    return response.data;
}

export async function fetchMapsAvailableToUser(userId: string) {
    const response = await apiInstance.get(`/maps/available/${userId}`);
    return response.data;
}


export async function fetchMapsByIds(mapIds: string[]) {
    const mapIdsParameter = mapIds.join('&');
    const response = await apiInstance.get(`/maps/${mapIdsParameter}`);
    return response.data;
}

export async function deleteMapById(mapId: string, token: string) {

    const response = await apiInstance.post('/maps/delete', {
        mapId,
        token
    });
    return response.data;
}

export async function deleteMapsByIds(mapIds: string[], token: string) {

    const response = await apiInstance.post('/maps/deleteMany', {
        mapIds,
        token
    });
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////
//     PLACES   //////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generatePlace(formData: IPlaceValues, token: string) {
    const response = await apiInstance.post('/places/create', {
        formData,
        token,
    });
    return response.data;
}

export async function fetchAllPlaces() {
    const response = await apiInstance.get(`/places/`);
    return response.data;
}

export async function fetchPlacesByIds(placeIds: string[]) {
    const applianceIdsParameter = placeIds.join('&');
    const response = await apiInstance.get(`/places/${applianceIdsParameter}`);
    return response.data;
}

export async function updatePlaceById(token: string, placeId: string, streetAddress?: string, county?: string, city?: string, country?: string, name?: string, tagsList?: string[]) {

    const response = await apiInstance.post('/appliances/update', {
        placeId,
        streetAddress,
        county,
        city,
        country,
        name,
        tagsList,
        token
    });
    return response.data;
}

export async function deletePlaceById(placeId: string, token: string) {

    const response = await apiInstance.post('/places/delete', {
        placeId,
        token
    });
    return response.data;
}

export async function deletePlacesByIds(placeIds: string[], token: string) {

    const response = await apiInstance.post('/places/deleteMany', {
        placeIds,
        token
    });
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////
//     PLACEITERATIONS   /////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

export async function createPlaceIterationById(formData: IPlaceIterationValues, originalPlaceId: string, token: string) {
    const response = await apiInstance.post('/placeIterations/create', {
        formData,
        token,
        originalPlaceId,
    });
    return response.data;
}

export async function updatePlaceIterationById(token: string, customName?: string, customDescription?: string, customTagIds?: string[],) {
    const response = await apiInstance.post('/placeIterations/update', {
        customName,
        customDescription,
        customTagIds,
        token
    });
    return response.data;
}


export async function fetchAllPlaceIterations() {
    const response = await apiInstance.get(`/placeIterations/`);
    return response.data;
}

export async function fetchAllPlaceIterationsFromPlace(placeId: string[]) {
    const response = await apiInstance.get(`/places/${placeId}`);
    return response.data;
}

export async function fetchPlaceIterationsByIds(placeIterationIds: string[]) {
    const applianceIdsParameter = placeIterationIds.join('&');
    const response = await apiInstance.get(`/placeIterations/${applianceIdsParameter}`);
    return response.data;
}


export async function fetchPlaceIterationForUser(userId: string) {
    const response = await apiInstance.get(`/placeIterations/userIterations/${userId}`);
    return response.data;
}

export async function deletePlaceIterationById(iterationId: string, token: string) {

    const response = await apiInstance.post('/placeIterations/delete', {
        iterationId,
        token
    });
    return response.data;
}

export async function deletePlaceIterationsByIds(iterationIds: string[], token: string) {

    const response = await apiInstance.post('/placeIterations/deleteMany', {
        iterationIds,
        token
    });
    return response.data;
}
//////////////////////////////////////////////////////////////////////////////////////
//     TAGS   ////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateTag(tagName: string, tagNameColor: string, tagBackgroundColor: string, userId: string, token: string) {
    const response = await apiInstance.post('/tags/create', {
        tagName,
        tagNameColor,
        tagBackgroundColor,
        userId,
        token,
    });
    return response.data;
}

export async function fetchAllTags() {
    const response = await apiInstance.get(`/tags/`);
    return response.data;
}

export async function fetchTagsByIds(tagIds: string[]) {
    const tagIdsParameter = tagIds.join('&');
    const response = await apiInstance.get(`/tags/${tagIdsParameter}`);
    return response.data;
}

export async function fetchOfficialTags() {
    const response = await apiInstance.get(`/tags/officialIds}`);
    return response.data;
}

export async function fetchTagsForUser(userId: string) {
    const response = await apiInstance.get(`/tags/userTags/${userId}`);
    return response.data;
}

export async function fetchMapperTagsByIds(userIds: string[]) {
    const tagIdsParameter = userIds.join('&');
    const response = await apiInstance.get(`/tags/mapperTags/${tagIdsParameter}`);
    return response.data;
}

export async function updateTagById(tagId: string, token: string, backgroundColor?: string, name?: string, nameColor?: string) {

    const response = await apiInstance.post('/tags/update', {
        tagId,
        backgroundColor,
        name,
        nameColor,
        token

    });
    return response.data;
}

export async function deleteTagById(tagId: string, token: string) {

    const response = await apiInstance.post('/tags/delete', {
        tagId,
        token
    });
    return response.data;
}

export async function deleteTagsByIds(tagIds: string[], token: string) {

    const response = await apiInstance.post('/tags/deleteMany', {
        tagIds,
        token
    });
    return response.data;
}
//////////////////////////////////////////////////////////////////////////////////////