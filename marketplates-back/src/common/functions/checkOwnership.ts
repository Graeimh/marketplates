import { Types } from "mongoose";
import { UserType } from "../types/userTypes.js";

/**
   * Checks if the user is supposed to be able to affect data due to them being its owner or an admin
   *
   * 
   * @param {Types.ObjectId} owner_id - The user's current statuses
   * @param {string} userId - The status required for the route to be used
   * @param {string} userStatus - The status required for the route to be used
   *
   * @returns A boolean value indicating if the user is either the owner of the items in question or an admin
*/
export default function checkOwnership(owner_id: Types.ObjectId, userId: string, userStatus: string): boolean {
    const userStatusList = userStatus.split("&");

    return (owner_id.toString() === userId || userStatusList.indexOf(UserType.Admin) !== -1)
}