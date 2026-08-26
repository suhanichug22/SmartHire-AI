const express = require("express");

const router = express.Router();

const {

    createJob,
    getAllJobs,
    getSingleJob,
    getRecruiterJobs,
    getDashboardStats,
    matchJobs,
    updateJob,
    deleteJob,
    toggleJobStatus

} = require("../controllers/jobController");


// ===================================
// Create Job
// ===================================

router.post(
    "/create",
    createJob
);


// ===================================
// Get All Jobs
// ===================================

router.get(
    "/",
    getAllJobs
);


// ===================================
// Get Single Job
// ===================================

router.get(
    "/:jobId",
    getSingleJob
);


// ===================================
// Recruiter Jobs
// ===================================

router.get(
    "/recruiter/:recruiterId",
    getRecruiterJobs
);


// ===================================
// Dashboard Stats
// ===================================

router.get(
    "/dashboard/:recruiterId",
    getDashboardStats
);


// ===================================
// AI Match
// ===================================

router.get(
    "/match/:userId",
    matchJobs
);


// ===================================
// Update Job
// ===================================

router.put(
    "/update/:jobId",
    updateJob
);


// ===================================
// Delete Job
// ===================================

router.delete(
    "/delete/:jobId",
    deleteJob
);


// ===================================
// Toggle Job Status
// ===================================

router.put(
    "/toggle-status/:jobId",
    toggleJobStatus
);


module.exports = router;