import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Applicants() {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // FETCH APPLICANTS
  // ==========================================

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/applications/job/${jobId}`
      );

      console.log("✅ Applicants:", res.data);

      setApplicants(res.data.applicants || []);
    } catch (error) {
      console.log(
        "❌ Fetch Applicants Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD
  // ==========================================

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      console.log("Updating:", id, status);

      const res = await axios.put(
        `http://localhost:5000/api/applications/update/${id}`,
        {
          status,
        }
      );

      console.log("✅ Status Updated:", res.data);

      // Immediately update UI
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === id
            ? {
                ...app,
                status,
              }
            : app
        )
      );

      alert(
        status === "Accepted"
          ? "Application Accepted ✅"
          : "Application Rejected ❌"
      );
    } catch (error) {
      console.log(
        "❌ Status Update Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl animate-pulse">
          Loading Applicants 👥
        </h1>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: -40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10"
        >
          <h1 className="text-5xl font-bold">
            Applicants 👥
          </h1>

          <p className="text-gray-400 mt-3">
            Review candidates and manage their applications.
          </p>

          <p className="text-purple-400 mt-2">
            Total Applicants: {applicants.length}
          </p>
        </motion.div>

        {/* NO APPLICANTS */}

        {applicants.length === 0 ? (
          <div className="bg-white/10 border border-white/10 p-12 rounded-3xl text-center">

            <h2 className="text-3xl font-bold">
              No Applicants Found 📭
            </h2>

            <p className="text-gray-400 mt-3">
              No candidate has applied for this job yet.
            </p>

          </div>
        ) : (

          /* APPLICANT CARDS */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {applicants.map((app, index) => (

              <motion.div
                key={app._id}

                initial={{
                  opacity: 0,
                  y: 40,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: index * 0.1,
                }}

                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-xl"
              >

                {/* CANDIDATE */}

                <div>
                  <h2 className="text-2xl font-bold">
                    {app.userId?.name || "Candidate"}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    📧 {app.userId?.email || "No email"}
                  </p>
                </div>

                {/* JOB */}

                <div className="mt-6">

                  <h3 className="font-bold">
                    Applied For
                  </h3>

                  <p className="text-purple-400 mt-1">
                    {app.jobId?.title || "Job"}
                  </p>

                </div>

                {/* STATUS */}

                <div className="mt-6">

                  <h3 className="font-bold">
                    Application Status
                  </h3>

                  <span
                    className={`inline-block mt-2 px-4 py-2 rounded-full font-bold ${
                      app.status === "Accepted"
                        ? "bg-green-600"
                        : app.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {app.status || "Pending"}
                  </span>

                </div>

                {/* RESUME */}

                {app.resume && (
                  <a
                    href={`http://localhost:5000/${app.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-6 text-purple-400 hover:text-purple-300 underline"
                  >
                    📄 View Resume
                  </a>
                )}

                {/* ACTIONS */}

                <div className="flex gap-3 mt-7">

                  {/* ACCEPT */}

                  <button
                    disabled={
                      updatingId === app._id ||
                      app.status === "Accepted"
                    }

                    onClick={() =>
                      updateStatus(
                        app._id,
                        "Accepted"
                      )
                    }

                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl font-bold disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {updatingId === app._id
                      ? "Updating..."
                      : "Accept ✅"}
                  </button>

                  {/* REJECT */}

                  <button
                    disabled={
                      updatingId === app._id ||
                      app.status === "Rejected"
                    }

                    onClick={() =>
                      updateStatus(
                        app._id,
                        "Rejected"
                      )
                    }

                    className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-bold disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {updatingId === app._id
                      ? "Updating..."
                      : "Reject ❌"}
                  </button>

                </div>

              </motion.div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Applicants;