import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Create axios instance with base URL and default settings
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor - Automatically adds JWT token to Authorization header for authenticated requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Retrieve JWT token from browser storage
        const accessToken = localStorage.getItem("token");
        // If token exists, add it to request Authorization header for server to verify user identity
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Handles API responses and errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        // Pass successful responses through unchanged
        return response;
    },
    (error) => {
        // Handle common HTTP errors globally across all API requests
        if (error.response) {
            // 401 Unauthorized - Token expired or invalid, redirect to login
            if (error.response.status === 401) {
                window.location.href = "/login";
            } 
            // 500 Server Error - Log to console for debugging
            else if (error.response.status === 500) {
                console.error("Server Error. Please try again later.");  
            }
        } 
        // ECONNABORTED error - Request timed out after 10 seconds
        else if (error.code === 'ECONNABORTED') {
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;