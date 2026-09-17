import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    bio: "",
    education: "",
    experience: "",
    github: "",
    linkedin: "",
    skills: "",
  });

  // ==========================================
  // GET USER ID
  // ==========================================

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      return (
        user?._id ||
        user?.id ||
        localStorage.getItem("userId")
      );
    } catch (error) {
      return localStorage.getItem("userId");
    }
  };

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const userId = getUserId();

      console.log("👤 Profile User ID:", userId);

      if (!userId) {
        alert("User ID not found. Please login again.");
        return;
      }

      const res = await axios.get(
        `https://smarthire-ai-vm20.onrender.com/api/users/profile/${userId}`
      );

      console.log("✅ Profile Response:", res.data);

      const data = res.data.user || res.data;

      setProfile(data);

      setForm({
        phone: data.phone || "",
        bio: data.bio || "",
        education: data.education || "",
        experience: data.experience || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        skills: Array.isArray(data.skills)
          ? data.skills.join(", ")
          : data.skills || "",
      });
    } catch (error) {
      console.log("❌ Profile Error:", error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const saveProfile = async () => {
    try {
      const userId = getUserId();

      if (!userId) {
        alert("User ID not found. Please login again.");
        return;
      }

      setSaving(true);

      const updatedData = {
        phone: form.phone.trim(),
        bio: form.bio.trim(),
        education: form.education.trim(),
        experience: form.experience.trim(),
        github: form.github.trim(),
        linkedin: form.linkedin.trim(),

        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
      };

      console.log("📝 Updating Profile:", updatedData);

      const res = await axios.put(
        `https://smarthire-ai-vm20.onrender.com/api/users/profile/${userId}`,
        updatedData
      );

      console.log("✅ Profile Updated:", res.data);

      const updatedUser =
        res.data.user || res.data;

      setProfile(updatedUser);

      setForm({
        phone: updatedUser.phone || "",
        bio: updatedUser.bio || "",
        education: updatedUser.education || "",
        experience: updatedUser.experience || "",
        github: updatedUser.github || "",
        linkedin: updatedUser.linkedin || "",
        skills: Array.isArray(updatedUser.skills)
          ? updatedUser.skills.join(", ")
          : "",
      });

      // Update localStorage user data
      const oldUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (oldUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...oldUser,
            ...updatedUser,
          })
        );
      }

      setEditing(false);

      alert("Profile Updated Successfully 🚀");
    } catch (error) {
      console.log(
        "❌ Update Profile Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl animate-pulse">
          Loading Profile 👤
        </h1>
      </div>
    );
  }

  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-5">
        <h1 className="text-2xl">
          Unable to load profile ❌
        </h1>

        <button
          onClick={fetchProfile}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"
        >
          Try Again 🔄
        </button>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      {/* Background Glow */}

      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-96 h-96 bg-pink-600/20 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl"
      >

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Candidate Profile 👨‍💻
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your SmartHire-AI profile
            </p>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"
            >
              Edit ✏️
            </button>
          ) : (
            <div className="flex gap-3">

              <button
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
                disabled={saving}
                className="bg-gray-600 hover:bg-gray-700 px-5 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save 💾"}
              </button>

            </div>
          )}

        </div>

        {/* BASIC INFO */}

        <div className="mb-8 bg-black/40 rounded-2xl p-6 border border-white/10">

          <h2 className="text-xl font-semibold mb-4">
            Basic Information
          </h2>

          <p className="text-xl">
            👤 {profile.name || "Candidate"}
          </p>

          <p className="text-gray-400 mt-2">
            📧 {profile.email || "No email"}
          </p>

        </div>

        {/* FORM */}

        <div className="grid md:grid-cols-2 gap-5">

          {/* PHONE */}

          <div>
            <label className="block mb-2 font-semibold">
              📱 Phone
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter phone number"
              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500 disabled:opacity-60"
            />
          </div>

          {/* EDUCATION */}

          <div>
            <label className="block mb-2 font-semibold">
              🎓 Education
            </label>

            <input
              name="education"
              value={form.education}
              onChange={handleChange}
              disabled={!editing}
              placeholder="B.Tech CSE"
              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500 disabled:opacity-60"
            />
          </div>

          {/* EXPERIENCE */}

          <div>
            <label className="block mb-2 font-semibold">
              💼 Experience
            </label>

            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Fresher / 1 year"
              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500 disabled:opacity-60"
            />
          </div>

          {/* SKILLS */}

          <div>
            <label className="block mb-2 font-semibold">
              🛠️ Skills
            </label>

            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              disabled={!editing}
              placeholder="React, Node.js, MongoDB, Java"
              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500 disabled:opacity-60"
            />

            <p className="text-gray-500 text-sm mt-1">
              Separate skills using commas
            </p>
          </div>

          {/* GITHUB */}

          <div>
            <label className="block mb-2 font-semibold">
              🐙 GitHub
            </label>

            <input
              name="github"
              value={form.github}
              onChange={handleChange}
              disabled={!editing}
              placeholder="https://github.com/username"
              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500 disabled:opacity-60"
            />
          </div>

          {/* LINKEDIN */}

          <div>
            <label className="block mb-2 font-semibold">
              💼 LinkedIn
            </label>

            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              disabled={!editing}
              placeholder="https://linkedin.com/in/username"
              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500 disabled:opacity-60"
            />
          </div>

          {/* BIO */}

          <div className="md:col-span-2">

            <label className="block mb-2 font-semibold">
              📝 Bio
            </label>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Tell recruiters about yourself..."
              rows="5"
              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500 disabled:opacity-60"
            />

          </div>

        </div>

        {/* SKILL PREVIEW */}

        {profile.skills?.length > 0 && !editing && (

          <div className="mt-8">

            <h2 className="text-xl font-bold mb-4">
              Your Skills 🛠️
            </h2>

            <div className="flex flex-wrap gap-3">

              {profile.skills.map((skill, index) => (

                <span
                  key={index}
                  className="px-4 py-2 bg-purple-600/30 border border-purple-500/40 rounded-full text-purple-200"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        )}

      </motion.div>

    </div>
  );
}

export default CandidateProfile;