const User = require("../models/User");
const e = require("express");
const jwt = require("jsonwebtoken");

// Generate JWT Token - Creates a signed token that expires in 90 days
const generateToken = (id) => {
    // Sign token with user ID and secret, valid for 90 days
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "90d"});
}

// User Registration - Validates input, checks for existing email, creates new user and returns token
exports.registerUser = async (req, res) => {
    // Validate request body exists
    if (!req.body) {
        return res.status(400).json({ message: "All fields are required" });
    }

    console.log('req.body:', req.body);

    const { fullName, email, password, profileImageUrl } = req.body;

    // Check if all required fields are provided (name, email, password)
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email is already registered in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already already exists" });
        }

        // Create new user in database - password will be hashed automatically by schema middleware
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        // Return user data with JWT token for immediate authentication
        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message });
    } 
};

// User Login - Verifies email and password, returns user data and JWT token if credentials are valid
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    // Validate email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Find user by email in database
        const user = await User.findOne({ email });
        // Check if user exists AND password matches (comparePassword handles bcrypt comparison)
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Return user data with JWT token for authenticated session
        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
        .status(500)
        .json({ message: "Error registering user", error: err.message });
    }
};

// Get User Info - Retrieves authenticated user's profile information (excluding password)
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res
        .status(500)
        .json({ message: "Error registering user", error: err.message });
    }
};