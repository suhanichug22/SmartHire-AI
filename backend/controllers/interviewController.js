const Interview = require("../models/Interview");

// ======================================================
// START INTERVIEW
// POST /api/interview/start
// ======================================================

const startInterview = async (req, res) => {
    try {

        const { userId, jobId } = req.body;

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        // -----------------------------
        // CHECK IN-PROGRESS INTERVIEW
        // -----------------------------

        const existingInterview = await Interview.findOne({
            userId,
            jobId,
            status: "In Progress"
        });

        if (existingInterview) {

            return res.status(200).json({
                success: true,
                alreadyStarted: true,
                message: "Interview already in progress",
                interview: existingInterview
            });

        }

        // -----------------------------
        // QUESTIONS
        // -----------------------------

        const questions = [

            {
                question: "Tell me about yourself.",
                answer: "",
                score: 0,
                feedback: ""
            },

            {
                question: "What are your strengths?",
                answer: "",
                score: 0,
                feedback: ""
            },

            {
                question: "What are your weaknesses?",
                answer: "",
                score: 0,
                feedback: ""
            },

            {
                question: "Why should we hire you?",
                answer: "",
                score: 0,
                feedback: ""
            },

            {
                question: "Where do you see yourself in 5 years?",
                answer: "",
                score: 0,
                feedback: ""
            }

        ];

        // -----------------------------
        // CREATE INTERVIEW
        // -----------------------------

        const interview = await Interview.create({

            userId,
            jobId,

            questions,

            status: "In Progress",

            totalScore: 0,

            technicalScore: 0,

            communicationScore: 0,

            strengths: [],

            weaknesses: [],

            finalFeedback: ""

        });

        console.log(
            "✅ Interview Created:",
            interview._id
        );

        return res.status(201).json({

            success: true,

            message: "AI Interview Started Successfully",

            interview

        });

    }

    catch (error) {

        console.log(
            "❌ Start Interview Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ======================================================
// GET ALL USER INTERVIEWS
// GET /api/interview/user/:userId
// ======================================================

const getUserInterviews = async (req, res) => {

    try {

        const { userId } = req.params;

        console.log(
            "🔎 Getting User Interviews:",
            userId
        );

        const interviews = await Interview.find({
            userId
        })
        .populate("jobId")
        .sort({
            createdAt: -1
        });

        console.log(
            "✅ User Interviews Found:",
            interviews.length
        );

        return res.status(200).json({

            success: true,

            interviews

        });

    }

    catch (error) {

        console.log(
            "❌ Get User Interviews Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// GET SINGLE INTERVIEW
// GET /api/interview/:id
// ======================================================

const getInterview = async (req, res) => {

    try {

        const { id } = req.params;

        console.log(
            "🔎 Getting Interview:",
            id
        );

        const interview = await Interview.findById(id)
            .populate("jobId")
            .populate("userId");

        if (!interview) {

            return res.status(404).json({

                success: false,

                message: "Interview not found"

            });

        }

        return res.status(200).json({

            success: true,

            interview

        });

    }

    catch (error) {

        console.log(
            "❌ Get Interview Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// SUBMIT ANSWER
// PUT /api/interview/answer/:id
// ======================================================

const submitAnswer = async (req, res) => {

    try {

        const {
            questionIndex,
            answer
        } = req.body;

        const interviewId = req.params.id;

        console.log(
            "📝 Submit Answer:",
            {
                interviewId,
                questionIndex,
                answer
            }
        );

        // -----------------------------
        // FIND INTERVIEW
        // -----------------------------

        const interview =
            await Interview.findById(interviewId);

        if (!interview) {

            return res.status(404).json({

                success: false,

                message: "Interview not found"

            });

        }

        // -----------------------------
        // CHECK STATUS
        // -----------------------------

        if (interview.status === "Completed") {

            return res.status(400).json({

                success: false,

                message:
                    "This interview has already been completed."

            });

        }

        // -----------------------------
        // VALIDATE QUESTION
        // -----------------------------

        if (
            questionIndex === undefined ||
            questionIndex === null ||
            questionIndex < 0 ||
            questionIndex >= interview.questions.length
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid question index"

            });

        }

        // -----------------------------
        // VALIDATE ANSWER
        // -----------------------------

        if (
            !answer ||
            answer.trim().length === 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Answer cannot be empty"

            });

        }

        const cleanAnswer =
            answer.trim();

        // -----------------------------
        // SCORE ANSWER
        // -----------------------------

        let score = 0;

        const length =
            cleanAnswer.length;


        if (length < 20) {

            score = 30;

        }
        else if (length < 50) {

            score = 50;

        }
        else if (length < 100) {

            score = 70;

        }
        else if (length < 180) {

            score = 85;

        }
        else {

            score = 95;

        }


        // -----------------------------
        // EXTRA QUALITY POINTS
        // -----------------------------

        const words =
            cleanAnswer.split(/\s+/).length;


        if (words >= 20) {
            score += 2;
        }

        if (words >= 40) {
            score += 2;
        }

        if (
            cleanAnswer.includes(".") ||
            cleanAnswer.includes(",")
        ) {

            score += 1;

        }

        // Maximum 100

        score =
            Math.min(100, score);


        // -----------------------------
        // FEEDBACK
        // -----------------------------

        let feedback = "";


        if (score >= 85) {

            feedback =
                "Excellent answer. Your response is detailed, clear and well explained. 👍";

        }
        else if (score >= 70) {

            feedback =
                "Good answer. Try adding more specific examples and details. 👍";

        }
        else if (score >= 50) {

            feedback =
                "Average answer. You should explain your points in more detail.";

        }
        else {

            feedback =
                "Your answer is too short. Try to explain your thoughts with examples.";

        }


        // -----------------------------
        // SAVE ANSWER
        // -----------------------------

        interview.questions[questionIndex].answer =
            cleanAnswer;

        interview.questions[questionIndex].score =
            score;

        interview.questions[questionIndex].feedback =
            feedback;


        await interview.save();


        console.log(
            `✅ Question ${questionIndex + 1} Score: ${score}`
        );


        return res.status(200).json({

            success: true,

            message:
                "Answer submitted successfully",

            questionScore:
                score,

            feedback,

            interview

        });

    }

    catch (error) {

        console.log(
            "❌ Submit Answer Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// COMPLETE INTERVIEW
// PUT /api/interview/complete/:id
// ======================================================

const completeInterview = async (req, res) => {

    try {

        const { id } = req.params;

        console.log(
            "🏁 Completing Interview:",
            id
        );

        // -----------------------------
        // FIND INTERVIEW
        // -----------------------------

        const interview =
            await Interview.findById(id);

        if (!interview) {

            return res.status(404).json({

                success: false,

                message: "Interview not found"

            });

        }

        // -----------------------------
        // CHECK COMPLETED
        // -----------------------------

        if (interview.status === "Completed") {

            return res.status(400).json({

                success: false,

                alreadyCompleted: true,

                message:
                    "Interview is already completed."

            });

        }


        // -----------------------------
        // GET SCORES
        // -----------------------------

        const scores =
            interview.questions.map(
                (question) =>
                    question.score || 0
            );


        // -----------------------------
        // TOTAL
        // -----------------------------

        const total =
            scores.reduce(
                (sum, score) =>
                    sum + score,
                0
            );


        // -----------------------------
        // AVERAGE
        // -----------------------------

        const average =
            scores.length > 0
                ? Math.round(
                    total / scores.length
                )
                : 0;


        // -----------------------------
        // TECHNICAL SCORE
        // -----------------------------

        const technicalScore =
            Math.min(
                100,
                Math.max(
                    0,
                    average + 2
                )
            );


        // -----------------------------
        // COMMUNICATION SCORE
        // -----------------------------

        const communicationScore =
            Math.min(
                100,
                Math.max(
                    0,
                    average + 5
                )
            );


        // -----------------------------
        // FINAL SCORE
        // -----------------------------

        const finalScore =
            Math.round(
                (
                    technicalScore +
                    communicationScore
                ) / 2
            );


        // -----------------------------
        // STRENGTHS
        // -----------------------------

        let strengths = [];

        if (communicationScore >= 70) {

            strengths.push(
                "Good communication"
            );

        }

        if (average >= 70) {

            strengths.push(
                "Clear and detailed answers"
            );

        }

        if (average >= 85) {

            strengths.push(
                "Strong confidence"
            );

        }

        if (strengths.length === 0) {

            strengths.push(
                "Shows willingness to learn"
            );

        }


        // -----------------------------
        // WEAKNESSES
        // -----------------------------

        let weaknesses = [];

        if (average < 70) {

            weaknesses.push(
                "Answers need more detail"
            );

        }

        if (technicalScore < 75) {

            weaknesses.push(
                "Improve technical explanation"
            );

        }

        if (communicationScore < 75) {

            weaknesses.push(
                "Improve communication clarity"
            );

        }

        if (weaknesses.length === 0) {

            weaknesses.push(
                "Can provide more technical depth"
            );

        }


        // -----------------------------
        // FINAL FEEDBACK
        // -----------------------------

        let finalFeedback = "";


        if (finalScore >= 85) {

            finalFeedback =
                "Excellent interview performance! Your answers were detailed, clear and confident. Keep building your technical depth. 🚀";

        }
        else if (finalScore >= 70) {

            finalFeedback =
                "Good interview performance! Your answers were clear. Try adding more examples and technical details. 👍";

        }
        else if (finalScore >= 50) {

            finalFeedback =
                "Decent performance. You should practice giving more detailed and structured answers. 💪";

        }
        else {

            finalFeedback =
                "Keep practicing interview questions and improve the detail and clarity of your answers. 💪";

        }


        // -----------------------------
        // SAVE RESULT
        // -----------------------------

        interview.totalScore =
            finalScore;

        interview.technicalScore =
            technicalScore;

        interview.communicationScore =
            communicationScore;

        interview.strengths =
            strengths;

        interview.weaknesses =
            weaknesses;

        interview.finalFeedback =
            finalFeedback;

        interview.status =
            "Completed";


        await interview.save();


        console.log(
            "🎉 Interview Completed:",
            {
                totalScore: finalScore,
                technicalScore,
                communicationScore
            }
        );


        // -----------------------------
        // RESPONSE
        // -----------------------------

        return res.status(200).json({

            success: true,

            message:
                "Interview Completed 🎉",

            interview

        });

    }

    catch (error) {

        console.log(
            "❌ Complete Interview Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    startInterview,

    getUserInterviews,

    getInterview,

    submitAnswer,

    completeInterview

};