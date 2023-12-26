import axios, { AxiosError } from "axios";

export default function generateApiInstance() {
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

    return apiInstance
}