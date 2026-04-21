import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useEffect } from "react";

// Custom hook - Automatically fetches and updates user info from API on page load, redirects to login if not authenticated
export const useUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Skip API call if user data already exists in context
        if(user) return;

        // Track if component is still mounted to prevent memory leaks from race conditions
        let isMounted = true;

        // Fetch authenticated user's profile information from backend
        const fetchUserInfo = async () => {
            try {
                // API call retrieves user data using JWT token in Authorization header
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

                // Update context only if component is still mounted (prevent setState on unmounted component)
                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                // If fetch fails (invalid/expired token), user is not authenticated
                console.error("Failed to fetch user info:", error);
                if (isMounted) {
                    // Clear user from context and redirect to login page for re-authentication
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        // Cleanup function - prevents state updates after component unmounts
        return () => {
            isMounted = false;
        };
    }, [updateUser, clearUser, navigate]);
};