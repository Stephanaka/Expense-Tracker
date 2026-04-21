import React, {createContext, useState}  from "react";

export const UserContext = createContext();

// Context provider - Manages global user authentication state and provides update/clear methods
export const UserProvider = ({ children }) => {
    // Global state holding authenticated user data (null if not logged in)
    const [user, setUser] = useState(null);

    // Update user data when user logs in or profile information changes
    const updateUser = (userData) => {
        setUser(userData);
    };

    // Clear user data when user logs out
    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider
         value={{
            user,
            updateUser,
            clearUser
         }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;