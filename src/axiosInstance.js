import axios from "axios";
import { showNotify } from "vant";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_END_POINT,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        return config;
    }, function (error) {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    }, function (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 500) {
                showNotify({
                    type: "danger",
                    message: "Internal Server Error",
                    position: "bottom",
                });
            } else if (status === 422) {
                showNotify({
                    type: "danger",
                    message: error.response.data.message,
                    position: "bottom",
                });
            } else if (status === 403) {
                showNotify({
                    type: "danger",
                    message: error.response.data.message,
                    position: "bottom",
                });
            }
        } else {
            console.log("Error", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;