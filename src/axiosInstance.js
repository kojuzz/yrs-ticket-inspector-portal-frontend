import axios from "axios";
import { showNotify } from "vant";
import SecureLs from "secure-ls";

const ls = new SecureLs({
    encodingType: import.meta.env.VITE_LS_ENCODING_TYPE,
    encryptionSecret: import.meta.env.VITE_LS_ENCRYPTION_SECRET,
    metaKey: import.meta.env.VITE_LS_META_KEY,
});

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_END_POINT,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ls.get("__access-token")}`,
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        config.headers.Authorization = `Bearer ${ls.get("__access-token")}`;
        return config;
    }, 
    function (error) {
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