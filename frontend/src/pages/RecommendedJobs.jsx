import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function RecommendedJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchRecommendedJobs = async () => {

            try {

                const user = JSON.parse(
                    localStorage.getItem("user")
                );

                console.log("CURRENT USER:", user);

                if (!user) {

                    console.log("User not found");

                    setLoading(false);

                    return;
                }

                // IMPORTANT
                const userId = user._id || user.id;

                console.log("USER ID:", userId);

                if (!userId) {

                    console.log("User ID missing");

                    setLoading(false);

                    return;
                }

                const apiBase = window.location.hostname === "localhost"
                    ? "http://localhost:5000/api"
                    : "https://smarthire-ai-vm20.onrender.com/api";

                let res;
                try {
                    res = await axios.get(`${apiBase}/recommendations/${userId}`);
                } catch (err) {
                    res = await axios.get(`https://smarthire-ai-vm20.onrender.com/api/recommendations/${userId}`);
                }

                console.log(
                    "RECOMMENDATION RESPONSE:",
                    res.data
                );

                setJobs(
                    res.data.recommendations || []
                );

                setLoading(false);

            }

            catch (error) {

                console.log(
                    "RECOMMENDATION ERROR:",
                    error
                );

                setLoading(false);

            }

        };

        fetchRecommendedJobs();

    }, []);


    // =====================================
    // APPLY JOB
    // =====================================

    const handleApply = async (jobId) => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            const userId = user._id || user.id;

            const apiBase = window.location.hostname === "localhost"
                ? "http://localhost:5000/api"
                : "https://smarthire-ai-vm20.onrender.com/api";

            const targetJob = jobs.find((j) => j._id === jobId);

            let res;
            try {
                res = await axios.post(
                    `${apiBase}/applications/apply`,
                    {
                        userId,
                        jobId,
                        jobData: targetJob ? {
                            title: targetJob.title,
                            company: targetJob.company,
                            location: targetJob.location,
                            salary: targetJob.salary,
                            description: targetJob.description,
                            skills: targetJob.skills,
                            jobType: targetJob.jobType,
                            isExternal: targetJob.isExternal || targetJob.source === "Adzuna" || false,
                            source: targetJob.source || "Adzuna",
                            redirect_url: targetJob.redirect_url || ""
                        } : undefined
                    }
                );
            } catch (err) {
                res = await axios.post(
                    "https://smarthire-ai-vm20.onrender.com/api/applications/apply",
                    {
                        userId,
                        jobId,
                        jobData: targetJob
                    }
                );
            }

            alert(
                res.data.message ||
                "Application Submitted Successfully 🚀"
            );

        }

        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||
                "Application failed"

            );

        }

    };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                <h1 className="text-3xl animate-pulse">

                    🤖 Finding Best Jobs...

                </h1>

            </div>

        );

    }


    // =====================================
    // UI
    // =====================================

    return (

            <div className="min-h-screen bg-black text-white p-6 md:p-10">

            <div className="max-w-7xl mx-auto">

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

                    <h1 className="text-4xl md:text-5xl font-bold">

                        🤖 AI Recommended
                        <span className="text-purple-500">
                            Jobs
                        </span>

                    </h1>

                    <p className="text-gray-400 mt-3">

                        Jobs matched according to your
                        resume skills

                    </p>

                </motion.div>


                {jobs.length === 0 ? (

                    <div className="bg-zinc-900 rounded-3xl p-12 text-center">

                        <h2 className="text-3xl font-bold">

                            No Recommended Jobs

                        </h2>

                        <p className="text-gray-400 mt-3">

                            Try adding more skills to your
                            profile.

                        </p>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                        {jobs.map((job, index) => {

                            const matchedSkills =
                                job.matchedSkills || [];

                            const missingSkills =
                                (job.skills || []).filter(
                                    skill =>
                                        !matchedSkills.some(
                                            matched =>
                                                matched.toLowerCase() ===
                                                skill.toLowerCase()
                                        )
                                );

                            return (

                                <motion.div

                                    key={job._id}

                                    initial={{
                                        opacity: 0,
                                        y: 40
                                    }}

                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}

                                    transition={{
                                        delay: index * 0.1
                                    }}

                                    className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-purple-500/40"

                                >

                                    <div className="flex justify-between items-start">

                                        <div>

                                            <h2 className="text-xl font-bold leading-snug">

                                                {job.title}

                                            </h2>

                                            <p className="text-purple-400 mt-2">

                                                {job.company}

                                            </p>

                                        </div>

                                        <span className="bg-purple-600/90 px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">

                                            {job.matchScore}%

                                        </span>

                                    </div>


                                    <div className="mt-4 space-y-2 text-sm text-gray-300">

                                            <p className="line-clamp-3 leading-relaxed">
                                            📍 {job.location}
                                        </p>

                                        <p>
                                            💰 {job.salary}
                                        </p>

                                        <p>
                                            {job.description}
                                        </p>

                                    </div>


                                    {/* Match Score */}

                                    <div className="mt-5">

                                        <div className="flex justify-between mb-2">

                                            <span>
                                                AI Match Score
                                            </span>

                                            <span className="font-bold text-purple-400">

                                                {job.matchScore}%

                                            </span>

                                        </div>

                                        <div className="w-full bg-gray-700 rounded-full h-2">

                                            <div

                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"

                                                style={{
                                                    width: `${job.matchScore}%`
                                                }}

                                            />

                                        </div>

                                    </div>


                                    {/* Matched Skills */}

                                    <div className="mt-5">

                                        <h3 className="text-sm font-bold mb-2">

                                            Matched Skills ✅

                                        </h3>

                                        <div className="flex flex-wrap gap-2">

                                            {matchedSkills.map(
                                                (skill, i) => (

                                                    <span

                                                        key={i}

                                                        className="px-3 py-1 text-xs bg-green-600/20 text-green-400 rounded-full border border-green-500/40"

                                                    >

                                                        ✓ {skill}

                                                    </span>

                                                )
                                            )}

                                        </div>

                                    </div>


                                    {/* Missing Skills */}

                                    <div className="mt-5">

                                        <h3 className="text-sm font-bold mb-2">

                                            Skills To Improve ❌

                                        </h3>

                                        <div className="flex flex-wrap gap-2">

                                            {missingSkills.map(
                                                (skill, i) => (

                                                    <span

                                                        key={i}

                                                        className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded-full border border-red-500/40"

                                                    >

                                                        {skill}

                                                    </span>

                                                )
                                            )}

                                        </div>

                                    </div>


                                    {/* Apply */}

                                    <button

                                        onClick={() =>
                                            handleApply(job._id)
                                        }

                                        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition"

                                    >

                                        Apply Now 🚀

                                    </button>

                                </motion.div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>

    );

}

export default RecommendedJobs;
