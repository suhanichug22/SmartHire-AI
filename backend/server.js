const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// STATIC UPLOADS
// ==========================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const interviewRoutes = require("./routes/interviewRoutes");


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/jobs",
    jobRoutes
);

app.use(
    "/api/applications",
    applicationRoutes
);

app.use(
    "/api/resume",
    resumeRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.use(
    "/api/recommendations",
    recommendationRoutes
);


// ==========================================
// ⭐ AI INTERVIEW
// ==========================================

app.use(
    "/api/interview",
    interviewRoutes
);


// ==========================================
// HOME
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.send(
            "🚀 SmartHire-AI Backend Running"
        );

    }
);


// ==========================================
// MONGODB
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "✅ MongoDB Connected"
        );

        app.listen(
            process.env.PORT || 5000,
            () => {

                console.log(
                    `🚀 Server running on port ${
                        process.env.PORT || 5000
                    }`
                );

            }
        );

    })

    .catch((err) => {

        console.log(
            "❌ MongoDB Error:",
            err.message
        );

    });