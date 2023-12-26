import generateApiInstance from "../common/functions/generateApiInstance";
import { IRegisterValues } from "../common/types/userTypes/userTypes";

const userInstance = generateApiInstance();

export async function generateUser(formData: IRegisterValues) {
    const response = await userInstance.post('/users/create', {
        formData,
    });
    return response.data;
}

export async function fetchAllUsers() {
    const response = await userInstance.get('/users/');
    return response.data;
}

export async function fetchUsersByIds(userIds: string[]) {
    const userIdsParameter = userIds.join('&');
    const response = await userInstance.get(`/users/byId/${userIdsParameter}`);
    return response.data;
}

export async function updateUserById(userId: string, displayName?: string, email?: string, firstName?: string, lastName?: string, streetAddress?: string, county?: string, city?: string, country?: string) {
    const response = await userInstance.post('/users/update', {
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

    const response = await userInstance.post('/users/delete', {
        userId,
    });
    return response.data;
}

export async function deleteUsersByIds(tagIds: string[]) {

    const response = await userInstance.post('/users/deleteMany', {
        tagIds,
    });
    return response.data;
}