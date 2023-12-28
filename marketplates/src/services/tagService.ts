import generateApiInstance from "../common/functions/generateApiInstance";
import { ITagValues } from "../common/types/tagTypes/tagTypes";

// Generating a tag-specific axios instance
const tagInstance = generateApiInstance();

/**
   * Allows a user or admin to create a tag
   *
   *
   * @param {ITagValues} formData - Contains the required values to create a tag
   * @param {string} userId - Contains the user's Id to attribute ownership
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function generateTag(formData: ITagValues, userId: string) {
    const response = await tagInstance.post('/tags/create', {
        formData,
        userId,
    });
    return response.data;
}

/**
   * Allows an admin to fetch all tags
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchAllTags() {
    const response = await tagInstance.get(`/tags/`);
    return response.data;
}

/**
   * Serves to fetch specific tags for a place
   *
   * 
   * @param {string[]} tagIds - Allows the back end to fetch the tags whose data is required
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchTagsByIds(tagIds: string[]) {
    const tagIdsParameter = tagIds.join('&');
    const response = await tagInstance.get(`/tags/byId/${tagIdsParameter}`);
    return response.data;
}

/**
   * Allows a user to fetch all official tags
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchOfficialTags() {
    const response = await tagInstance.get(`/tags/officialIds`);
    return response.data;
}

/**
   * Allows a user to fetch all the official tags and those they created
   *
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchTagsForUser() {
    const response = await tagInstance.get('/tags/userTags');
    return response.data;
}

/**
   * Will be used to fetch all custom tags made by users participating in the creation of a map as well as official tags
   *
   * 
   * @param {string[]} userIds - Allows the back end to fetch the tags from the specified users
   * 
   * @returns A JSON containing the success status as well as a message and an array of map data
*/
export async function fetchMapperTagsByIds(userIds: string[]) {
    const tagIdsParameter = userIds.join('&');
    const response = await tagInstance.get(`/tags/mapperTags/${tagIdsParameter}`);
    return response.data;
}


/**
   * Allows a user to update a map
   *
   *
   * @param {string} tagId - Allows the back end to fetch the tag to update
   * @param {ITagValues} formData - Contains the required values to update the tag
   * 
   * @returns A JSON containing the success status as well as a message
*/
export async function updateTagById(tagId: string, formData: ITagValues) {

    const response = await tagInstance.put('/tags/update', {
        tagId,
        formData

    });
    return response.data;
}

/**
   * Allows a tag-owner or admin to delete a map
   *
   * 
   * @param {string} tagId - Allows the back end to find the tag to be deleted
   * 
   * @returns A JSON containing the success status as well as a message.
*/
export async function deleteTagById(tagId: string) {

    const response = await tagInstance.post('/tags/delete', {
        tagId,
    });
    return response.data;
}

/**
   * Allows an admin to delete a set of tags of their choosing
   * 
   * 
   * @param {string[]} tagIds - Allows the back end to find the tags to be deleted
   *
   * @returns A JSON containing the success status as well as a message.
*/
export async function deleteTagsByIds(tagIds: string[]) {

    const response = await tagInstance.post('/tags/deleteMany', {
        tagIds,
    });
    return response.data;
}