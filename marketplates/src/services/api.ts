import axios from 'axios';
import { ILoginValues, IRegisterValues } from '../common/types/userTypes/userTypes';

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
    console.log("Heya!");
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

export async function getSessionData() {
    const response = await apiInstance.get('/auth/checkSession');
    return response.data;
}

export async function checkIfActive(CSRFValue: string | null) {
    const response = await apiInstance.post('/auth/tester', { CSRFValue });
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

//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//     APPLIANCES   //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateAppliance(applianceName: string, imageURL: string, imageCaption: string) {

    const response = await apiInstance.post('/appliances/create', {
        applianceName,
        imageURL,
        imageCaption

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

export async function updateApplianceById(applianceId: string, applianceName?: string, pictureURL?: string, pictureCaption?: string) {

    const response = await apiInstance.post('/appliances/update', {
        applianceId,
        applianceName,
        pictureURL,
        pictureCaption

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
export async function generateBasket() {

}

export async function generateIteration() {

}

export async function generateMenuItem() {

}

export async function generateMenu() {

}

export async function generateMenusSection() {

}

export async function generateOpinion() {

}

export async function generatePlace() {

}

export async function generatePost() {

}

export async function generateProduct() {

}

export async function generateTag() {

}
