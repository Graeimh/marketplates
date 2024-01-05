import axios, { AxiosError, AxiosInstance } from "axios";

/**
   * Allows a for the creation of an axios instance
   *
   * 
   * @returns An axios instance
*/
export default function generateApiInstance(): AxiosInstance {

    const apiInstance = axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL,
        // determines the type of values the received data will parsed as, in this case: json
        headers: {
            'Content-Type': 'application/json',
        },
        // allows cross-site requests to include cookies and authorization headers 
        withCredentials: true,
    });

    apiInstance.interceptors.response.use(
        (config) => config,
        async (error: AxiosError) => {
            // if the access token has expired, then try generating a new one and make the request again
            if (error.response?.status === 401 && localStorage.getItem("refreshToken")) {
                const response = await apiInstance.post("/auth/accessToken/", { refreshToken: localStorage.getItem("refreshToken") });

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