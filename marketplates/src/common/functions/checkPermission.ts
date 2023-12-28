/**
   * Checks if an user has the correct permissions to access a route, back end or front end
   *
   * 
   * @param {string} userStatus - The user's current statuses
   * @param {} statusRequired - The status required for the route to be used
   *
   * @returns A boolean value indicating if the user indeed has the correct permissions or not
*/
export function checkPermission(userStatus: string, statusRequired: string): boolean {
    const userStatusList = userStatus.split("&");

    return userStatusList.indexOf(statusRequired) !== -1;
}