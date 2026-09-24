import {
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";

import {
    motion
} from "framer-motion";

import {
    useParams
} from "react-router-dom";

function AIInterview() {

    const { id } = useParams();

    // ==========================================
    // STATES
    // ==========================================

    const [interview, setInterview] =
        useState(null);

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [answer, setAnswer] =
        useState("");

    const [timeLeft, setTimeLeft] =
        useState(60);

    const [cameraOn, setCameraOn] =
        useState(false);

    const [micOn, setMicOn] =
        useState(false);

    const [started, setStarted] =
        useState(false);

    const [warningCount, setWarningCount] =
        useState(0);

    const [warning, setWarning] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [mediaNotice, setMediaNotice] =
        useState("");


    // ==========================================
    // REFS
    // ==========================================

    const videoRef =
        useRef(null);

    const streamRef =
        useRef(null);


    // ==========================================
    // FETCH INTERVIEW
    // ==========================================

    useEffect(() => {

        if (!id) {

            console.log(
                "❌ Interview ID missing"
            );

            return;
        }


        const fetchInterview = async () => {

            try {

                console.log(
                    "Interview ID:",
                    id
                );


                const res =
                    await axios.get(
                        `https://smarthire-ai-vm20.onrender.com/api/interview/${id}`
                    );


                console.log(
                    "✅ Interview Loaded:",
                    res.data
                );


                setInterview(
                    res.data.interview
                );


            } catch (error) {

                console.log(
                    "❌ Interview Error:",
                    error.response?.data ||
                    error.message
                );

            }

        };


        fetchInterview();

    }, [id]);


    // ==========================================
    // CLEANUP MEDIA STREAM ON UNMOUNT
    // ==========================================

    useEffect(() => {

        return () => {

            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach((track) => {

                        try {

                            track.stop();

                        } catch (e) {}

                    });

                streamRef.current = null;

            }

        };

    }, []);


    // ==========================================
    // CAMERA + MICROPHONE (FAULT-TOLERANT)
    // ==========================================

    const startCamera = async () => {

        setMediaNotice("");

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {

            alert(
                "Media devices are not supported in this browser. Please use Chrome, Edge, or Firefox."
            );

            return false;

        }

        let combinedStream = new MediaStream();
        let videoSuccess = false;
        let audioSuccess = false;

        // --------------------------------------
        // 1. ATTEMPT CAMERA (VIDEO)
        // --------------------------------------
        try {

            const videoStream =
                await navigator.mediaDevices.getUserMedia({

                    video: {

                        width: { ideal: 640 },

                        height: { ideal: 480 },

                        facingMode: "user"

                    }

                });

            videoStream
                .getVideoTracks()
                .forEach((track) =>
                    combinedStream.addTrack(track)
                );

            videoSuccess = true;

            setCameraOn(true);

            console.log("✅ Camera started successfully");

        } catch (vErr) {

            console.warn("⚠️ High-res video failed, trying basic video:", vErr);

            try {

                const basicVideoStream =
                    await navigator.mediaDevices.getUserMedia({

                        video: true

                    });

                basicVideoStream
                    .getVideoTracks()
                    .forEach((track) =>
                        combinedStream.addTrack(track)
                    );

                videoSuccess = true;

                setCameraOn(true);

                console.log("✅ Basic camera started successfully");

            } catch (err2) {

                console.error("❌ Camera Error:", err2);

                setCameraOn(false);

                if (
                    err2.name === "NotAllowedError" ||
                    err2.name === "PermissionDeniedError"
                ) {

                    alert(
                        "Camera permission was denied. Please allow camera access in your browser settings (click the lock/camera icon in your address bar)."
                    );

                    return false;

                } else if (err2.name === "NotReadableError") {

                    alert(
                        "Camera is already in use by another application (Zoom, Teams, Discord, etc.). Please close other apps and try again."
                    );

                    return false;

                } else if (
                    err2.name === "NotFoundError" ||
                    err2.name === "DevicesNotFoundError"
                ) {

                    alert(
                        "No camera device was found. Please connect a webcam to continue."
                    );

                    return false;

                }

            }

        }

        // --------------------------------------
        // 2. ATTEMPT MICROPHONE (AUDIO)
        // Handled separately so NotReadableError doesn't block the interview
        // --------------------------------------
        try {

            const audioStream =
                await navigator.mediaDevices.getUserMedia({

                    audio: {

                        echoCancellation: true,

                        noiseSuppression: true

                    }

                });

            audioStream
                .getAudioTracks()
                .forEach((track) =>
                    combinedStream.addTrack(track)
                );

            audioSuccess = true;

            setMicOn(true);

            console.log("✅ Microphone started successfully");

        } catch (aErr) {

            // Default audio source busy, try basic audio
            try {

                const basicAudioStream =
                    await navigator.mediaDevices.getUserMedia({

                        audio: true

                    });

                basicAudioStream
                    .getAudioTracks()
                    .forEach((track) =>
                        combinedStream.addTrack(track)
                    );

                audioSuccess = true;

                setMicOn(true);

                console.log("✅ Basic microphone started successfully");

            } catch (err2) {

                // Audio source busy, automatically searching for alternative devices
                console.log("ℹ️ Default microphone busy, checking alternative audio devices...");

                // Try other audio devices if available
                let altAudioTrack = null;

                try {

                    const devices =
                        await navigator.mediaDevices.enumerateDevices();

                    const audioInputs =
                        devices.filter(
                            (d) => d.kind === "audioinput" && d.deviceId
                        );

                    for (const dev of audioInputs) {

                        try {

                            const altStream =
                                await navigator.mediaDevices.getUserMedia({

                                    audio: {
                                        deviceId: { exact: dev.deviceId }
                                    }

                                });

                            if (altStream.getAudioTracks().length > 0) {

                                altAudioTrack =
                                    altStream.getAudioTracks()[0];

                                break;

                            }

                        } catch (devErr) {

                            // Try next device

                        }

                    }

                } catch (enumErr) {

                    console.warn("Could not enumerate audio devices:", enumErr);

                }

                if (altAudioTrack) {

                    combinedStream.addTrack(altAudioTrack);

                    audioSuccess = true;

                    setMicOn(true);

                    console.log("✅ Alternative microphone started successfully");

                } else {

                    setMicOn(false);

                    setMediaNotice(
                        "Microphone could not be started (it may be in use by another app like Zoom, Teams, or another browser tab). Proceeding with camera."
                    );

                    console.log(
                        "ℹ️ Continuing with camera only as microphone source is unavailable"
                    );

                }

            }

        }

        // --------------------------------------
        // 3. EVALUATE STREAM
        // --------------------------------------
        if (videoSuccess) {

            streamRef.current =
                combinedStream;

            return true;

        }

        if (!videoSuccess && !audioSuccess) {

            alert(
                "Could not access your camera. Please ensure camera permissions are granted and no other application is using it."
            );

            return false;

        }

        streamRef.current =
            combinedStream;

        return true;

    };


    // ==========================================
    // ATTACH CAMERA STREAM
    // ==========================================

    useEffect(() => {

        if (
            started &&
            videoRef.current &&
            streamRef.current
        ) {

            videoRef.current.srcObject =
                streamRef.current;


            videoRef.current
                .play()
                .catch((error) => {

                    console.log(
                        "Video play error:",
                        error
                    );

                });

        }

    }, [started]);


    // ==========================================
    // FULLSCREEN
    // ==========================================

    const enterFullscreen = async () => {

        try {

            if (!document.fullscreenElement) {

                await document
                    .documentElement
                    .requestFullscreen();

            }

        } catch (error) {

            console.log(
                "❌ Fullscreen Error:",
                error
            );

        }

    };


    // ==========================================
    // START INTERVIEW
    // ==========================================

    const startInterview = async () => {

        const permissionGranted =
            await startCamera();


        if (!permissionGranted) {

            return;

        }


        await enterFullscreen();


        setStarted(true);

        setTimeLeft(60);

    };


    // ==========================================
    // TIMER
    // ==========================================

    useEffect(() => {

        if (
            !started ||
            !interview
        ) {

            return;

        }


        if (timeLeft <= 0) {

            submitAnswer();

            return;

        }


        const timer =
            setInterval(() => {

                setTimeLeft(
                    (prev) => prev - 1
                );

            }, 1000);


        return () => {

            clearInterval(timer);

        };

    }, [
        started,
        timeLeft,
        interview
    ]);


    // ==========================================
    // VIOLATION
    // ==========================================

    const handleViolation =
        (message) => {

            setWarning(message);


            setWarningCount(
                (prev) => {

                    const newCount =
                        prev + 1;


                    if (newCount >= 3) {

                        alert(
                            "Interview terminated due to multiple suspicious activities."
                        );


                        endInterview();

                    }


                    return newCount;

                }
            );


            setTimeout(() => {

                setWarning("");

            }, 4000);

        };


    // ==========================================
    // TAB SWITCH DETECTION
    // ==========================================

    useEffect(() => {

        if (!started) {

            return;

        }


        const handleVisibility =
            () => {

                if (document.hidden) {

                    handleViolation(
                        "Tab switching detected!"
                    );

                }

            };


        const handleBlur =
            () => {

                handleViolation(
                    "Interview window left!"
                );

            };


        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );


        window.addEventListener(
            "blur",
            handleBlur
        );


        return () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );


            window.removeEventListener(
                "blur",
                handleBlur
            );

        };

    }, [started]);


    // ==========================================
    // DISABLE COPY / PASTE
    // ==========================================

    useEffect(() => {

        if (!started) {

            return;

        }


        const disableContextMenu =
            (e) => {

                e.preventDefault();

            };


        const disableCopy =
            (e) => {

                e.preventDefault();

            };


        const disablePaste =
            (e) => {

                e.preventDefault();


                handleViolation(
                    "Paste is disabled during the interview."
                );

            };


        document.addEventListener(
            "contextmenu",
            disableContextMenu
        );


        document.addEventListener(
            "copy",
            disableCopy
        );


        document.addEventListener(
            "paste",
            disablePaste
        );


        return () => {

            document.removeEventListener(
                "contextmenu",
                disableContextMenu
            );


            document.removeEventListener(
                "copy",
                disableCopy
            );


            document.removeEventListener(
                "paste",
                disablePaste
            );

        };

    }, [started]);


    // ==========================================
    // SUBMIT ANSWER
    // ==========================================

    const submitAnswer = async () => {

        if (!interview) {

            return;

        }


        if (submitting) {

            return;

        }


        const question =
            interview.questions[
                currentQuestion
            ];


        if (!question) {

            console.log(
                "❌ Question not found"
            );

            return;

        }


        if (
            !answer ||
            answer.trim() === ""
        ) {

            alert(
                "Please enter your answer."
            );

            return;

        }


        try {

            setSubmitting(true);


            console.log(
                "📝 Submitting:",
                {
                    interviewId: id,

                    questionIndex:
                        currentQuestion,

                    answer:
                        answer
                }
            );


            // ==================================
            // SUBMIT ANSWER TO BACKEND
            // ==================================

            const res =
                await axios.put(

                    `https://smarthire-ai-vm20.onrender.com/api/interview/answer/${id}`,

                    {
                        questionIndex:
                            currentQuestion,

                        answer:
                            answer.trim()
                    }

                );


            console.log(
                "✅ Answer Submitted:",
                res.data
            );


            // ==================================
            // NEXT QUESTION
            // ==================================

            if (
                currentQuestion <
                interview.questions.length - 1
            ) {

                setCurrentQuestion(
                    (prev) => prev + 1
                );


                setAnswer("");


                setTimeLeft(60);

            }


            // ==================================
            // LAST QUESTION
            // ==================================

            else {

                try {

                    const completeResponse =
                        await axios.put(

                            `https://smarthire-ai-vm20.onrender.com/api/interview/complete/${id}`

                        );


                    console.log(
                        "✅ Interview Completed:",
                        completeResponse.data
                    );


                } catch (completeError) {

                    console.log(
                        "❌ Complete Error:",
                        completeError.response?.data ||
                        completeError.message
                    );

                }


                alert(
                    "🎉 Interview Completed Successfully!"
                );


                endInterview();

            }


        } catch (error) {

            console.log(
                "❌ Submit Answer Error:",
                error.response?.data ||
                error.message
            );


            alert(

                error.response?.data?.message ||

                "Failed to submit answer"

            );

        } finally {

            setSubmitting(false);

        }

    };


    // ==========================================
    // END INTERVIEW
    // ==========================================

    const endInterview = () => {

        setStarted(false);


        // --------------------------------------
        // STOP CAMERA + MICROPHONE
        // --------------------------------------

        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach((track) => {

                    track.stop();

                });


            streamRef.current = null;

        }


        // Remove video stream
        if (videoRef.current) {

            videoRef.current.srcObject =
                null;

        }


        setCameraOn(false);

        setMicOn(false);


        // --------------------------------------
        // EXIT FULLSCREEN
        // --------------------------------------

        if (
            document.fullscreenElement
        ) {

            document
                .exitFullscreen()
                .catch(() => {});

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (!interview) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl">

                Loading AI Interview 🤖...

            </div>

        );

    }


    // ==========================================
    // CURRENT QUESTION
    // ==========================================

    const question =
        interview.questions[
            currentQuestion
        ];


    // ==========================================
    // START SCREEN
    // ==========================================

    if (!started) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

                <motion.div

                    initial={{
                        opacity: 0,
                        scale: 0.9
                    }}

                    animate={{
                        opacity: 1,
                        scale: 1
                    }}

                    className="max-w-2xl w-full bg-white/10 border border-purple-500/30 rounded-3xl p-10 text-center"

                >

                    <div className="text-6xl mb-5">

                        🤖

                    </div>


                    <h1 className="text-4xl font-bold mb-4">

                        AI Interview

                    </h1>


                    <p className="text-gray-400 mb-8">

                        Camera, microphone and fullscreen
                        are required.

                    </p>


                    {mediaNotice && (

                        <div className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm px-4 py-3 rounded-xl mb-6 text-left">

                            ⚠️ {mediaNotice}

                        </div>

                    )}


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">


                        <div className="bg-black/40 p-5 rounded-2xl">

                            <div className="text-2xl">

                                ⏱️

                            </div>

                            <h3 className="font-bold mt-2">

                                60 Seconds

                            </h3>

                            <p className="text-sm text-gray-400">

                                Per question

                            </p>

                        </div>


                        <div className="bg-black/40 p-5 rounded-2xl">

                            <div className="text-2xl">

                                🎥

                            </div>

                            <h3 className="font-bold mt-2">

                                Camera Required

                            </h3>

                        </div>


                        <div className="bg-black/40 p-5 rounded-2xl">

                            <div className="text-2xl">

                                🎤

                            </div>

                            <h3 className="font-bold mt-2">

                                Microphone Required

                            </h3>

                        </div>


                        <div className="bg-black/40 p-5 rounded-2xl">

                            <div className="text-2xl">

                                🚨

                            </div>

                            <h3 className="font-bold mt-2">

                                Anti-Cheating

                            </h3>

                        </div>


                    </div>


                    <button

                        onClick={startInterview}

                        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-bold text-lg"

                    >

                        Start Interview 🚀

                    </button>


                </motion.div>

            </div>

        );

    }


    // ==========================================
    // INTERVIEW SCREEN
    // ==========================================

    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-10">


            {/* =================================
                WARNING
            ================================= */}

            {warning && (

                <motion.div

                    initial={{
                        opacity: 0,
                        y: -30
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}

                    className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-red-600 px-8 py-4 rounded-xl font-bold text-center"

                >

                    🚨 {warning}

                    <br />

                    <span className="text-sm">

                        Warning {warningCount}/3

                    </span>

                </motion.div>

            )}


            <div className="max-w-4xl mx-auto">


                {mediaNotice && (

                    <div className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm px-4 py-3 rounded-xl mb-6 text-center">

                        ⚠️ {mediaNotice}

                    </div>

                )}


                {/* =================================
                    HEADER
                ================================= */}

                <div className="flex justify-between items-center mb-8">


                    <div>

                        <h1 className="text-4xl font-bold">

                            🤖 AI Interview

                        </h1>


                        <p className="text-gray-400">

                            Question{" "}

                            {currentQuestion + 1}

                            {" "}of{" "}

                            {interview.questions.length}

                        </p>

                    </div>


                    <div

                        className={`text-3xl font-bold ${
                            timeLeft <= 10
                                ? "text-red-500"
                                : "text-purple-400"
                        }`}

                    >

                        ⏱️ 00:

                        {String(
                            timeLeft
                        ).padStart(
                            2,
                            "0"
                        )}

                    </div>

                </div>


                {/* =================================
                    STATUS CARDS
                ================================= */}

                <div className="grid grid-cols-3 gap-4 mb-8">


                    <div className="bg-white/10 rounded-xl p-4 text-center">

                        <div className="text-2xl">

                            {cameraOn
                                ? "🟢"
                                : "🔴"}

                        </div>


                        Camera:{" "}

                        {cameraOn
                            ? "ON"
                            : "OFF"}

                    </div>


                    <div className="bg-white/10 rounded-xl p-4 text-center">

                        <div className="text-2xl">

                            {micOn
                                ? "🟢"
                                : "🔴"}

                        </div>


                        Microphone:{" "}

                        {micOn
                            ? "ON"
                            : "OFF"}

                    </div>


                    <div className="bg-white/10 rounded-xl p-4 text-center">

                        <div className="text-2xl">

                            🖥️

                        </div>

                        <p>

                            Fullscreen Required

                        </p>

                    </div>


                </div>


                {/* =================================
                    CAMERA PREVIEW
                ================================= */}

                <div className="flex justify-center mb-8">

                    <video

                        ref={videoRef}

                        autoPlay

                        muted

                        playsInline

                        className="w-64 h-48 object-cover rounded-2xl border-2 border-purple-500 bg-black"

                    />

                </div>


                {/* =================================
                    QUESTION CARD
                ================================= */}

                <motion.div

                    initial={{
                        opacity: 0,
                        y: 30
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}

                    className="bg-white/10 border border-purple-500/30 rounded-3xl p-8"

                >

                    <p className="text-gray-400 mb-3">

                        AI Interviewer

                    </p>


                    <h2 className="text-2xl font-bold mb-8">

                        {question?.question}

                    </h2>


                    <textarea

                        value={answer}

                        onChange={(e) =>
                            setAnswer(
                                e.target.value
                            )
                        }

                        placeholder="Type your answer here..."

                        className="w-full h-40 bg-black border border-white/20 rounded-xl p-4 outline-none focus:border-purple-500"

                    />


                    <button

                        onClick={submitAnswer}

                        disabled={submitting}

                        className={`mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-bold ${
                            submitting
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}

                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit & Next →"}

                    </button>


                </motion.div>


                {/* =================================
                    WARNING TEXT
                ================================= */}

                <p className="text-center text-yellow-400 mt-6">

                    ⚠️ Do not switch tabs or leave fullscreen.

                </p>


            </div>

        </div>

    );

}

export default AIInterview;