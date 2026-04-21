const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware - Verifies JWT token from Authorization header and attaches user to request object
exports.protect = async (req, res, next) => {
    // Extract token from Authorization header (format: "Bearer <token>")
    let token = req.headers.authorization?.split(' ')[1];
    // If no token provided, deny access
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    try {
        // Verify token signature and expiration using JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user object to request for use in route handlers, exclude password for security
        req.user = await User.findById(decoded.id).select('-password'); 
        // Allow request to proceed to next middleware/route handler
        next();
    } catch (error) {
        // Token is invalid or expired
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};