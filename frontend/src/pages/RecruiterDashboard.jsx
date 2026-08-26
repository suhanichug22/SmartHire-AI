import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function RecruiterDashboard() {

  // ==========================================
  // GET LOGGED-IN RECRUITER
  // ==========================================

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const recruiterId =
    user?._id ||
    user?.id ||
    localStorage.getItem("userId");

  console.log("👤 Logged User:", user);
  console.log("🆔 Recruiter ID:", recruiterId);


  // ==========================================
  // STATES
  // ==========================================

  const [jobs, setJobs] = useState([]);

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);


  // ==========================================
  // PIE CHART DATA
  // ==========================================

  const data = [
    {
      name: "Pending",
      value: stats.pending,
    },
    {
      name: "Accepted",
      value: stats.accepted,
    },
    {
      name: "Rejected",
      value: stats.rejected,
    },
  ];


  const COLORS = [
    "#facc15",
    "#22c55e",
    "#ef4444",
  ];


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {

    if (!recruiterId) {

      console.log(
        "❌ Recruiter ID not found in localStorage"
      );

      setLoading(false);

      return;
    }


    console.log(
      "🚀 Loading Recruiter Dashboard for:",
      recruiterId
    );


    fetchJobs();

    fetchStats();

  }, [recruiterId]);


  // ==========================================
  // FETCH RECRUITER JOBS
  // ==========================================

  const fetchJobs = async () => {

    try {

      console.log(
        "📡 Fetching jobs for recruiter:",
        recruiterId
      );


      const res = await axios.get(
        `http://localhost:5000/api/jobs/recruiter/${recruiterId}`
      );


      console.log(
        "✅ Recruiter Jobs Response:",
        res.data
      );


      // Backend may return array
      // OR { jobs: [] }

      if (Array.isArray(res.data)) {

        setJobs(res.data);

      } else if (Array.isArray(res.data.jobs)) {

        setJobs(res.data.jobs);

      } else {

        setJobs([]);

      }


    } catch (error) {

      console.log(
        "❌ Fetch Jobs Error:",
        error.response?.data ||
        error.message
      );

      setJobs([]);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // FETCH RECRUITER STATS
  // ==========================================

  const fetchStats = async () => {

    try {

      console.log(
        "📡 Fetching recruiter stats:",
        recruiterId
      );


      const res = await axios.get(
        `http://localhost:5000/api/applications/stats/${recruiterId}`
      );


      console.log(
        "✅ Recruiter Stats Response:",
        res.data
      );


      setStats({

        totalJobs:
          res.data.totalJobs || 0,

        totalApplicants:
          res.data.totalApplicants || 0,

        pending:
          res.data.pending || 0,

        accepted:
          res.data.accepted || 0,

        rejected:
          res.data.rejected || 0,

      });


    } catch (error) {

      console.log(
        "❌ Stats Error:",
        error.response?.data ||
        error.message
      );


      setStats({
        totalJobs: 0,
        totalApplicants: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
      });

    }

  };


  // ==========================================
  // DELETE JOB
  // ==========================================

  const deleteJob = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this Job?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      console.log(
        "🗑️ Deleting Job:",
        id
      );


      await axios.delete(
        `http://localhost:5000/api/jobs/delete/${id}`
      );


      await fetchJobs();

      await fetchStats();


      alert(
        "Job Deleted Successfully ✅"
      );


    } catch (error) {

      console.log(
        "❌ Delete Job Error:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        "Failed to delete job"
      );

    }

  };


  // ==========================================
  // TOGGLE JOB STATUS
  // ==========================================

  const toggleStatus = async (id) => {

    try {

      console.log(
        "🔄 Toggling Job Status:",
        id
      );


      await axios.put(
        `http://localhost:5000/api/jobs/toggle-status/${id}`
      );


      await fetchJobs();

      await fetchStats();


      alert(
        "Job Status Updated Successfully ✅"
      );


    } catch (error) {

      console.log(
        "❌ Status Error:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        "Failed to update job status"
      );

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <h1 className="text-3xl animate-pulse">

          Loading Recruiter Dashboard 🚀

        </h1>

      </div>

    );

  }


  // ==========================================
  // NO RECRUITER ID
  // ==========================================

  if (!recruiterId) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center p-10">

        <div className="bg-red-900/30 border border-red-500 rounded-3xl p-10 text-center">

          <h1 className="text-3xl font-bold">

            Recruiter Login Required ❌

          </h1>

          <p className="text-gray-400 mt-4">

            Recruiter information was not found.

          </p>


          <Link to="/login">

            <button className="mt-6 bg-purple-600 px-6 py-3 rounded-xl font-bold">

              Login Again

            </button>

          </Link>

        </div>

      </div>

    );

  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <div className="max-w-7xl mx-auto">


        {/* ==========================================
            HEADER
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: -30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="mb-12"

        >

          <h1 className="text-5xl font-bold">

            Recruiter Dashboard 🚀

          </h1>


          <p className="text-gray-400 mt-3">

            Manage your jobs and candidates from one place.

          </p>

        </motion.div>



        {/* ==========================================
            STATS
        ========================================== */}

        <div className="grid md:grid-cols-5 gap-5 mb-12">


          {/* TOTAL JOBS */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            className="bg-purple-700 rounded-2xl p-6"

          >

            <h2 className="text-lg">

              Total Jobs

            </h2>


            <p className="text-4xl font-bold mt-2">

              {stats.totalJobs}

            </p>

          </motion.div>



          {/* TOTAL APPLICANTS */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.1,
            }}

            className="bg-pink-700 rounded-2xl p-6"

          >

            <h2 className="text-lg">

              Total Applicants

            </h2>


            <p className="text-4xl font-bold mt-2">

              {stats.totalApplicants}

            </p>

          </motion.div>



          {/* PENDING */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.2,
            }}

            className="bg-yellow-600 rounded-2xl p-6"

          >

            <h2 className="text-lg">

              Pending

            </h2>


            <p className="text-4xl font-bold mt-2">

              {stats.pending}

            </p>

          </motion.div>



          {/* ACCEPTED */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.3,
            }}

            className="bg-green-700 rounded-2xl p-6"

          >

            <h2 className="text-lg">

              Accepted

            </h2>


            <p className="text-4xl font-bold mt-2">

              {stats.accepted}

            </p>

          </motion.div>



          {/* REJECTED */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.4,
            }}

            className="bg-red-700 rounded-2xl p-6"

          >

            <h2 className="text-lg">

              Rejected

            </h2>


            <p className="text-4xl font-bold mt-2">

              {stats.rejected}

            </p>

          </motion.div>

        </div>



        {/* ==========================================
            APPLICATION ANALYTICS
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.5,
          }}

          className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-12"

        >

          <h2 className="text-3xl font-bold mb-2">

            Application Analytics 📊

          </h2>


          <p className="text-gray-400 mb-6">

            Overview of your candidate applications

          </p>


          <div className="w-full h-[400px]">

            {stats.totalApplicants === 0 ? (

              <div className="h-full flex items-center justify-center">

                <p className="text-gray-400 text-xl">

                  No applications yet 📭

                </p>

              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie

                    data={data}

                    dataKey="value"

                    nameKey="name"

                    cx="50%"

                    cy="50%"

                    outerRadius={130}

                    label

                  >

                    {data.map(
                      (entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>


                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            )}

          </div>

        </motion.div>



        {/* ==========================================
            JOB MANAGEMENT HEADER
        ========================================== */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-3xl font-bold">

              Your Jobs 💼

            </h2>


            <p className="text-gray-400 mt-1">

              Manage the jobs posted by you

            </p>

          </div>


          <Link to="/create-job">

            <button

              className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition"

            >

              + Create New Job

            </button>

          </Link>

        </div>



        {/* ==========================================
            NO JOBS
        ========================================== */}

        {jobs.length === 0 ? (

          <div className="bg-zinc-900 rounded-3xl p-12 text-center">

            <h2 className="text-3xl font-bold">

              No Jobs Posted Yet 😔

            </h2>


            <p className="text-gray-400 mt-3">

              Start by creating your first job.

            </p>


            <Link to="/create-job">

              <button

                className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"

              >

                Create Job 🚀

              </button>

            </Link>

          </div>

        ) : (


          /* ==========================================
              JOB CARDS
          ========================================== */

          <div className="grid lg:grid-cols-2 gap-8">

            {jobs.map(
              (job, index) => (

                <motion.div

                  key={job._id}

                  initial={{
                    opacity: 0,
                    y: 30,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: index * 0.1,
                  }}

                  className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:border-purple-500/40 transition"

                >


                  {/* JOB HEADER */}

                  <div className="flex justify-between items-start gap-4">

                    <div>

                      <h2 className="text-3xl font-bold">

                        {job.title}

                      </h2>


                      <p className="text-purple-400 text-lg mt-1">

                        {job.company}

                      </p>

                    </div>


                    <span

                      className={`px-4 py-2 rounded-full font-bold text-sm ${
                        job.status === "Closed"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}

                    >

                      {job.status || "Open"}

                    </span>

                  </div>



                  {/* JOB DETAILS */}

                  <div className="mt-6 space-y-3 text-gray-300">

                    <p>

                      📍{" "}

                      <span className="text-white">

                        {job.location}

                      </span>

                    </p>


                    <p>

                      💰{" "}

                      <span className="text-white">

                        {job.salary}

                      </span>

                    </p>


                    <p>

                      💼{" "}

                      <span className="text-white">

                        {job.jobType || "Not specified"}

                      </span>

                    </p>


                    <p className="leading-relaxed">

                      {job.description}

                    </p>

                  </div>



                  {/* SKILLS */}

                  <div className="flex flex-wrap gap-2 mt-6">

                    {job.skills?.map(
                      (skill, skillIndex) => (

                        <span

                          key={skillIndex}

                          className="bg-purple-700/80 px-3 py-1 rounded-full text-sm"

                        >

                          {skill}

                        </span>

                      )
                    )}

                  </div>



                  {/* APPLICATION STATS */}

                  <div className="grid grid-cols-2 gap-4 mt-8">


                    <div className="bg-black/40 rounded-xl p-4">

                      <p className="text-gray-400">

                        👥 Applicants

                      </p>


                      <h3 className="text-3xl font-bold mt-1">

                        {job.applicants || 0}

                      </h3>

                    </div>



                    <div className="bg-black/40 rounded-xl p-4">

                      <p className="text-gray-400">

                        🟡 Pending

                      </p>


                      <h3 className="text-3xl font-bold mt-1">

                        {job.pending || 0}

                      </h3>

                    </div>



                    <div className="bg-black/40 rounded-xl p-4">

                      <p className="text-gray-400">

                        🟢 Accepted

                      </p>


                      <h3 className="text-3xl font-bold mt-1">

                        {job.accepted || 0}

                      </h3>

                    </div>



                    <div className="bg-black/40 rounded-xl p-4">

                      <p className="text-gray-400">

                        🔴 Rejected

                      </p>


                      <h3 className="text-3xl font-bold mt-1">

                        {job.rejected || 0}

                      </h3>

                    </div>

                  </div>



                  {/* ==========================================
                      VIEW APPLICANTS
                  ========================================== */}

                  <div className="mt-8">

                    <Link
                      to={`/applicants/${job._id}`}
                    >

                      <button

                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold hover:scale-[1.02] transition"

                      >

                        View Applicants 👥

                      </button>

                    </Link>

                  </div>



                  {/* ==========================================
                      JOB ACTIONS
                  ========================================== */}

                  <div className="grid grid-cols-3 gap-3 mt-4">


                    {/* EDIT */}

                    <Link
                      to={`/edit-job/${job._id}`}
                    >

                      <button

                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition"

                      >

                        ✏️ Edit

                      </button>

                    </Link>



                    {/* OPEN / CLOSE */}

                    <button

                      onClick={() =>
                        toggleStatus(job._id)
                      }

                      className="bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-xl font-bold transition"

                    >

                      {job.status === "Closed"
                        ? "🔓 Open"
                        : "🔒 Close"}

                    </button>



                    {/* DELETE */}

                    <button

                      onClick={() =>
                        deleteJob(job._id)
                      }

                      className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition"

                    >

                      🗑️ Delete

                    </button>

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

export default RecruiterDashboard;