import axios from "axios";

const api = axios.create({
    baseURL: "https://hirepro-6yde.onrender.com/api/v1",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;