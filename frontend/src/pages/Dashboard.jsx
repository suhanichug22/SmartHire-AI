import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const userId =
        user?._id ||
        user?.id ||
        localStorage.getItem("userId");

    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [interview, setInterview] = useState(null);

    const [loading, setLoading] = useState(true);
    const [interviewLoading, setInterviewLoading] = useState(true);

    // ==========================================
    // FETCH DATA
    // ==========================================

    useEffect(() => {
        if (userId) {
            fetchApplications();
            fetchNotifications();
            fetchInterview();
        } else {
            setLoading(false);
            setInterviewLoading(false);
        }
    }, [userId]);

    // ==========================================
    // FETCH APPLICATIONS
    // ==========================================

    const fetchApplications = async () => {
        try {
            const res = await axios.get(
                `https://smarthire-ai-vm20.onrender.com/api/applications/my/${userId}`
            );

            setApplications(
                res.data.applications || []
            );
        } catch (error) {
            console.log(
                "Applications Error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // FETCH NOTIFICATIONS
    // ==========================================

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(
                `https://smarthire-ai-vm20.onrender.com/api/notifications/${userId}`
            );

            setNotifications(
                res.data.notifications || []
            );
        } catch (error) {
            console.log(
                "Notifications Error:",
                error.response?.data || error.message
            );
        }
    };

    // ==========================================
    // FETCH INTERVIEW
    // ==========================================

    const fetchInterview = async () => {
        try {
            const res = await axios.get(
                `https://smarthire-ai-vm20.onrender.com/api/interview/user/${userId}`
            );

            const interviews =
                res.data.interviews || [];

            console.log(
                "✅ User Interviews:",
                interviews
            );

            if (interviews.length > 0) {
                const latestInterview =
                    interviews[interviews.length - 1];

                setInterview(latestInterview);
            } else {
                setInterview(null);
            }
        } catch (error) {
            console.log(
                "Interview Fetch Error:",
                error.response?.data ||
                error.message
            );

            setInterview(null);
        } finally {
            setInterviewLoading(false);
        }
    };

    // ==========================================
    // START INTERVIEW
    // ==========================================

    const startInterview = async () => {
        try {
            const res = await axios.get(
                `https://smarthire-ai-vm20.onrender.com/api/interview/user/${userId}`
            );

            const interviews =
                res.data.interviews || [];

            const completedInterview =
                interviews.find(
                    (item) =>
                        item.status === "Completed"
                );

            if (completedInterview) {
                alert(
                    "You have already completed the AI Interview."
                );

                setInterview(
                    completedInterview
                );

                return;
            }

            const inProgressInterview =
                interviews.find(
                    (item) =>
                        item.status === "In Progress"
                );

            if (inProgressInterview) {
                navigate(
                    `/interview/${inProgressInterview._id}`
                );

                return;
            }

            const jobId =
                "6a7191b306ebe3fb7df268f5";

            const response =
                await axios.post(
                    "https://smarthire-ai-vm20.onrender.com/api/interview/start",
                    {
                        userId,
                        jobId
                    }
                );

            console.log(
                "✅ Interview Started:",
                response.data
            );

            const interviewId =
                response.data?.interview?._id;

            if (!interviewId) {
                alert(
                    "Interview ID not received"
                );

                return;
            }

            navigate(
                `/interview/${interviewId}`
            );

        } catch (error) {
            console.log(
                "❌ Start Interview Error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to start interview"
            );
        }
    };

    // ==========================================
    // APPLICATION COUNTS
    // ==========================================

    const totalApplications =
        applications.length;

    const pendingApplications =
        applications.filter(
            (app) =>
                app.status === "Pending"
        ).length;

    const acceptedApplications =
        applications.filter(
            (app) =>
                app.status === "Accepted"
        ).length;

    const rejectedApplications =
        applications.filter(
            (app) =>
                app.status === "Rejected"
        ).length;

    const unreadNotifications =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl">
                Loading Dashboard...
            </div>
        );
    }

    // ==========================================
    // DASHBOARD
    // ==========================================

    return (
        <div className="min-h-screen bg-black text-white p-10 relative overflow-hidden">

            {/* BACKGROUND GLOW */}

            <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full"></div>

            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/20 blur-3xl rounded-full"></div>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* WELCOME */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -40
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.8
                    }}
                    className="mb-10"
                >

                    <h1 className="text-5xl font-bold">
                        Welcome {user?.name || "Candidate"} 👋
                    </h1>

                    <p className="text-gray-400 mt-3 text-lg">
                        Manage your profile and discover
                        AI-powered opportunities with SmartHire-AI.
                    </p>

                </motion.div>

                {/* APPLICATION STATS */}

                <div className="grid md:grid-cols-4 gap-5 mb-10">

                    <motion.div
                        whileHover={{
                            scale: 1.05
                        }}
                        className="bg-purple-700 rounded-2xl p-6"
                    >
                        <p>
                            📌 Total Applications
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {totalApplications}
                        </h2>
                    </motion.div>

                    <motion.div
                        whileHover={{
                            scale: 1.05
                        }}
                        className="bg-yellow-600 rounded-2xl p-6"
                    >
                        <p>
                            🟡 Pending
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {pendingApplications}
                        </h2>
                    </motion.div>

                    <motion.div
                        whileHover={{
                            scale: 1.05
                        }}
                        className="bg-green-700 rounded-2xl p-6"
                    >
                        <p>
                            🟢 Accepted
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {acceptedApplications}
                        </h2>
                    </motion.div>

                    <motion.div
                        whileHover={{
                            scale: 1.05
                        }}
                        className="bg-red-700 rounded-2xl p-6"
                    >
                        <p>
                            🔴 Rejected
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {rejectedApplications}
                        </h2>
                    </motion.div>

                </div>

                {/* MAIN CARDS */}

                <div className="grid md:grid-cols-4 gap-7 mb-10">

                    {/* PROFILE */}

                    <motion.div
                        whileHover={{
                            scale: 1.05,
                            y: -8
                        }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl"
                    >

                        <div className="text-5xl mb-5">
                            👤
                        </div>

                        <h2 className="text-2xl font-bold">
                            My Profile
                        </h2>

                        <p className="text-gray-400 mt-3">
                            Complete your candidate profile
                            and improve your hiring chances.
                        </p>

                        <Link to="/candidate-profile">

                            <button className="mt-6 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-bold">

                                Update Profile

                            </button>

                        </Link>

                    </motion.div>

                    {/* RESUME */}

                    <motion.div
                        whileHover={{
                            scale: 1.05,
                            y: -8
                        }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl"
                    >

                        <div className="text-5xl mb-5">
                            📄
                        </div>

                        <h2 className="text-2xl font-bold">
                            Resume AI
                        </h2>

                        <p className="text-gray-400 mt-3">
                            Upload your resume and improve
                            your hiring chances.
                        </p>

                        {/* FIXED ROUTE */}

                        <Link to="/resume-upload">

                            <button className="mt-6 bg-pink-600 hover:bg-pink-700 px-5 py-3 rounded-xl font-bold">

                                Upload Resume

                            </button>

                        </Link>

                    </motion.div>

                    {/* JOBS */}

                    <motion.div
                        whileHover={{
                            scale: 1.05,
                            y: -8
                        }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl"
                    >

                        <div className="text-5xl mb-5">
                            🚀
                        </div>

                        <h2 className="text-2xl font-bold">
                            Recommended Jobs
                        </h2>

                        <p className="text-gray-400 mt-3">
                            Explore jobs matching your skills.
                        </p>

                        <Link to="/jobs">

                            <button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 rounded-xl font-bold">

                                Explore Jobs

                            </button>

                        </Link>

                    </motion.div>

                    {/* AI INTERVIEW */}

                    <motion.div
                        whileHover={{
                            scale: 1.05,
                            y: -8
                        }}
                        className="bg-white/10 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-8 shadow-xl"
                    >

                        <div className="text-5xl mb-5">
                            🤖
                        </div>

                        <h2 className="text-2xl font-bold">
                            AI Interview
                        </h2>

                        <p className="text-gray-400 mt-3">
                            Practice a real-time AI-powered
                            interview with camera and microphone.
                        </p>

                        {interviewLoading ? (

                            <button
                                disabled
                                className="mt-6 bg-gray-600 px-5 py-3 rounded-xl font-bold opacity-60"
                            >
                                Checking...
                            </button>

                        ) : interview?.status === "Completed" ? (

                            <button
                                onClick={() =>
                                    navigate(
                                        `/interview-result/${interview._id}`
                                    )
                                }
                                className="mt-6 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-bold"
                            >
                                View Result 📊
                            </button>

                        ) : interview?.status === "In Progress" ? (

                            <button
                                onClick={() =>
                                    navigate(
                                        `/interview/${interview._id}`
                                    )
                                }
                                className="mt-6 bg-yellow-600 hover:bg-yellow-700 px-5 py-3 rounded-xl font-bold"
                            >
                                Continue Interview ▶️
                            </button>

                        ) : (

                            <button
                                onClick={startInterview}
                                className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 rounded-xl font-bold"
                            >
                                Start Interview
                            </button>

                        )}

                    </motion.div>

                </div>

                {/* BOTTOM SECTION */}

                <div className="grid md:grid-cols-2 gap-7 mb-10">

                    {/* APPLICATIONS */}

                    <motion.div
                        whileHover={{
                            scale: 1.03
                        }}
                        className="bg-purple-600/20 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8"
                    >

                        <div className="flex justify-between items-center">

                            <div>

                                <h2 className="text-3xl font-bold">
                                    My Applications
                                </h2>

                                <p className="text-gray-400 mt-3">
                                    Track your applied jobs and check application status.
                                </p>

                            </div>

                            <div className="text-5xl font-bold">
                                {totalApplications}
                            </div>

                        </div>

                        <Link to="/myapplications">

                            <button className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold">
                                View Applications
                            </button>

                        </Link>

                    </motion.div>

                    {/* NOTIFICATIONS */}

                    <motion.div
                        whileHover={{
                            scale: 1.03
                        }}
                        className="bg-pink-600/20 backdrop-blur-xl border border-pink-400/30 rounded-3xl p-8"
                    >

                        <div className="flex justify-between items-center">

                            <div>

                                <h2 className="text-3xl font-bold">
                                    🔔 Notifications
                                </h2>

                                <p className="text-gray-400 mt-3">
                                    Check your latest application updates.
                                </p>

                            </div>

                            <div className="text-5xl font-bold">
                                {unreadNotifications}
                            </div>

                        </div>

                        <Link to="/notifications">

                            <button className="mt-6 bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-xl font-bold">
                                View Notifications
                            </button>

                        </Link>

                    </motion.div>

                </div>

                {/* RECENT APPLICATIONS */}

                <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8">

                    <div className="flex justify-between items-center mb-6">

                        <div>

                            <h2 className="text-3xl font-bold">
                                Recent Applications 📋
                            </h2>

                            <p className="text-gray-400 mt-2">
                                Your latest job applications
                            </p>

                        </div>

                        <Link to="/myapplications">

                            <button className="text-purple-400 hover:text-purple-300">
                                View All →
                            </button>

                        </Link>

                    </div>

                    {applications.length === 0 ? (

                        <div className="text-center py-10">

                            <p className="text-gray-400 text-xl">
                                You haven't applied for any jobs yet.
                            </p>

                            <Link to="/jobs">

                                <button className="mt-5 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold">
                                    Find Jobs
                                </button>

                            </Link>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {applications
                                .slice(0, 3)
                                .map((application) => (

                                    <motion.div
                                        key={application._id}
                                        whileHover={{
                                            scale: 1.01
                                        }}
                                        className="bg-black/40 border border-white/10 rounded-2xl p-5 flex justify-between items-center"
                                    >

                                        <div>

                                            <h3 className="text-xl font-bold">
                                                {application.jobId?.title ||
                                                    "Job"}
                                            </h3>

                                            <p className="text-purple-400">
                                                {application.jobId?.company ||
                                                    ""}
                                            </p>

                                            <p className="text-gray-400 mt-1">
                                                {application.jobId?.location ||
                                                    ""}
                                            </p>

                                        </div>

                                        <span
                                            className={`px-4 py-2 rounded-full font-bold ${
                                                application.status ===
                                                "Accepted"
                                                    ? "bg-green-600"
                                                    : application.status ===
                                                      "Rejected"
                                                    ? "bg-red-600"
                                                    : "bg-yellow-600 text-black"
                                            }`}
                                        >
                                            {application.status}
                                        </span>

                                    </motion.div>

                                ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;