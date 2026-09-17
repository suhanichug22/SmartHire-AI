import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Jobs() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // User role
  const [userRole, setUserRole] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [jobType, setJobType] = useState("");


  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {

        alert("Please login first");

        setLoading(false);

        return;
      }


      const userId = user._id || user.id;

      // Get user role
      setUserRole(user.role);


      // Get all jobs
      const jobsRes = await axios.get(
        "https://smarthire-ai-vm20.onrender.com/api/jobs"
      );

      setJobs(jobsRes.data);


      // Only candidate needs applied jobs
      if (user.role === "candidate") {

        try {

          const appliedRes = await axios.get(
            `https://smarthire-ai-vm20.onrender.com/api/applications/applied/${userId}`
          );

          setAppliedJobIds(
            appliedRes.data.appliedJobIds || []
          );

        } catch (error) {

          console.log(
            "Applied jobs fetch error:",
            error
          );

        }

      }


      setLoading(false);

    } catch (error) {

      console.log("❌ Fetch Error:", error);

      setLoading(false);

    }

  };


  // ==========================================
  // APPLY JOB
  // ==========================================

  const applyJob = async (jobId) => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );


      if (!user) {

        alert("Please login first");

        return;
      }


      // Recruiter cannot apply
      if (user.role === "recruiter") {

        alert(
          "Recruiters cannot apply for jobs."
        );

        return;
      }


      const userId = user._id || user.id;


      const res = await axios.post(
        "https://smarthire-ai-vm20.onrender.com/api/applications/apply",
        {
          userId,
          jobId
        }
      );


      alert(res.data.message);


      setAppliedJobIds((prev) => {

        if (prev.includes(jobId)) {

          return prev;

        }

        return [...prev, jobId];

      });


    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Application Failed"
      );

    }

  };


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {

    setSearch("");
    setLocation("");
    setSkill("");
    setJobType("");

  };


  // ==========================================
  // FILTER JOBS
  // ==========================================

  const filteredJobs = jobs.filter((job) => {

    const searchText =
      search.toLowerCase().trim();


    const matchesSearch =
      !searchText ||
      job.title
        ?.toLowerCase()
        .includes(searchText) ||
      job.company
        ?.toLowerCase()
        .includes(searchText) ||
      job.description
        ?.toLowerCase()
        .includes(searchText);


    const matchesLocation =
      !location ||
      job.location
        ?.toLowerCase()
        .includes(
          location.toLowerCase()
        );


    const matchesSkill =
      !skill ||
      job.skills?.some((item) =>
        item
          .toLowerCase()
          .includes(
            skill.toLowerCase()
          )
      );


    const matchesJobType =
      !jobType ||
      job.jobType
        ?.toLowerCase() ===
        jobType.toLowerCase();


    return (
      matchesSearch &&
      matchesLocation &&
      matchesSkill &&
      matchesJobType
    );

  });


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <h1 className="text-3xl animate-pulse">

          Loading available jobs...

        </h1>

      </div>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="relative min-h-screen bg-black text-white p-6 md:p-10 overflow-hidden">


      {/* Background Glow */}

      <motion.div

        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}

        transition={{
          duration: 8,
          repeat: Infinity
        }}

        className="absolute w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"

      />


      <div className="relative z-10 max-w-7xl mx-auto">


        {/* ==========================================
            HEADING
        ========================================== */}

        <motion.h1

          initial={{
            opacity: 0,
            y: -30
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          className="text-4xl md:text-5xl font-bold mb-3"

        >

          Explore Opportunities

        </motion.h1>


        <p className="max-w-2xl text-gray-400 mb-8">

          {userRole === "recruiter"
            ? "Manage and monitor your job opportunities"
            : "Find opportunities matching your skills"}

        </p>


        {/* ==========================================
            FILTER SECTION
        ========================================== */}

        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-2xl p-5 md:p-6 mb-10 shadow-xl shadow-black/20">


          <h2 className="text-2xl font-bold mb-5">

            Find the right role

          </h2>


          <div className="grid md:grid-cols-4 gap-4">


            {/* SEARCH */}

            <input

              type="text"

              placeholder="Search job or company..."

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500"

            />


            {/* LOCATION */}

            <input

              type="text"

              placeholder="Location"

              value={location}

              onChange={(e) =>
                setLocation(e.target.value)
              }

              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500"

            />


            {/* SKILL */}

            <input

              type="text"

              placeholder="Skill e.g. React"

              value={skill}

              onChange={(e) =>
                setSkill(e.target.value)
              }

              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none focus:border-purple-500"

            />


            {/* JOB TYPE */}

            <select

              value={jobType}

              onChange={(e) =>
                setJobType(e.target.value)
              }

              className="w-full p-3 rounded-xl bg-black border border-white/20 outline-none"

            >

              <option value="">
                All Job Types
              </option>

              <option value="Full Time">
                Full Time
              </option>

              <option value="Part Time">
                Part Time
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Remote">
                Remote
              </option>

            </select>


          </div>


          {/* CLEAR */}

          <button

            onClick={clearFilters}

            className="mt-5 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-xl"

          >

            Clear Filters

          </button>


        </div>


        {/* ==========================================
            RESULT COUNT
        ========================================== */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">

            Available Jobs

          </h2>


          <p className="text-gray-400">

            {filteredJobs.length} job
            {filteredJobs.length !== 1
              ? "s"
              : ""}{" "}
            found

          </p>

        </div>


        {/* ==========================================
            NO JOBS
        ========================================== */}

        {filteredJobs.length === 0 ? (

          <div className="text-center py-20 bg-white/5 rounded-3xl">

            <h2 className="text-3xl font-bold">

              No Jobs Found

            </h2>

            <p className="text-gray-400 mt-3">

              Try changing your search or filters.

            </p>

            <button

              onClick={clearFilters}

              className="mt-5 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"

            >

              Reset Filters

            </button>

          </div>

        ) : (

          /* ==========================================
              JOB CARDS
          ========================================== */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredJobs.map((job, index) => {

              const isApplied =
                appliedJobIds.includes(job._id);


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
                    duration: 0.5,
                    delay: index * 0.05
                  }}

                  whileHover={{
                    scale: 1.01,
                    y: -5
                  }}

                  className="flex flex-col bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/25 transition hover:border-purple-500/45"

                >


                  {/* TITLE */}

                  <h2 className="text-2xl font-bold">

                    {job.title}

                  </h2>


                  {/* COMPANY */}

                  <p className="text-purple-300 text-base mt-2">

                    {job.company}

                  </p>


                  {/* LOCATION */}

                  <p className="text-gray-300 mt-5 text-sm">

                    📍 {job.location}

                  </p>


                  {/* SALARY */}

                  <p className="text-gray-300 mt-3 text-sm">

                    💰 {job.salary}

                  </p>


                  {/* JOB TYPE */}

                  {job.jobType && (

                    <p className="text-gray-300 mt-3 text-sm">

                      💼 {job.jobType}

                    </p>

                  )}


                  {/* SKILLS */}

                  <p className="text-gray-300 mt-3 text-sm leading-relaxed">

                    🛠{" "}

                    {job.skills?.length
                      ? job.skills.join(", ")
                      : "Not specified"}

                  </p>


                  {/* STATUS */}

                  <div className="mt-4">

                    <span

                      className={`px-3 py-1 rounded-full text-sm ${
                        job.status === "Closed"
                          ? "bg-red-600/30 text-red-300"
                          : "bg-green-600/30 text-green-300"
                      }`}

                    >

                      {job.status || "Open"}

                    </span>

                  </div>


                  {/* ======================================
                      CANDIDATE BUTTONS
                  ====================================== */}

                  {userRole === "candidate" && (

                    <>

                      {isApplied ? (

                        <button

                          disabled

                          className="mt-6 w-full py-3 rounded-xl bg-green-600/30 border border-green-500 text-green-300 font-semibold cursor-not-allowed"

                        >

                          Already Applied

                        </button>

                      ) : (

                        <button

                          onClick={() =>
                            applyJob(job._id)
                          }

                          disabled={
                            job.status === "Closed"
                          }

                          className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
                            job.status === "Closed"
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                          }`}

                        >

                          {job.status === "Closed"
                            ? "Job Closed"
                            : "Apply Now"}

                        </button>

                      )}

                    </>

                  )}


                  {/* ======================================
                      RECRUITER BUTTON
                  ====================================== */}

                  {userRole === "recruiter" && (

                    <button

                      onClick={() =>
                        navigate(
                          `/recruiter-dashboard`
                        )
                      }

                      className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 font-semibold"

                    >

                      Manage Jobs

                    </button>

                  )}


                </motion.div>

              );

            })}

          </div>

        )}

      </div>

    </div>

  );

}

export default Jobs;
