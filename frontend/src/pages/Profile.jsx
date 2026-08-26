import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Profile() {

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        education: "",
        experience: "",
        github: "",
        linkedin: "",
        skills: []
    });

    const [skillInput, setSkillInput] = useState("");

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        axios
            .get(`http://localhost:5000/api/users/${user.id}`)
            .then((res) => {

                setProfile(res.data);
                setSkillInput(res.data.skills.join(", "));

            })
            .catch((err) => console.log(err));

    }, []);

    const handleChange = (e) => {

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };

    const updateProfile = async () => {

        const user = JSON.parse(localStorage.getItem("user"));

        try {

            const res = await axios.put(

                `http://localhost:5000/api/users/update/${user.id}`,

                {

                    ...profile,

                    skills: skillInput
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(skill => skill !== "")

                }

            );

            alert("Profile Updated Successfully 🚀");

            setProfile(res.data.user);

        }

        catch (err) {

            console.log(err);

            alert("Update Failed");

        }

    };

    return (

        <div className="min-h-screen bg-black text-white p-10">

            <div className="max-w-4xl mx-auto">

                <motion.h1

                    initial={{ opacity: 0, y: -30 }}

                    animate={{ opacity: 1, y: 0 }}

                    className="text-5xl font-bold mb-10"

                >

                    My <span className="text-purple-500">Profile</span>

                </motion.h1>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-5">

                    <input
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        placeholder="Name"
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        name="email"
                        value={profile.email}
                        disabled
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                    />

                    <textarea
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        rows="3"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        name="education"
                        value={profile.education}
                        onChange={handleChange}
                        placeholder="Education"
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        name="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        placeholder="Experience"
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        name="github"
                        value={profile.github}
                        onChange={handleChange}
                        placeholder="GitHub"
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        name="linkedin"
                        value={profile.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn"
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black border border-gray-700"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="React, Java, Node, MongoDB"
                    />

                    <button

                        onClick={updateProfile}

                        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold"

                    >

                        Save Changes 🚀

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Profile;