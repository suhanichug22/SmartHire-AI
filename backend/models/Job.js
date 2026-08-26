const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({

    company: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    salary: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    skills: [
        {
            type: String
        }
    ],

    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // New Fields

    status: {
        type: String,
        enum: ["Open", "Closed"],
        default: "Open"
    },

    applicants: {
        type: Number,
        default: 0
    },

    pending: {
        type: Number,
        default: 0
    },

    accepted: {
        type: Number,
        default: 0
    },

    rejected: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Job", jobSchema);