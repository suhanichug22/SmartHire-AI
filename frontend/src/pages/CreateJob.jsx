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


const user = JSON.parse(
localStorage.getItem("user")
);



if(!user){

alert("Please login first");

return;

}




const data={

company:job.company,

title:job.title,

location:job.location,

salary:job.salary,

description:job.description,

skills: job.skills
 ? job.skills.split(",").map(skill=>skill.trim())
 : [],


recruiterId:user.id

};




const res = await axios.post(

"http://localhost:5000/api/jobs/create",

data

);



console.log(res.data);



alert("Job Created Successfully 🚀");



navigate("/recruiter-dashboard");



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