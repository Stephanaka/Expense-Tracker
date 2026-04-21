import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

// Upload image to server - Sends image file to backend and returns URL of uploaded image
const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append image file to form data for multipart upload
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set header for file upload
            },
        });
        return response.data; // Return response data with image URL
    } catch (error) {
        console.error('Error uploading the image:', error);
        throw error; // Rethrow error for handling in caller
    }
};

export default uploadImage;