import React from "react";

// Component - Confirmation dialog for delete operations with warning message and action button
const DeleteAlert = ({content, onDelete}) => {
    return(
        <div>
            <p className="text-sm">{content}</p>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill"
                    onClick={onDelete}
                >
                    Изтрий
                </button>
            </div>
        </div>
    );
};

export default DeleteAlert;