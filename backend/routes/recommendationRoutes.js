const express = require("express");

const router = express.Router();

const {
    getRecommendedJobs
} = require("../controllers/recommendationController");

// ==========================================
// Get AI Recommended Jobs
// ==========================================

router.get(
    "/:userId",
    getRecommendedJobs
);

module.exports = router;