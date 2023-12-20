import axios, { AxiosError } from 'axios';
import { ILoginValues, IMapValues, IPlaceIterationValues, IPlaceRegisterValues, IPlaceValues, IRegisterValues, ITagValues, PrivacyStatus } from '../common/types/userTypes/userTypes';

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiInstance.interceptors.response.use(
    (config) => config,
    async (error: AxiosError) => {
        if (error.response?.status === 401 && sessionStorage.getItem("refreshToken")) {
            const response = await apiInstance.post("/auth/accessToken/", { refreshToken: sessionStorage.getItem("refreshToken") });

            const newRequest = new Request(error.request)
            newRequest.headers.append('Cookie', `token=${response.newAccessToken}`);
            return newRequest;
        }

        if (error.response?.data) return Promise.reject(error.response.data);

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

export async function checkIfActive(refreshToken: string | null) {
    const response = await apiInstance.post('/auth/tester', { refreshToken });
    return response.data;
}




//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//     USERS   ///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateUser(formData: IRegisterValues) {
    const response = await apiInstance.post('/users/create', {
        formData,
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

export async function updateUserById(userId: string, displayName?: string, email?: string, firstName?: string, lastName?: string, streetAddress?: string, county?: string, city?: string, country?: string) {
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
    });
    return response.data;
}

export async function deleteUserById(userId: string) {

    const response = await apiInstance.post('/users/delete', {
        userId,
    });
    return response.data;
}

export async function deleteUsersByIds(tagIds: string[]) {

    const response = await apiInstance.post('/users/deleteMany', {
        tagIds,
    });
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//     APPLIANCES   //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateAppliance(applianceName: string, imageURL: string, imageCaption: string) {

    const response = await apiInstance.post('/appliances/create', {
        applianceName,
        imageURL,
        imageCaption,
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

export async function deleteApplianceById(applianceId: string) {

    const response = await apiInstance.post('/appliances/delete', {
        applianceId,
    });
    return response.data;
}

export async function deleteAppliancesByIds(applianceIds: string[]) {

    const response = await apiInstance.post('/appliances/deleteMany', {
        applianceIds,
    });
    return response.data;
}
//////////////////////////////////////////////////////////////////////////////////////
//     MAPS   ////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateMap(formData: IMapValues) {
    const response = await apiInstance.post('/maps/create', {
        formData,
    });
    return response.data;
}

export async function updateMapById(userId: string, description?: string, name?: string, privacyStatus?: PrivacyStatus) {
    const response = await apiInstance.post('/maps/update', {
        description,
        name,
        userId,
        privacyStatus,
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

export async function fetchUserMaps() {
    const response = await apiInstance.get(`/maps/byUser/`);
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

export async function deleteMapById(mapId: string) {

    const response = await apiInstance.post('/maps/delete', {
        mapId,
    });
    return response.data;
}

export async function deleteMapsByIds(mapIds: string[]) {

    const response = await apiInstance.post('/maps/deleteMany', {
        mapIds,
    });
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////
//     PLACES   //////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generatePlace(formData: IPlaceRegisterValues) {
    const response = await apiInstance.post('/places/create', {
        formData,
    });
    return response.data;
}

export async function fetchAllPlaces() {
    const response = await apiInstance.get(`/places/`);
    return response.data;
}

export async function fetchUserPlaces() {
    const response = await apiInstance.get(`/places/forUser`);
    return response.data;
}

export async function fetchPlacesByIds(placeIds: string[]) {
    const applianceIdsParameter = placeIds.join('&');
    const response = await apiInstance.get(`/places/byId/${applianceIdsParameter}`);
    return response.data;
}

export async function updatePlaceById(formData: IPlaceRegisterValues, placeId: string) {

    const response = await apiInstance.post('/places/update', {
        formData,
        placeId,
    });
    return response.data;
}

export async function deletePlaceById(placeId: string) {

    const response = await apiInstance.post('/places/delete', {
        placeId,
    });
    return response.data;
}

export async function deletePlacesByIds(placeIds: string[]) {

    const response = await apiInstance.post('/places/deleteMany', {
        placeIds,
    });
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////
//     PLACEITERATIONS   /////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

export async function createPlaceIterationById(formData: IPlaceIterationValues, originalPlaceId: string) {
    const response = await apiInstance.post('/placeIterations/create', {
        formData,
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

export async function deletePlaceIterationById(iterationId: string) {

    const response = await apiInstance.post('/placeIterations/delete', {
        iterationId,
    });
    return response.data;
}

export async function deletePlaceIterationsByIds(iterationIds: string[]) {

    const response = await apiInstance.post('/placeIterations/deleteMany', {
        iterationIds,
    });
    return response.data;
}
//////////////////////////////////////////////////////////////////////////////////////
//     TAGS   ////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateTag(tagName: string, tagNameColor: string, tagBackgroundColor: string, userId: string) {
    const response = await apiInstance.post('/tags/create', {
        tagName,
        tagNameColor,
        tagBackgroundColor,
        userId,
    });
    return response.data;
}

export async function fetchAllTags() {
    const response = await apiInstance.get(`/tags/`);
    return response.data;
}

export async function fetchTagsByIds(tagIds: string[]) {
    const tagIdsParameter = tagIds.join('&');
    const response = await apiInstance.get(`/tags/byId/${tagIdsParameter}`);
    return response.data;
}

export async function fetchOfficialTags() {
    const response = await apiInstance.get(`/tags/officialIds`);
    return response.data;
}

export async function fetchTagsForUser() {
    const response = await apiInstance.get('/tags/userTags');
    return response.data;
}

export async function fetchMapperTagsByIds(userIds: string[]) {
    const tagIdsParameter = userIds.join('&');
    const response = await apiInstance.get(`/tags/mapperTags/${tagIdsParameter}`);
    return response.data;
}

export async function updateTagById(tagId: string, backgroundColor?: string, name?: string, nameColor?: string) {

    const response = await apiInstance.post('/tags/update', {
        tagId,
        backgroundColor,
        name,
        nameColor,

    });
    return response.data;
}

export async function deleteTagById(tagId: string) {

    const response = await apiInstance.post('/tags/delete', {
        tagId,
    });
    return response.data;
}

export async function deleteTagsByIds(tagIds: string[]) {

    const response = await apiInstance.post('/tags/deleteMany', {
        tagIds,
    });
    return response.data;
}
//////////////////////////////////////////////////////////////////////////////////////