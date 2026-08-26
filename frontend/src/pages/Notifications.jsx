import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const userId = user?._id || user?.id;

    useEffect(() => {

        if (userId) {
            fetchNotifications();
        } else {
            setLoading(false);
        }

    }, [userId]);

    const fetchNotifications = async () => {

        try {

            const res = await axios.get(
                `http://localhost:5000/api/notifications/${userId}`
            );

            console.log("🔔 Notifications:", res.data);

            setNotifications(
                res.data.notifications || []
            );

        }

        catch (error) {

            console.log(
                "Notification Error:",
                error.response?.data || error.message
            );

        }

        finally {

            setLoading(false);

        }

    };

    const markAsRead = async (id) => {

        try {

            await axios.put(
                `http://localhost:5000/api/notifications/read/${id}`
            );

            fetchNotifications();

        }

        catch (error) {

            console.log(
                "Mark Read Error:",
                error.response?.data || error.message
            );

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                <h1 className="text-3xl animate-pulse">
                    Loading Notifications 🔔
                </h1>

            </div>

        );

    }

    if (!userId) {

        return (

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                <h1 className="text-2xl">
                    Please login first 🔐
                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-black text-white p-10">

            <div className="max-w-5xl mx-auto">

                <motion.h1
                    initial={{
                        opacity: 0,
                        y: -30
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="text-5xl font-bold mb-10"
                >
                    🔔 Notifications
                </motion.h1>


                {notifications.length === 0 ? (

                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-12 text-center">

                        <h2 className="text-3xl font-bold">
                            No Notifications Yet 🚀
                        </h2>

                        <p className="text-gray-400 mt-3">
                            Your application updates will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {notifications.map(
                            (notification, index) => (

                                <motion.div
                                    key={notification._id}

                                    initial={{
                                        opacity: 0,
                                        x: -30
                                    }}

                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}

                                    transition={{
                                        delay: index * 0.1
                                    }}

                                    className={`rounded-2xl p-6 border ${
                                        notification.isRead
                                            ? "bg-zinc-900 border-zinc-800"
                                            : "bg-purple-900/30 border-purple-500/40"
                                    }`}
                                >

                                    <div className="flex justify-between items-start gap-5">

                                        <div>

                                            <h2 className="text-2xl font-bold text-purple-400">
                                                {notification.title}
                                            </h2>

                                            <p className="text-gray-300 mt-3">
                                                {notification.message}
                                            </p>

                                            <p className="text-gray-500 text-sm mt-4">
                                                {notification.createdAt
                                                    ? new Date(
                                                        notification.createdAt
                                                    ).toLocaleString()
                                                    : ""}
                                            </p>

                                        </div>


                                        {!notification.isRead && (

                                            <button
                                                onClick={() =>
                                                    markAsRead(
                                                        notification._id
                                                    )
                                                }

                                                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl whitespace-nowrap"
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