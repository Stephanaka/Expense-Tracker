const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getUserInfo,
    uploadImage, 
} = require("../controllers/authController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// Upload Image - uses controller (Base64, no local storage)
router.post("/upload-image", upload.single("image"), uploadImage);

module.exports = router;
