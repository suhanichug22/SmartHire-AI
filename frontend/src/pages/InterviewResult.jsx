import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

function InterviewResult() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // FETCH INTERVIEW RESULT
    // ==========================================

    useEffect(() => {
        const fetchResult = async () => {
            try {
                console.log("📊 Fetching Interview Result:", id);

                const res = await axios.get(
                    `https://smarthire-ai-vm20.onrender.com/api/interview/${id}`
                );

                console.log(
                    "✅ Interview Result:",
                    res.data
                );

                setInterview(res.data.interview);

            } catch (error) {
                console.log(
                    "❌ Result Error:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResult();
        }
    }, [id]);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-2xl">
                    Loading Interview Result 🤖...
                </div>
            </div>
        );
    }

    // ==========================================
    // NOT FOUND
    // ==========================================

    if (!interview) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

                <div className="text-center">

                    <div className="text-6xl mb-5">
                        ❌
                    </div>

                    <h1 className="text-3xl font-bold">
                        Interview Result Not Found
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Unable to load your interview result.
                    </p>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-bold"
                    >
                        Go to Dashboard
                    </button>

                </div>

            </div>
        );
    }

    // ==========================================
    // DATA
    // ==========================================

    const totalScore =
        interview.totalScore || 0;

    const technicalScore =
        interview.technicalScore || 0;

    const communicationScore =
        interview.communicationScore || 0;

    const strengths =
        interview.strengths || [];

    const weaknesses =
        interview.weaknesses || [];

    const finalFeedback =
        interview.finalFeedback ||
        "No feedback available.";

    // ==========================================
    // RESULT PAGE
    // ==========================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-6 md:p-10">

            <div className="max-w-5xl mx-auto">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -30
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="text-center mb-10"
                >

                    <div className="text-6xl mb-4">
                        🎉
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold">
                        Interview Completed!
                    </h1>

                    <p className="text-gray-400 mt-3 text-lg">
                        Here is your AI Interview performance report.
                    </p>

                </motion.div>


                {/* ==========================================
                    STATUS
                ========================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    className="bg-white/10 border border-purple-500/30 rounded-3xl p-8 mb-8 text-center"
                >

                    <p className="text-gray-400 mb-2">
                        Interview Status
                    </p>

                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/40">

                        <span className="text-2xl">
                            ✅
                        </span>

                        <span className="text-green-400 font-bold text-xl">
                            {interview.status}
                        </span>

                    </div>

                </motion.div>


                {/* ==========================================
                    OVERALL SCORE
                ========================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="bg-white/10 border border-purple-500/30 rounded-3xl p-8 mb-8"
                >

                    <h2 className="text-2xl font-bold text-center mb-8">
                        🏆 Overall Performance
                    </h2>

                    <div className="flex justify-center">

                        <div className="w-44 h-44 rounded-full border-8 border-purple-500 flex flex-col items-center justify-center">

                            <span className="text-5xl font-bold">
                                {totalScore}
                            </span>

                            <span className="text-gray-400">
                                / 100
                            </span>

                        </div>

                    </div>

                    <p className="text-center text-gray-400 mt-6">
                        Overall Interview Score
                    </p>

                </motion.div>


                {/* ==========================================
                    SCORE CARDS
                ========================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    {/* TECHNICAL */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -30
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                        className="bg-white/10 border border-blue-500/30 rounded-3xl p-7"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-400">
                                    Technical Score
                                </p>

                                <h2 className="text-4xl font-bold mt-2">
                                    {technicalScore}/100
                                </h2>

                            </div>

                            <div className="text-5xl">
                                💻
                            </div>

                        </div>

                        <div className="w-full bg-black/50 rounded-full h-3 mt-6">

                            <div
                                className="bg-blue-500 h-3 rounded-full"
                                style={{
                                    width: `${technicalScore}%`
                                }}
                            />

                        </div>

                    </motion.div>


                    {/* COMMUNICATION */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 30
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                        className="bg-white/10 border border-pink-500/30 rounded-3xl p-7"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-400">
                                    Communication Score
                                </p>

                                <h2 className="text-4xl font-bold mt-2">
                                    {communicationScore}/100
                                </h2>

                            </div>

                            <div className="text-5xl">
                                🗣️
                            </div>

                        </div>

                        <div className="w-full bg-black/50 rounded-full h-3 mt-6">

                            <div
                                className="bg-pink-500 h-3 rounded-full"
                                style={{
                                    width: `${communicationScore}%`
                                }}
                            />

                        </div>

                    </motion.div>

                </div>


                {/* ==========================================
                    STRENGTHS + WEAKNESSES
                ========================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    {/* STRENGTHS */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className="bg-white/10 border border-green-500/30 rounded-3xl p-7"
                    >

                        <h2 className="text-2xl font-bold text-green-400 mb-5">
                            💪 Strengths
                        </h2>

                        {strengths.length > 0 ? (

                            <ul className="space-y-3">

                                {strengths.map(
                                    (strength, index) => (

                                        <li
                                            key={index}
                                            className="bg-black/40 rounded-xl p-4"
                                        >
                                            ✅ {strength}
                                        </li>

                                    )
                                )}

                            </ul>

                        ) : (

                            <p className="text-gray-400">
                                No strengths available.
                            </p>

                        )}

                    </motion.div>


                    {/* WEAKNESSES */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className="bg-white/10 border border-red-500/30 rounded-3xl p-7"
                    >

                        <h2 className="text-2xl font-bold text-red-400 mb-5">
                            📈 Areas to Improve
                        </h2>

                        {weaknesses.length > 0 ? (

                            <ul className="space-y-3">

                                {weaknesses.map(
                                    (weakness, index) => (

                                        <li
                                            key={index}
                                            className="bg-black/40 rounded-xl p-4"
                                        >
                                            🔸 {weakness}
                                        </li>

                                    )
                                )}

                            </ul>

                        ) : (

                            <p className="text-gray-400">
                                No improvement areas available.
                            </p>

                        )}

                    </motion.div>

                </div>


                {/* ==========================================
                    FINAL FEEDBACK
                ========================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="bg-white/10 border border-purple-500/30 rounded-3xl p-8 mb-8"
                >

                    <h2 className="text-2xl font-bold mb-5">
                        🤖 AI Feedback
                    </h2>

                    <div className="bg-black/40 rounded-2xl p-6">

                        <p className="text-gray-300 text-lg leading-relaxed">
                            {finalFeedback}
                        </p>

                    </div>

                </motion.div>


                {/* ==========================================
                    QUESTION-WISE RESULTS
                ========================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="bg-white/10 border border-purple-500/30 rounded-3xl p-8 mb-8"
                >

                    <h2 className="text-2xl font-bold mb-6">
                        📝 Question-wise Performance
                    </h2>

                    <div className="space-y-5">

                        {interview.questions?.map(
                            (question, index) => (

                                <div
                                    key={question._id || index}
                                    className="bg-black/40 rounded-2xl p-5"
                                >

                                    <div className="flex justify-between gap-4">

                                        <h3 className="font-bold">
                                            Q{index + 1}.{" "}
                                            {question.question}
                                        </h3>

                                        <span className="text-purple-400 font-bold whitespace-nowrap">
                                            {question.score || 0}/100
                                        </span>

                                    </div>

                                    <div className="mt-4">

                                        <p className="text-gray-500 text-sm mb-1">
                                            Your Answer
                                        </p>

                                        <p className="text-gray-300">
                                            {question.answer ||
                                                "No answer provided"}
                                        </p>

                                    </div>

                                    {question.feedback && (

                                        <div className="mt-4 bg-purple-500/10 rounded-xl p-4">

                                            <p className="text-purple-300 text-sm">
                                                🤖 AI Feedback
                                            </p>

                                            <p className="text-gray-300 mt-1">
                                                {question.feedback}
                                            </p>

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                </motion.div>


                {/* ==========================================
                    BUTTONS
                ========================================== */}

                <div className="flex flex-col sm:flex-row gap-4 justify-center pb-10">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-bold text-lg hover:scale-105 transition"
                    >
                        🏠 Back to Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/jobs")}
                        className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 font-bold text-lg hover:bg-white/20 transition"
                    >
                        💼 Browse Jobs
                    </button>

                </div>

            </div>

        </div>
    );
}

export default InterviewResult;