import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Invalid user data:", error);
                    localStorage.removeItem("user");
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        loadUser();

        window.addEventListener("storage", loadUser);

        return () => {
            window.removeEventListener("storage", loadUser);
        };
    }, [location.pathname]);

    const logout = () => {
        // Clear authentication/user data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        // Clear Navbar user state
        setUser(null);

        // Always return to public Home after logout
        navigate("/");
    };

    return (
        <nav className="bg-zinc-950 border-b border-zinc-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-10 py-5 flex justify-between items-center">

                {/* Logo */}
                <Link to="/">
                    <h1 className="text-3xl font-bold">
                        Smart
                        <span className="text-purple-500">
                            Hire-AI
                        </span>
                    </h1>
                </Link>

                {/* Menu */}
                <div className="flex items-center gap-6">

                    {/* Home */}
                    <Link
                        to="/"
                        className="hover:text-purple-400 transition"
                    >
                        Home
                    </Link>

                    {/* Jobs */}
                    <Link
                        to="/jobs"
                        className="hover:text-purple-400 transition"
                    >
                        Jobs
                    </Link>

                    {/* Candidate */}
                    {user?.role === "candidate" && (
                        <>
                            <Link
                                to="/dashboard"
                                className="hover:text-purple-400 transition"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/recommended-jobs"
                                className="hover:text-purple-400 transition"
                            >
                                AI Jobs
                            </Link>

                            <Link
                                to="/myapplications"
                                className="hover:text-purple-400 transition"
                            >
                                Applications
                            </Link>

                            <Link
                                to="/candidate-profile"
                                className="hover:text-purple-400 transition"
                            >
                                Profile
                            </Link>

                            <Link
                                to="/notifications"
                                className="hover:text-yellow-400 transition"
                            >
                                🔔 Notifications
                            </Link>
                        </>
                    )}

                    {/* Recruiter */}
                    {user?.role === "recruiter" && (
                        <>
                            <Link
                                to="/recruiter-dashboard"
                                className="hover:text-purple-400 transition"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/create-job"
                                className="hover:text-purple-400 transition"
                            >
                                Create Job
                            </Link>

                            <Link
                                to="/notifications"
                                className="hover:text-yellow-400 transition"
                            >
                                🔔 Notifications
                            </Link>
                        </>
                    )}

                    {/* Right Side */}
                    {user ? (
                        <>
                            <span className="text-purple-400 font-semibold">
                                👋 {user.name}
                            </span>

                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="border border-purple-500 hover:bg-purple-600 px-5 py-2 rounded-xl transition">
                                    Login
                                </button>
                            </Link>

                            <Link to="/signup">
                                <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 rounded-xl">
                                    Signup
                                </button>
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;