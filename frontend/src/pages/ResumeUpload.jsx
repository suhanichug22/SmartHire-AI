import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ResumeUpload() {

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    // ==========================================
    // GET USER
    // ==========================================

    const storedUser =
        localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    // Support both MongoDB _id and id
    const userId =
        user?._id ||
        user?.id ||
        localStorage.getItem("userId");


    // ==========================================
    // FILE SELECT
    // ==========================================

    const handleFileChange = (e) => {

        const selectedFile =
            e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        // Only PDF
        if (
            selectedFile.type !==
            "application/pdf"
        ) {

            setMessage(
                "Please select a PDF file only."
            );

            setFile(null);

            return;
        }

        setFile(selectedFile);

        setMessage("");

    };


    // ==========================================
    // UPLOAD RESUME
    // ==========================================

    const uploadResume = async () => {

        // No file
        if (!file) {

            setMessage(
                "Please select a resume."
            );

            return;
        }


        // No user
        if (!user) {

            setMessage(
                "Please login again."
            );

            return;
        }


        // No user ID
        if (!userId) {

            setMessage(
                "User ID not found. Please login again."
            );

            return;
        }


        try {

            setUploading(true);

            setMessage("Uploading resume...");


            // ==================================
            // FORM DATA
            // ==================================

            const formData =
                new FormData();


            formData.append(
                "resume",
                file
            );


            formData.append(
                "userId",
                userId
            );


            console.log(
                "📄 Uploading Resume"
            );

            console.log(
                "User ID:",
                userId
            );

            console.log(
                "File:",
                file.name
            );


            // ==================================
            // API REQUEST
            // ==================================

            const res =
                await axios.post(

                    "https://smarthire-ai-vm20.onrender.com/api/resume/upload",

                    formData,

                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }

                );


            console.log(
                "✅ Resume Upload Response:",
                res.data
            );


            // ==================================
            // SAVE RESUME ID
            // ==================================

            const resumeId =
                res.data?.resume?._id;


            if (resumeId) {

                localStorage.setItem(
                    "resumeId",
                    resumeId
                );

            }


            // ==================================
            // SUCCESS
            // ==================================

            setMessage(
                "Resume uploaded successfully! 🎉"
            );


            // Go to analysis page
            setTimeout(() => {

                navigate(
                    "/resume-analysis"
                );

            }, 1000);


        } catch (error) {

            console.log(
                "❌ Resume Upload Error:",
                error.response?.data ||
                error.message
            );


            setMessage(

                error.response?.data?.message ||
                "Resume upload failed. Please try again."

            );

        } finally {

            setUploading(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-black text-white p-10 overflow-hidden relative">


            {/* BACKGROUND GLOW */}

            <motion.div

                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0]
                }}

                transition={{
                    duration: 8,
                    repeat: Infinity
                }}

                className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"

            />


            <motion.div

                animate={{
                    x: [0, -80, 0],
                    y: [0, 60, 0]
                }}

                transition={{
                    duration: 10,
                    repeat: Infinity
                }}

                className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"

            />


            <div className="relative max-w-5xl mx-auto">


                {/* TITLE */}

                <motion.h1

                    initial={{
                        opacity: 0,
                        y: -30
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}

                    transition={{
                        duration: 0.7
                    }}

                    className="text-5xl font-bold mb-4"

                >

                    Upload{" "}

                    <span className="text-purple-500">
                        Resume
                    </span>{" "}

                    📄

                </motion.h1>


                <p className="text-gray-400 mb-10">

                    Upload your resume and let
                    SmartHire-AI analyze your profile.

                </p>


                {/* MAIN CARD */}

                <motion.div

                    initial={{
                        opacity: 0,
                        scale: 0.9
                    }}

                    animate={{
                        opacity: 1,
                        scale: 1
                    }}

                    transition={{
                        duration: 0.6
                    }}

                    className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/30 rounded-3xl p-10 shadow-xl"

                >


                    {/* ICON */}

                    <motion.div

                        animate={{
                            y: [0, -15, 0]
                        }}

                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}

                        className="text-center text-7xl mb-6"

                    >

                        📄

                    </motion.div>


                    {/* FILE SELECT */}

                    <label

                        className="block border-2 border-dashed border-purple-500 rounded-2xl p-10 text-center cursor-pointer hover:bg-white/5 transition"

                    >

                        <input

                            type="file"

                            hidden

                            accept=".pdf,application/pdf"

                            onChange={
                                handleFileChange
                            }

                        />


                        {file ? (

                            <div>

                                <p className="text-purple-400 font-bold text-lg">

                                    📌 {file.name}

                                </p>

                                <p className="text-gray-500 text-sm mt-2">

                                    PDF selected successfully

                                </p>

                            </div>

                        ) : (

                            <div>

                                <p className="text-gray-300 text-lg">

                                    📤 Click here to select your resume

                                </p>

                                <p className="text-gray-500 text-sm mt-2">

                                    Only PDF files are supported

                                </p>

                            </div>

                        )}

                    </label>


                    {/* UPLOAD BUTTON */}

                    <motion.button

                        whileHover={{
                            scale: uploading ? 1 : 1.03
                        }}

                        whileTap={{
                            scale: uploading ? 1 : 0.97
                        }}

                        onClick={uploadResume}

                        disabled={uploading}

                        className={`mt-8 w-full py-3 rounded-xl font-bold transition ${
                            uploading
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                        }`}

                    >

                        {uploading
                            ? "Uploading... ⏳"
                            : "Upload Resume 🚀"}

                    </motion.button>


                    {/* MESSAGE */}

                    {message && (

                        <p
                            className={`mt-5 text-center font-bold ${
                                message.includes(
                                    "successfully"
                                )
                                    ? "text-green-400"
                                    : "text-yellow-400"
                            }`}
                        >

                            {message}

                        </p>

                    )}


                </motion.div>


                {/* INFO CARDS */}

                <div className="grid md:grid-cols-3 gap-5 mt-8">


                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">

                        <div className="text-2xl">
                            📄
                        </div>

                        <h3 className="font-semibold mt-2">
                            PDF Resume
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Upload your latest resume.
                        </p>

                    </div>


                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">

                        <div className="text-2xl">
                            🤖
                        </div>

                        <h3 className="font-semibold mt-2">
                            AI Analysis
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Analyze your resume automatically.
                        </p>

                    </div>


                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">

                        <div className="text-2xl">
                            🚀
                        </div>

                        <h3 className="font-semibold mt-2">
                            Better Opportunities
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Improve your job matching chances.
                        </p>

                    </div>


                </div>


            </div>

        </div>

    );
}

export default ResumeUpload;