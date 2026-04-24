const multer = require("multer");

// Store uploaded image in memory instead of writing it to local disk.
// This works better on Vercel, because serverless functions should not rely on local file storage.
const storage = multer.memoryStorage();

// File filter - Only allows JPEG, PNG and JPG image formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .png and .jpg formats are allowed"), false);
    }
};

// Multer upload configuration - Keeps file in memory and limits file size to 2MB
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
});

module.exports = upload;
