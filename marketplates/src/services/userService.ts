import generateApiInstance from "../common/functions/generateApiInstance";
import { IRegisterValues, IUserData } from "../common/types/userTypes/userTypes";

// Generating a user-specific axios instance
const userInstance = generateApiInstance();

/**
   * Allows a non-logged user to create a profile
   *
   *
   * @param {IRegisterValues} formData - Contains the required values to create a user
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function generateUser(formData: IRegisterValues) {
    const response = await userInstance.post('/users/create', {
        formData,
    });
    return response.data;
}

/**
   * Allows an admin or users to fetch all users
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of user data
*/
export async function fetchAllUsers() {
    const response = await userInstance.get('/users/');
    return response.data;
}

/**
   * Allows a users to fetch their profile's information, in the future will allow to pull the data from several users to share in a map
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of user data
*/
export async function fetchUsersByIds(userIds: string[]) {
    const userIdsParameter = userIds.join('&');
    const response = await userInstance.get(`/users/byId/${userIdsParameter}`);
    return response.data;
}


/**
   * Allows a user to update their own profile or an admin to update a user's profile
   *
   *
   * @param {string} userId - Allows the back end to find the user's data to be updated
   * @param {IUserUpdateValues} formData - Contains the required values to update a user
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function updateUserById(userId: string, formData: IUserData) {
    const response = await userInstance.put('/users/update', {
        userId,
        formData
    });
    return response.data;
}

/**
   * Allows a user to delete their account or an admin to delete an user
   *
   * 
   * @param {string} userId - Allows the back end to find the user to be deleted
   * 
   * @returns A JSON containing the success status as well as a message.
*/
export async function deleteUserById(userId: string) {

    const response = await userInstance.post('/users/delete', {
        userId,
    });
    return response.data;
}

/**
   * Allows an admin to delete a set of users of their choosing
   * 
   * 
   * @param {string[]} userIds - Allows the back end to find the users to be deleted
   *
   * @returns A JSON containing the success status as well as a message.
*/
export async function deleteUsersByIds(userIds: string[]) {

    const response = await userInstance.post('/users/deleteMany', {
        userIds,
    });
    return response.data;
}