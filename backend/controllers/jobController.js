const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const { fetchAdzunaJobs } = require("../services/adzunaService");

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
// Get All Jobs (Local DB + Live Adzuna API)
// ===================================

const getAllJobs = async (req, res) => {

    try {

        const { search, location } = req.query;

        // 1. Fetch Local Jobs from MongoDB
        const localJobs = await Job.find({
            status: "Open"
        }).sort({
            createdAt: -1
        });

        // 2. Fetch Live Real Jobs from Adzuna API
        const adzunaJobs = await fetchAdzunaJobs({
            what: search || "",
            where: location || "",
            resultsPerPage: 30
        });

        // 3. Merge: Local recruiter/demo jobs first, followed by live Adzuna jobs
        const allJobs = [...localJobs, ...adzunaJobs];

        res.status(200).json(allJobs);

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

        if (jobId && jobId.startsWith("adzuna_")) {
            const externalJob = await Job.findOne({ externalId: jobId });
            if (externalJob) {
                return res.status(200).json(externalJob);
            }
            return res.status(200).json({
                _id: jobId,
                isExternal: true,
                source: "Adzuna",
                status: "Open"
            });
        }

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

        if (!recruiterId) {
            return res.status(400).json({
                success: false,
                message: "Recruiter ID is required"
            });
        }

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

        if (!recruiterId) {
            return res.status(400).json({
                success: false,
                message: "Recruiter ID is required"
            });
        }

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

        const localJobs = await Job.find({
            status: "Open"
        });

        const adzunaJobs = await fetchAdzunaJobs({
            resultsPerPage: 25
        });

        const jobs = [...localJobs, ...adzunaJobs];

        const matchedJobs = jobs.map(job => {

            const jobData = job._doc || job;

            const jobSkills = (jobData.skills || []).map(skill =>
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

                ...jobData,

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