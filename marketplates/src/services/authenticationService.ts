import generateApiInstance from "../common/functions/generateApiInstance";
import { ILoginValues } from "../common/types/userTypes/userTypes";

const authenticationInstance = generateApiInstance();

export async function login(loginData: ILoginValues, captchaToken: string) {
    const response = await authenticationInstance.post('/auth/login', {
        loginData,
        captchaToken,
    });
    return response.data;
}

export async function logout(refreshToken: string | null) {
    sessionStorage.clear();
    const response = await authenticationInstance.post('/auth/logout', {
        refreshToken,
    });
    return response.data;
}

export async function getSessionData() {
    const response = await authenticationInstance.get('/auth/checkSession');
    return response.data;
}