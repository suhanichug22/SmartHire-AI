const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

// ===================================
// Create Job
// ===================================

const createJob = async (req, res) => {

    try {

        const job = await Job.create(req.body);

        res.status(201).json({

            success: true,
            message: "Job Created Successfully",
            job

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// Get All Jobs
// ===================================

const getAllJobs = async (req, res) => {

    try {

        const jobs = await Job.find({

            status: "Open"

        }).sort({

            createdAt: -1

        });

        res.status(200).json(jobs);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// Get Single Job
// ===================================

const getSingleJob = async (req, res) => {

    try {

        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({

                success: false,
                message: "Job Not Found"

            });

        }

        res.status(200).json(job);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// Recruiter Jobs
// ===================================

const getRecruiterJobs = async (req, res) => {

    try {

        const { recruiterId } = req.params;

        const jobs = await Job.find({

            recruiterId

        }).sort({

            createdAt: -1

        });

        const updatedJobs = await Promise.all(

            jobs.map(async (job) => {

                const applications = await Application.find({

                    jobId: job._id

                });

                return {

                    ...job._doc,

                    applicants: applications.length,

                    pending: applications.filter(

                        app => app.status === "Pending"

                    ).length,

                    accepted: applications.filter(

                        app => app.status === "Accepted"

                    ).length,

                    rejected: applications.filter(

                        app => app.status === "Rejected"

                    ).length

                };

            })

        );

        res.status(200).json(updatedJobs);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// Recruiter Dashboard Stats
// ===================================

const getDashboardStats = async (req, res) => {

    try {

        const { recruiterId } = req.params;

        const jobs = await Job.find({

            recruiterId

        });

        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({

            jobId: {

                $in: jobIds

            }

        });

        const stats = {

            totalJobs: jobs.length,

            totalApplicants: applications.length,

            pending: applications.filter(

                app => app.status === "Pending"

            ).length,

            accepted: applications.filter(

                app => app.status === "Accepted"

            ).length,

            rejected: applications.filter(

                app => app.status === "Rejected"

            ).length

        };

        res.status(200).json(stats);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// AI Job Matching
// ===================================

const matchJobs = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        const candidateSkills = (user.skills || []).map(skill =>
            skill.toLowerCase()
        );

        const jobs = await Job.find({

            status: "Open"

        });

        const matchedJobs = jobs.map(job => {

            const jobSkills = (job.skills || []).map(skill =>
                skill.toLowerCase()
            );

            const matchedSkills = jobSkills.filter(skill =>
                candidateSkills.includes(skill)
            );

            let matchPercentage = 0;

            if (jobSkills.length > 0) {

                matchPercentage = Math.round(

                    (matchedSkills.length / jobSkills.length) * 100

                );

            }

            return {

                ...job._doc,

                matchedSkills,

                matchPercentage

            };

        })

        .filter(job => job.matchPercentage > 0)

        .sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json(matchedJobs);

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// Update Job
// ===================================

const updateJob = async (req, res) => {

    try {

        const { jobId } = req.params;

        const updatedJob = await Job.findByIdAndUpdate(

            jobId,

            req.body,

            {

                new: true,
                runValidators: true

            }

        );

        if (!updatedJob) {

            return res.status(404).json({

                success: false,
                message: "Job not found"

            });

        }

        res.status(200).json({

            success: true,
            message: "Job Updated Successfully",
            job: updatedJob

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// Delete Job
// ===================================

const deleteJob = async (req, res) => {

    try {

        const { jobId } = req.params;

        await Application.deleteMany({

            jobId

        });

        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) {

            return res.status(404).json({

                success: false,
                message: "Job not found"

            });

        }

        res.status(200).json({

            success: true,
            message: "Job Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// Toggle Job Status
// ===================================

const toggleJobStatus = async (req, res) => {

    try {

        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({

                success: false,
                message: "Job not found"

            });

        }

        job.status = job.status === "Open"
            ? "Closed"
            : "Open";

        await job.save();

        res.status(200).json({

            success: true,
            message: "Job Status Updated",
            job

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===================================
// Export Controllers
// ===================================

module.exports = {

    createJob,
    getAllJobs,
    getSingleJob,
    getRecruiterJobs,
    getDashboardStats,
    matchJobs,
    updateJob,
    deleteJob,
    toggleJobStatus

};