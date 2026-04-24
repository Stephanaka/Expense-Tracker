const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token - Creates a signed token that expires in 90 days
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};

// User Registration - Validates input, checks for existing email, creates new user and returns token
exports.registerUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const { fullName, email, password, profileImageUrl } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        return res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error registering user",
            error: err.message,
        });
    }
};

// User Login - Verifies email and password, returns user data and JWT token if credentials are valid
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error logging in user",
            error: err.message,
        });
    }
};

// Get User Info - Retrieves authenticated user's profile information excluding password
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching user info",
            error: err.message,
        });
    }
};

// Upload Image - Converts uploaded image to Base64 instead of saving it to local disk
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        return res.status(200).json({
            imageUrl,
        });
    } catch (error) {
        console.error("uploadImage error:", error);
        return res.status(500).json({
            message: "Image upload failed",
            error: error.message,
        });
    }
};
