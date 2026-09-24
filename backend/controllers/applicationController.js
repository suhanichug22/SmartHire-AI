const Application = require("../models/Application");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const User = require("../models/User");
const mongoose = require("mongoose");


// ======================================================
// APPLY FOR JOB
// Candidate applies → Application created
// → Recruiter gets notification
// ======================================================

const applyJob = async (req, res) => {

    try {

        const { userId, jobId, jobData } = req.body;

        console.log("\n=================================");
        console.log("📩 NEW JOB APPLICATION");
        console.log("Candidate ID:", userId);
        console.log("Job ID:", jobId);
        console.log("=================================");


        // --------------------------------------------------
        // Find or Create Job (Supports Local & External API Jobs)
        // --------------------------------------------------

        let job = null;

        if (mongoose.Types.ObjectId.isValid(jobId)) {
            job = await Job.findById(jobId);
        }

        // If not found by ObjectId or is an external ID (e.g. adzuna_...)
        if (!job && jobId) {
            job = await Job.findOne({ externalId: jobId.toString() });

            // If job not yet saved in DB and jobData was provided, persist it
            if (!job && jobData) {
                job = await Job.create({
                    company: jobData.company || "External Company",
                    title: jobData.title || "Software Opportunity",
                    location: jobData.location || "India",
                    salary: jobData.salary || "Competitive / Best in Industry",
                    description: jobData.description || "External Job Opportunity",
                    skills: Array.isArray(jobData.skills) ? jobData.skills : ["Tech"],
                    jobType: jobData.jobType || "Full Time",
                    status: "Open",
                    isExternal: true,
                    externalId: jobId.toString(),
                    source: jobData.source || "Adzuna",
                    redirect_url: jobData.redirect_url || "",
                    applicants: 0,
                    pending: 0,
                    accepted: 0,
                    rejected: 0
                });
                console.log("✅ External API Job created in DB:", job._id);
            }
        }

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
            jobId: job._id
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

            jobId: job._id,

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

            job._id,

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

            if (job.recruiterId) {
                const recruiterNotification =
                    await Notification.create({

                        userId: job.recruiterId,

                        title: "📩 New Job Application",

                        message:
                            `A candidate has applied for your job "${job.title}".`,

                        type: "General",

                        isRead: false

                    });

                console.log("✅ RECRUITER NOTIFICATION CREATED:", recruiterNotification._id);
            } else {
                // If it's an external API job, notify active recruiters
                const recruiters = await User.find({ role: "recruiter" });
                for (const recruiter of recruiters) {
                    await Notification.create({
                        userId: recruiter._id,
                        title: "🌐 New API Job Application",
                        message: `A candidate has applied for external job "${job.title}" at ${job.company}.`,
                        type: "General",
                        isRead: false
                    });
                }
                console.log(`✅ NOTIFIED ${recruiters.length} RECRUITERS ABOUT API JOB APPLICATION`);
            }

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
            .populate("jobId");


        const appliedJobIds = [];

        applications.forEach((app) => {
            if (app.jobId) {
                appliedJobIds.push(app.jobId._id.toString());
                if (app.jobId.externalId) {
                    appliedJobIds.push(app.jobId.externalId);
                }
            }
        });


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
