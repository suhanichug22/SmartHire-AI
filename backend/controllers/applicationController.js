const Application = require("../models/Application");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const Notification = require("../models/Notification");


// ======================================================
// APPLY FOR JOB
// Candidate applies → Application created
// → Recruiter gets notification
// ======================================================

const applyJob = async (req, res) => {

    try {

        const { userId, jobId } = req.body;

        console.log("\n=================================");
        console.log("📩 NEW JOB APPLICATION");
        console.log("Candidate ID:", userId);
        console.log("Job ID:", jobId);
        console.log("=================================");


        // --------------------------------------------------
        // Find Job
        // --------------------------------------------------

        const job = await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({
                success: false,
                message: "Job not found"
            });

        }

        console.log("✅ Job Found");
        console.log("Company:", job.company);
        console.log("Title:", job.title);
        console.log("Recruiter ID:", job.recruiterId);


        // --------------------------------------------------
        // Check Duplicate Application
        // --------------------------------------------------

        const alreadyApplied = await Application.findOne({
            userId,
            jobId
        });

        if (alreadyApplied) {

            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });

        }


        // --------------------------------------------------
        // Find Latest Resume
        // --------------------------------------------------

        const latestResume = await Resume.findOne({
            userId
        }).sort({
            uploadedAt: -1
        });


        if (!latestResume) {

            return res.status(404).json({
                success: false,
                message: "Please upload your resume first"
            });

        }

        console.log("✅ Resume Found");


        // --------------------------------------------------
        // Create Application
        // --------------------------------------------------

        const application = await Application.create({

            userId: userId,

            jobId: jobId,

            resume: latestResume.filePath,

            status: "Pending"

        });


        console.log(
            "✅ Application Created:",
            application._id
        );


        // --------------------------------------------------
        // Update Job Applicant Statistics
        // --------------------------------------------------

        await Job.findByIdAndUpdate(

            jobId,

            {
                $inc: {
                    applicants: 1,
                    pending: 1
                }
            }

        );


        console.log("✅ Job Applicant Count Updated");


        // ==================================================
        // CREATE RECRUITER NOTIFICATION
        // ==================================================

        try {

        const recruiterNotification =
            await Notification.create({

                userId: job.recruiterId,

                title: "📩 New Job Application",

                message:
                    `A candidate has applied for your job "${job.title}".`,

                type: "General",

                isRead: false

            });


        console.log(
            "================================="
        );

        console.log(
            "✅ RECRUITER NOTIFICATION CREATED"
        );

        console.log(
            "Notification ID:",
            recruiterNotification._id
        );

        console.log(
            "Notification User ID:",
            recruiterNotification.userId
        );

        console.log(
            "================================="
        );


        } catch (notificationError) {

            console.log(
                "Recruiter Notification Error:",
                notificationError.message
            );

        }


        // --------------------------------------------------
        // Response
        // --------------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Application Submitted Successfully",

            application

        });


    } catch (error) {

        console.log(
            "❌ Apply Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================================================
// GET CANDIDATE APPLICATIONS
// ======================================================

const getMyApplications = async (req, res) => {

    try {

        const { userId } = req.params;


        const applications =
            await Application.find({
                userId
            })
            .populate("jobId");


        const validApplications =
            applications.filter(
                app => app.jobId !== null
            );


        res.status(200).json({

            success: true,

            applications: validApplications

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================================================
// GET APPLIED JOB IDS
// ======================================================

const getAppliedJobIds = async (req, res) => {

    try {

        const { userId } = req.params;


        const applications =
            await Application.find({
                userId
            })
            .select("jobId");


        const appliedJobIds =
            applications
                .filter(app => app.jobId)
                .map(
                    app => app.jobId.toString()
                );


        res.status(200).json({

            success: true,

            appliedJobIds

        });


    } catch (error) {

        console.log(
            "Applied Jobs Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================================================
// GET RECRUITER APPLICANTS
// ======================================================

const getApplicants = async (req, res) => {

    try {

        const { jobId } = req.params;


        const applicants =
            await Application.find({
                jobId
            })
            .populate("userId")
            .populate("jobId");


        res.status(200).json({

            success: true,

            applicants

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================================================
// UPDATE APPLICATION STATUS
// Recruiter accepts/rejects
// → Candidate gets notification
// ======================================================

const updateApplicationStatus =
    async (req, res) => {

        console.log(
            "✅ updateApplicationStatus called"
        );


        try {

            const { status } = req.body;


            console.log(
                "Status:",
                status
            );


            console.log(
                "Application ID:",
                req.params.id
            );


            // ------------------------------------------------
            // Find Application
            // ------------------------------------------------

            const application =
                await Application.findById(
                    req.params.id
                )
                .populate("userId")
                .populate("jobId");


            if (!application) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Application not found"

                });

            }


            // ------------------------------------------------
            // Update Status
            // ------------------------------------------------

            application.status = status;

            await application.save();


            // ------------------------------------------------
            // Update Job Statistics
            // ------------------------------------------------

            if (application.jobId) {

                const update = {};


                if (status === "Accepted") {

                    update.$inc = {
                        pending: -1,
                        accepted: 1
                    };

                }

                else if (status === "Rejected") {

                    update.$inc = {
                        pending: -1,
                        rejected: 1
                    };

                }


                if (update.$inc) {

                    await Job.findByIdAndUpdate(
                        application.jobId._id,
                        update
                    );

                }

            }


            // ==================================================
            // CREATE CANDIDATE NOTIFICATION
            // ==================================================

            if (
                status === "Accepted" ||
                status === "Rejected"
            ) {

                try {

                    await Notification.create({

                        userId:
                            application.userId._id,

                        title:
                            status === "Accepted"
                                ? "🎉 Application Accepted"
                                : "❌ Application Rejected",

                        message:
                            status === "Accepted"

                                ? `Congratulations! Your application for "${application.jobId.title}" has been accepted.`

                                : `Sorry! Your application for "${application.jobId.title}" has been rejected.`,

                        type: status,

                        isRead: false

                    });


                    console.log(
                        "✅ Candidate Notification Created"
                    );


                } catch (notificationError) {

                    console.log(
                        "❌ Candidate Notification Error:",
                        notificationError.message
                    );

                }

            }


            res.status(200).json({

                success: true,

                message:
                    "Status Updated Successfully",

                application

            });


        } catch (error) {

            console.log(
                "❌ Status Update Error:",
                error
            );


            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    };



// ======================================================
// DELETE APPLICATION
// ======================================================

const deleteApplication = async (req, res) => {

    try {

        const application =
            await Application.findByIdAndDelete(
                req.params.id
            );


        if (!application) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Application Deleted Successfully"

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================================================
// RECRUITER DASHBOARD STATS
// ======================================================

const getRecruiterStats = async (req, res) => {

    try {

        const { recruiterId } = req.params;


        const jobs =
            await Job.find({
                recruiterId
            });


        const jobIds =
            jobs.map(
                job => job._id
            );


        const applications =
            await Application.find({

                jobId: {
                    $in: jobIds
                }

            });


        const stats = {

            totalJobs:
                jobs.length,

            totalApplicants:
                applications.length,

            pending:
                applications.filter(
                    app =>
                        app.status === "Pending"
                ).length,

            accepted:
                applications.filter(
                    app =>
                        app.status === "Accepted"
                ).length,

            rejected:
                applications.filter(
                    app =>
                        app.status === "Rejected"
                ).length

        };


        res.status(200).json({

            success: true,

            ...stats

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================================================
// EXPORT
// ======================================================

module.exports = {

    applyJob,

    getMyApplications,

    getAppliedJobIds,

    getApplicants,

    updateApplicationStatus,

    deleteApplication,

    getRecruiterStats

};
