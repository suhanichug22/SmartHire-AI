import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function MyApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);


    // ==========================================
    // Fetch Applications
    // ==========================================

    const fetchApplications = async () => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            if (!user) {

                setLoading(false);
                return;

            }

            const userId = user._id || user.id;

            const res = await axios.get(
                `https://smarthire-ai-vm20.onrender.com/api/applications/my/${userId}`
            );

            console.log(
                "MY APPLICATIONS:",
                res.data
            );

            setApplications(
                res.data.applications || []
            );

            setLoading(false);

        }

        catch (error) {

            console.log(
                "❌ Applications Error:",
                error
            );

            setApplications([]);
            setLoading(false);

        }

    };


    useEffect(() => {

        fetchApplications();

    }, []);


    // ==========================================
    // Withdraw Application
    // ==========================================

    const withdrawApplication = async (id) => {

        const confirmWithdraw = window.confirm(
            "Are you sure you want to withdraw this application?"
        );

        if (!confirmWithdraw) {
            return;
        }

        try {

            await axios.delete(
                `https://smarthire-ai-vm20.onrender.com/api/applications/delete/${id}`
            );

            alert(
                "Application Withdrawn Successfully ✅"
            );

            fetchApplications();

        }

        catch (error) {

            console.log(
                "❌ Withdraw Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to withdraw application"
            );

        }

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                <h1 className="text-3xl font-bold animate-pulse">

                    Loading applications...

                </h1>

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-black text-white p-6 md:p-10">


            {/* Heading */}

            <motion.div

                initial={{
                    opacity: 0,
                    y: -30
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                className="mb-8"

            >

                <h1 className="text-4xl md:text-5xl font-bold mb-3">

                    My Applications

                </h1>

                <p className="text-gray-400">

                    Track your job application status

                </p>

            </motion.div>


            {/* No Applications */}

            {applications.length === 0 ? (

                <div className="text-center py-20 bg-white/[0.04] border border-white/10 rounded-2xl">

                    <h2 className="text-3xl font-bold">

                        No Applications Found

                    </h2>

                    <p className="text-gray-400 mt-3">

                        Start applying for jobs to see them here.

                    </p>

                </div>

            ) : (


                /* Applications */

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {applications.map(
                        (app, index) => (

                            <motion.div

                                key={app._id}

                                initial={{
                                    opacity: 0,
                                    y: 40
                                }}

                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}

                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1
                                }}

                                whileHover={{
                                    scale: 1.01,
                                    y: -5
                                }}

                                className="flex flex-col bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/25 transition hover:border-purple-500/45"

                            >


                                {/* Job Title */}

                                <h2 className="text-2xl font-bold">

                                    {app.jobId?.title ||
                                        "Job Deleted"}

                                </h2>


                                {/* Company */}

                                <p className="text-purple-300 text-base mt-2">

                                    {app.jobId?.company ||
                                        "Company"}

                                </p>


                                {/* Location */}

                                <p className="text-gray-300 mt-5 text-sm">

                                    📍{" "}

                                    {app.jobId?.location ||
                                        "Not specified"}

                                </p>


                                {/* Salary */}

                                <p className="text-gray-300 mt-3 text-sm">

                                    💰{" "}

                                    {app.jobId?.salary ||
                                        "Not specified"}

                                </p>


                                {/* Skills */}

                                <p className="text-gray-300 mt-5 text-sm font-semibold">

                                    🛠 Skills

                                </p>


                                <div className="flex flex-wrap gap-2 mt-2">

                                    {app.jobId?.skills?.map(
                                        (skill, index) => (

                                            <span

                                                key={index}

                                                className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-400/50 text-xs"

                                            >

                                                {skill}

                                            </span>

                                        )
                                    )}

                                </div>


                                {/* Status */}

                                <div className="mt-5">

                                    <p className="text-gray-300 text-sm mb-2">

                                        Application Status

                                    </p>


                                    <span

                                        className={

                                            app.status ===
                                            "Accepted"

                                                ? "bg-green-600 px-4 py-2 rounded-full font-bold"

                                                : app.status ===
                                                  "Rejected"

                                                ? "bg-red-600 px-4 py-2 rounded-full font-bold"

                                                : "bg-yellow-400 text-black px-4 py-2 rounded-full font-bold"

                                        }

                                    >

                                        {app.status ===
                                        "Accepted"

                                            ? "Accepted 🟢"

                                            : app.status ===
                                              "Rejected"

                                            ? "Rejected 🔴"

                                            : "Pending 🟡"}

                                    </span>

                                </div>


                                {/* Applied Date */}

                                <p className="text-gray-400 text-sm mt-5">

                                    Applied On:{" "}

                                    {app.appliedAt
                                        ? new Date(
                                              app.appliedAt
                                          ).toLocaleDateString()
                                        : "N/A"}

                                </p>


                                {/* Withdraw */}

                                {app.status !==
                                    "Accepted" &&
                                    app.status !==
                                    "Rejected" && (

                                    <button

                                        onClick={() =>
                                            withdrawApplication(
                                                app._id
                                            )
                                        }

                                        className="mt-6 w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl text-sm font-bold transition"

                                    >

                                        Withdraw Application

                                    </button>

                                )}

                            </motion.div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}

export default MyApplications;
