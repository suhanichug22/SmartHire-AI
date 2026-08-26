const User = require("../models/User");
const Job = require("../models/Job");

// ==========================================
// AI JOB RECOMMENDATIONS
// ==========================================

const getRecommendedJobs = async (req, res) => {
    try {

        const { userId } = req.params;

        // Find candidate
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Candidate skills
        const candidateSkills = (user.skills || []).map(
            skill => skill.toLowerCase().trim()
        );

        // Get only open jobs
        const jobs = await Job.find({
            status: "Open"
        });

        // Calculate matching score
        const recommendedJobs = jobs.map(job => {

            const jobSkills = (job.skills || []).map(
                skill => skill.toLowerCase().trim()
            );

            if (jobSkills.length === 0) {
                return {
                    ...job.toObject(),
                    matchScore: 0,
                    matchedSkills: []
                };
            }

            const matchedSkills = jobSkills.filter(
                skill => candidateSkills.includes(skill)
            );

            const matchScore = Math.round(
                (matchedSkills.length / jobSkills.length) * 100
            );

            return {
                ...job.toObject(),
                matchScore,
                matchedSkills
            };

        });

        // Highest match first
        recommendedJobs.sort(
            (a, b) => b.matchScore - a.matchScore
        );

        res.status(200).json({
            success: true,
            candidateSkills,
            recommendations: recommendedJobs
        });

    } catch (error) {

        console.log("Recommendation Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getRecommendedJobs
};