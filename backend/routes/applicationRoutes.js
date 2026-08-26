const express = require("express");

const router = express.Router();

const {
    applyJob,
    getMyApplications,
    getAppliedJobIds,
    getApplicants,
    updateApplicationStatus,
    deleteApplication,
    getRecruiterStats
} = require("../controllers/applicationController");


// ==========================================
// Candidate Apply
// ==========================================

router.post(
    "/apply",
    applyJob
);


// ==========================================
// Candidate Applications
// ==========================================

router.get(
    "/my/:userId",
    getMyApplications
);


// ==========================================
// Already Applied Jobs
// ==========================================

router.get(
    "/applied/:userId",
    getAppliedJobIds
);


// ==========================================
// Recruiter Applicants
// ==========================================

router.get(
    "/job/:jobId",
    getApplicants
);


// ==========================================
// Update Application Status
// ==========================================

router.put(
    "/update/:id",
    updateApplicationStatus
);


// ==========================================
// Delete Application
// ==========================================

router.delete(
    "/delete/:id",
    deleteApplication
);


// ==========================================
// Recruiter Dashboard Stats
// ==========================================

router.get(
    "/stats/:recruiterId",
    getRecruiterStats
);


module.exports = router;