import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const userId = user?._id || user?.id;


    // ==========================================
    // Fetch Notifications
    // ==========================================

    const fetchNotifications = async () => {

        if (!userId) {
            setLoading(false);
            return;
        }

        try {

            console.log("🔔 Logged in User:", user);
            console.log("🔔 User ID:", userId);
            console.log("🔔 Role:", user?.role);

            const response = await axios.get(
                `https://smarthire-ai-vm20.onrender.com/api/notifications/${userId}`
            );

            console.log(
                "🔔 Notification Response:",
                response.data
            );

            setNotifications(
                response.data.notifications || []
            );

        } catch (error) {

            console.log(
                "❌ Notification Error:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // Load Notifications
    // ==========================================

    useEffect(() => {

        fetchNotifications();

    }, [userId]);


    // ==========================================
    // Mark Notification Read
    // ==========================================

    const markAsRead = async (id) => {

        try {

            await axios.put(
                `https://smarthire-ai-vm20.onrender.com/api/notifications/read/${id}`
            );

            setNotifications(
                notifications.map(notification =>
                    notification._id === id
                        ? {
                            ...notification,
                            isRead: true
                        }
                        : notification
                )
            );

        } catch (error) {

            console.log(
                "❌ Mark Read Error:",
                error.response?.data || error.message
            );

        }

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                <div className="text-center">

                    <div className="text-5xl mb-4">
                        🔔
                    </div>

                    <h1 className="text-2xl font-semibold">
                        Loading Notifications...
                    </h1>

                </div>

            </div>

        );

    }


    // ==========================================
    // User Not Logged In
    // ==========================================

    if (!userId) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                <div className="text-center">

                    <div className="text-5xl mb-4">
                        🔐
                    </div>

                    <h1 className="text-2xl font-semibold">
                        Please login first
                    </h1>

                </div>

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-black text-white p-6 md:p-10">

            <div className="max-w-5xl mx-auto">


                {/* Header */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="mb-10"
                >

                    <h1 className="text-4xl md:text-5xl font-bold">

                        🔔 Notifications

                    </h1>

                    <p className="text-gray-400 mt-2">

                        Stay updated with your latest activities.

                    </p>

                </motion.div>



                {/* No Notifications */}

                {notifications.length === 0 ? (

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        className="bg-zinc-900 border border-white/10 rounded-2xl p-12 text-center"
                    >

                        <div className="text-6xl mb-5">
                            🔔
                        </div>

                        <h2 className="text-2xl font-bold">
                            No Notifications Yet
                        </h2>

                        <p className="text-gray-400 mt-2">
                            New application updates will appear here.
                        </p>

                    </motion.div>

                ) : (

                    /* Notifications List */

                    <div className="space-y-4">

                        {notifications.map(
                            (notification, index) => (

                                <motion.div
                                    key={notification._id}

                                    initial={{
                                        opacity: 0,
                                        y: 15
                                    }}

                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}

                                    transition={{
                                        delay: index * 0.08
                                    }}

                                    className={`
                                        rounded-2xl
                                        p-6
                                        border
                                        transition
                                        ${
                                            notification.isRead
                                                ? "bg-zinc-900 border-zinc-800"
                                                : "bg-purple-900/20 border-purple-500/40"
                                        }
                                    `}
                                >

                                    <div className="flex flex-col md:flex-row justify-between gap-5">


                                        {/* Notification Content */}

                                        <div className="flex gap-4">

                                            <div className="text-3xl">
                                                {notification.type === "Application"
                                                    ? "📩"
                                                    : notification.type === "Accepted"
                                                    ? "🎉"
                                                    : notification.type === "Rejected"
                                                    ? "❌"
                                                    : "🔔"
                                                }
                                            </div>


                                            <div>

                                                <h2 className="text-xl font-semibold text-purple-400">

                                                    {notification.title}

                                                </h2>


                                                <p className="text-gray-300 mt-2">

                                                    {notification.message}

                                                </p>


                                                <p className="text-gray-500 text-sm mt-3">

                                                    {notification.createdAt
                                                        ? new Date(
                                                            notification.createdAt
                                                        ).toLocaleString()
                                                        : ""
                                                    }

                                                </p>

                                            </div>

                                        </div>



                                        {/* Mark Read */}

                                        {!notification.isRead && (

                                            <button
                                                onClick={() =>
                                                    markAsRead(
                                                        notification._id
                                                    )
                                                }

                                                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg h-fit"
                                            >

                                                Mark as Read

                                            </button>

                                        )}

                                    </div>

                                </motion.div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}

export default Notifications;