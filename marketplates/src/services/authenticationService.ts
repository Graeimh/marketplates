import generateApiInstance from "../common/functions/generateApiInstance";
import { ILoginValues } from "../common/types/userTypes/userTypes";

// Generating a authentication-specific axios instance
const authenticationInstance = generateApiInstance();

/**
   * Allows a user to log in
   *
   *
   * @param {ILoginValues} loginData - Contains email and password necessary to log in
   * @param {string} captchaToken - Contains the captcha value necessary to assess that the user is not a robot
   * 
   * @returns A JSON containing the success status as well as a message, in case of success sets the access and refresh tokens
*/
export async function login(loginData: ILoginValues, captchaToken: string) {
    const response = await authenticationInstance.post('/auth/login', {
        loginData,
        captchaToken,
    });
    return response.data;
}

/**
   * Allows a logged user to log out
   *
   *
   * @param {string | null} refreshToken - Provides the refresh token to be removed from the user's data
   * 
   * @returns A JSON containing the success status as well as a message, removes all tokens associated with the user
*/
export async function logout(refreshToken: string | null) {
    sessionStorage.clear();
    const response = await authenticationInstance.post('/auth/logout', {
        refreshToken,
    });
    return response.data;
}

/**
   * Fetches the user's access token data
   * 
   * @returns A JSON containing the access token's user data
*/
export async function getSessionData() {
    const response = await authenticationInstance.get('/auth/checkSession');
    return response.data;
}