import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";

import ResumeUpload from "./pages/ResumeUpload";
import ResumeAnalysis from "./pages/ResumeAnalysis";

import Jobs from "./pages/Jobs";
import RecommendedJobs from "./pages/RecommendedJobs";
import MyApplications from "./pages/MyApplications";

import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";

import CandidateProfile from "./pages/CandidateProfile";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes";

import Notifications from "./pages/Notifications";

// ==========================================
// AI INTERVIEW
// ==========================================

import AIInterview from "./pages/AIInterview";
import InterviewResult from "./pages/InterviewResult";


function App() {

    return (

        <>

            <Navbar />

            <Routes>

                {/* =========================
                    HOME
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* =========================
                    AUTHENTICATION
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                {/* =========================
                    CANDIDATE DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    JOBS
                ========================= */}

                <Route
                    path="/jobs"
                    element={<Jobs />}
                />


                {/* =========================
                    AI RECOMMENDED JOBS
                ========================= */}

                <Route
                    path="/recommended-jobs"
                    element={
                        <ProtectedRoute>
                            <RecommendedJobs />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    MY APPLICATIONS
                ========================= */}

                <Route
                    path="/myapplications"
                    element={
                        <ProtectedRoute>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    RESUME
                ========================= */}

                <Route
                    path="/resume-upload"
                    element={
                        <ProtectedRoute>
                            <ResumeUpload />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/resume-analysis"
                    element={
                        <ProtectedRoute>
                            <ResumeAnalysis />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    CANDIDATE PROFILE
                ========================= */}

                <Route
                    path="/candidate-profile"
                    element={
                        <ProtectedRoute>
                            <CandidateProfile />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    RECRUITER DASHBOARD
                ========================= */}

                <Route
                    path="/recruiter-dashboard"
                    element={
                        <ProtectedRoute>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    CREATE JOB
                ========================= */}

                <Route
                    path="/create-job"
                    element={
                        <ProtectedRoute>
                            <CreateJob />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    EDIT JOB
                ========================= */}

                <Route
                    path="/edit-job/:jobId"
                    element={
                        <ProtectedRoute>
                            <EditJob />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    APPLICANTS
                ========================= */}

                <Route
                    path="/applicants/:jobId"
                    element={
                        <ProtectedRoute>
                            <Applicants />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    NOTIFICATIONS
                ========================= */}

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    AI INTERVIEW
                ========================= */}

                <Route
                    path="/interview/:id"
                    element={
                        <ProtectedRoute>
                            <AIInterview />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    AI INTERVIEW RESULT
                ========================= */}

                <Route
                    path="/interview-result/:id"
                    element={
                        <ProtectedRoute>
                            <InterviewResult />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </>

    );
}

export default App;
