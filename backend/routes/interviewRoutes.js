const express = require("express");

const router = express.Router();

const {
    startInterview,
    getInterview,
    getUserInterviews,
    submitAnswer,
    completeInterview
} = require("../controllers/interviewController");


// START INTERVIEW
router.post(
    "/start",
    startInterview
);


// GET ALL USER INTERVIEWS
router.get(
    "/user/:userId",
    getUserInterviews
);


// GET SINGLE INTERVIEW
router.get(
    "/:id",
    getInterview
);


// SUBMIT ANSWER
router.put(
    "/answer/:id",
    submitAnswer
);


// COMPLETE INTERVIEW
router.put(
    "/complete/:id",
    completeInterview
);


module.exports = router;