// Express server setup - Initializes API with CORS, routes, static files, and MongoDB connection
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Allowed frontend origins - Used to permit requests only from trusted client applications
const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://expense-tracker-rho-sable.vercel.app",
];

// Middleware to handle CORS - Allows frontend application to communicate with backend API
app.use(
    cors({
        // Check whether incoming request origin is allowed
        origin: function (origin, callback) {
            // Allow requests with no origin (e.g. Postman, server-to-server requests)
            // or requests coming from one of the allowed frontend URLs
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            // Reject requests coming from unapproved origins
            return callback(new Error("Not allowed by CORS"));
        },
        origin: "*",
        // Allowed HTTP methods for cross-origin requests
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        // Allowed request headers sent by the client
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB database before handling API requests
connectDB();

// Register API routes for authentication, income, expense, and dashboard functionality
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Serve uploaded files as static resources from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Express server on port from environment variables or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
