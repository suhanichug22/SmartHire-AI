import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


function CreateJob(){

const navigate = useNavigate();


const [job,setJob] = useState({

    company:"",
    title:"",
    location:"",
    salary:"",
    description:"",
    skills:""

});



const handleChange=(e)=>{

setJob({

...job,

[e.target.name]:e.target.value

});

};




const createJob=async(e)=>{

e.preventDefault();

try{

const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

if(!user){

alert("Please login first");
navigate("/login");
return;

}

const recruiterId = user._id || user.id || localStorage.getItem("userId");

if(!recruiterId){
alert("Recruiter ID not found. Please log in again.");
navigate("/login");
return;
}

const data={

company:job.company.trim(),

title:job.title.trim(),

location:job.location.trim(),

salary:job.salary.trim(),

description:job.description.trim(),

skills: job.skills
 ? job.skills.split(",").map(skill=>skill.trim()).filter(Boolean)
 : [],

recruiterId: recruiterId

};

const apiBase = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://smarthire-ai-vm20.onrender.com/api";

let res;
try {
    res = await axios.post(`${apiBase}/jobs/create`, data);
} catch (err) {
    if (!err.response && apiBase.includes("localhost")) {
        res = await axios.post("https://smarthire-ai-vm20.onrender.com/api/jobs/create", data);
    } else {
        throw err;
    }
}

console.log("Job Created:", res.data);

alert("Job Created Successfully 🚀");

navigate("/recruiter-dashboard", { state: { refresh: true, timestamp: Date.now() } });

}

catch(error){


console.log(error);


alert(
error.response?.data?.message ||
"Job creation failed"
);


}



};







return(


<div className="min-h-screen bg-black text-white p-10">


<div className="max-w-3xl mx-auto">


<motion.h1

initial={{opacity:0,y:-30}}

animate={{opacity:1,y:0}}

className="text-5xl font-bold mb-10"

>


Create 

<span className="text-purple-500">

Job

</span>

🚀


</motion.h1>





<form

onSubmit={createJob}

className="bg-white/10 border border-white/20 rounded-3xl p-8 space-y-5"

>




<input

name="company"

placeholder="Company Name"

value={job.company}

onChange={handleChange}

className="w-full p-4 rounded-xl bg-black border border-gray-600"

required

/>





<input

name="title"

placeholder="Job Title"

value={job.title}

onChange={handleChange}

className="w-full p-4 rounded-xl bg-black border border-gray-600"

required

/>






<input

name="location"

placeholder="Location"

value={job.location}

onChange={handleChange}

className="w-full p-4 rounded-xl bg-black border border-gray-600"

required

/>







<input

name="salary"

placeholder="Salary"

value={job.salary}

onChange={handleChange}

className="w-full p-4 rounded-xl bg-black border border-gray-600"

required

/>






<textarea

name="description"

placeholder="Job Description"

value={job.description}

onChange={handleChange}

className="w-full p-4 rounded-xl bg-black border border-gray-600"

rows="4"

required

/>






<input

name="skills"

placeholder="Skills (React, Node, MongoDB)"

value={job.skills}

onChange={handleChange}

className="w-full p-4 rounded-xl bg-black border border-gray-600"

required

/>






<button

className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-xl"

>


Create Job 🚀


</button>





</form>



</div>


</div>


)


}


export default CreateJob;