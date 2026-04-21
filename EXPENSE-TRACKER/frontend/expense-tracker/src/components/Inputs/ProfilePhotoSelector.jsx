import React, { useRef, useState } from "react";
import {LuUser, LuUpload, LuTrash} from 'react-icons/lu';

// Component - Profile photo selector with preview, upload, and remove functionality for user avatars
const ProfilePhotoSelector = ({ image, setImage }) => {
      const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Handle image file selection and preview generation
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Update the image state
            setImage(file);

            // Generate preview URL from the file
            const prieview = URL.createObjectURL(file);
            setPreviewUrl(prieview);
        }
    };

    // Remove selected image and clear preview
    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    // Trigger file input click
    const onChooseFile = () => {
        inputRef.current.click();
    };

    return <div className="flex justify-center mb-6">
        <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {!image ? (
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full relative">
                <LuUser className="text-4xl text-primary" />

                <button
                    type= "button"
                    className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1"
                    onClick={onChooseFile}
                >
                    <LuUpload />
                </button>
            </div>
          ) : (
            <div className="relative">
                <img
                    src={previewUrl}
                    alt="profile photo"
                    className="w-20 h-20 rounded-full object-cover"
                />
                <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
                    onClick={handleRemoveImage}
                >
                    <LuTrash />
                </button>
            </div>
        )}
    </div>;
};

export default ProfilePhotoSelector;