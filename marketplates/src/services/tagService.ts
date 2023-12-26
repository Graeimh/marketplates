import generateApiInstance from "../common/functions/generateApiInstance";

const tagInstance = generateApiInstance();

export async function generateTag(tagName: string, tagNameColor: string, tagBackgroundColor: string, userId: string) {
    const response = await tagInstance.post('/tags/create', {
        tagName,
        tagNameColor,
        tagBackgroundColor,
        userId,
    });
    return response.data;
}

export async function fetchAllTags() {
    const response = await tagInstance.get(`/tags/`);
    return response.data;
}

export async function fetchTagsByIds(tagIds: string[]) {
    const tagIdsParameter = tagIds.join('&');
    const response = await tagInstance.get(`/tags/byId/${tagIdsParameter}`);
    return response.data;
}

export async function fetchOfficialTags() {
    const response = await tagInstance.get(`/tags/officialIds`);
    return response.data;
}

export async function fetchTagsForUser() {
    const response = await tagInstance.get('/tags/userTags');
    return response.data;
}

export async function fetchMapperTagsByIds(userIds: string[]) {
    const tagIdsParameter = userIds.join('&');
    const response = await tagInstance.get(`/tags/mapperTags/${tagIdsParameter}`);
    return response.data;
}

export async function updateTagById(tagId: string, backgroundColor?: string, name?: string, nameColor?: string) {

    const response = await tagInstance.post('/tags/update', {
        tagId,
        backgroundColor,
        name,
        nameColor,

    });
    return response.data;
}

export async function deleteTagById(tagId: string) {

    const response = await tagInstance.post('/tags/delete', {
        tagId,
    });
    return response.data;
}

export async function deleteTagsByIds(tagIds: string[]) {

    const response = await tagInstance.post('/tags/deleteMany', {
        tagIds,
    });
    return response.data;
}