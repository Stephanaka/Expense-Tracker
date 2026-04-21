import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

// Component - Emoji picker popup for selecting transaction icons/emojis with toggle and search functionality
const EmojiPickerPopup = ({icon, onSelect}) => {
    const [isOpen, setIsOpen] =  useState(false);
    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
            <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-blue-50 text-primary rounded-lg">
                    {icon ? (
                        <img src={icon} alt="Icon" className="w-12 h-12"/>
                    ) : (
                        <LuImage />
                    )}
                </div>

                <p className="">{icon ? "Промени икона" : "Избери икона"}</p>
            </div>

            {isOpen && (
                <div className="relative">
                    <button
                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
                        onClick={() => setIsOpen(false)}
                    >
                        <LuX />
                    </button>

                    <EmojiPicker
                        open={isOpen}
                        onEmojiClick={(emoji) => onSelect(emoji?.imageUrl || "")}
                        theme="light"
                        searchPlaceholder="Търси емотикон..."
                        height={400}
                        previewConfig={{ showPreview: false }}
                    />
                </div>
            )}
        </div>  
    )
}

export default EmojiPickerPopup;