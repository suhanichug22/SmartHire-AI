import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditJob() {

    const { jobId } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState("");
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");

    useEffect(() => {

        fetchJob();

    }, []);

    const apiBase = window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "https://smarthire-ai-vm20.onrender.com/api";

    const fetchJob = async () => {

        try {

            let res;
            try {
                res = await axios.get(`${apiBase}/jobs/${jobId}`);
            } catch (err) {
                if (!err.response && apiBase.includes("localhost")) {
                    res = await axios.get(`https://smarthire-ai-vm20.onrender.com/api/jobs/${jobId}`);
                } else {
                    throw err;
                }
            }

            const job = res.data;

            setCompany(job.company);
            setTitle(job.title);
            setLocation(job.location);
            setSalary(job.salary);
            setDescription(job.description);
            setSkills((job.skills || []).join(", "));

        }

        catch (error) {

            console.log(error);

            alert("Unable to Load Job");

        }

    };

    const updateJob = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                company,
                title,
                location,
                salary,
                description,
                skills: skills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "")
            };

            try {
                await axios.put(`${apiBase}/jobs/update/${jobId}`, payload);
            } catch (err) {
                if (!err.response && apiBase.includes("localhost")) {
                    await axios.put(`https://smarthire-ai-vm20.onrender.com/api/jobs/update/${jobId}`, payload);
                } else {
                    throw err;
                }
            }

            alert("Job Updated Successfully ✅");

            navigate("/recruiter-dashboard", { state: { refresh: true, timestamp: Date.now() } });

        }

        catch (error) {

            console.log(error);

            alert("Update Failed");

        }

    };

    return (

        <div className="min-h-screen bg-black flex justify-center items-center px-5">

            <form

                onSubmit={updateJob}

                className="bg-zinc-900 w-full max-w-xl rounded-2xl p-8 shadow-xl"

            >

                <h1 className="text-3xl text-white font-bold mb-8 text-center">

                    Edit Job

                </h1>

                <input

                    type="text"

                    placeholder="Company"

                    value={company}

                    onChange={(e) => setCompany(e.target.value)}

                    className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white outline-none"

                    required

                />

                <input

                    type="text"

                    placeholder="Job Title"

                    value={title}

                    onChange={(e) => setTitle(e.target.value)}

                    className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white outline-none"

                    required

                />

                <input

                    type="text"

                    placeholder="Location"

                    value={location}

                    onChange={(e) => setLocation(e.target.value)}

                    className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white outline-none"

                    required

                />

                <input

                    type="text"

                    placeholder="Salary"

                    value={salary}

                    onChange={(e) => setSalary(e.target.value)}

                    className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white outline-none"

                    required

                />

                <textarea

                    rows="5"

                    placeholder="Job Description"

                    value={description}

                    onChange={(e) => setDescription(e.target.value)}

                    className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white outline-none"

                    required

                />

                <input

                    type="text"

                    placeholder="React, Node, MongoDB"

                    value={skills}

                    onChange={(e) => setSkills(e.target.value)}

                    className="w-full mb-6 p-3 rounded-lg bg-zinc-800 text-white outline-none"

                />

                <div className="flex gap-4">

                    <button

                        type="submit"

                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"

                    >

                        Update Job

                    </button>

                    <button

                        type="button"

                        onClick={() => navigate("/recruiter-dashboard")}

                        className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold"

                    >

                        Cancel

                    </button>

                </div>

            </form>

        </div>

    );

}

export default EditJob;