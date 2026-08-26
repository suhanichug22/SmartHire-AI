const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: false,
            default: null,
        },

        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },

                answer: {
                    type: String,
                    default: "",
                },

                score: {
                    type: Number,
                    default: 0,
                },

                feedback: {
                    type: String,
                    default: "",
                },
            },
        ],

        totalScore: {
            type: Number,
            default: 0,
        },

        technicalScore: {
            type: Number,
            default: 0,
        },

        communicationScore: {
            type: Number,
            default: 0,
        },

        strengths: {
            type: [String],
            default: [],
        },

        weaknesses: {
            type: [String],
            default: [],
        },

        finalFeedback: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Interview",
    interviewSchema
);