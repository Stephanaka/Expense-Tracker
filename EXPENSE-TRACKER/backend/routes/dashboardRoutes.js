const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getDashboardData } = require("../controllers/dashboardController");

// Defines a protected route for fetching dashboard data.

const router = express.Router();

router.get("/", protect, getDashboardData);


module.exports = router;