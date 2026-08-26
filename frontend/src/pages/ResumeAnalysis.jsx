import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


function ResumeAnalysis(){


    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(true);

    const navigate = useNavigate();




    useEffect(()=>{


        const resumeId = localStorage.getItem("resumeId");


        if(!resumeId){

            setLoading(false);
            return;

        }




        axios.get(

            `http://localhost:5000/api/resume/analyze/${resumeId}`

        )

        .then((res)=>{

            setData(res.data);
            setLoading(false);

        })


        .catch((error)=>{

            console.log(error);
            setLoading(false);

        });


    },[]);







    if(loading){

        return(

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                <motion.h1

                animate={{
                    opacity:[0.3,1,0.3]
                }}

                transition={{
                    duration:1.5,
                    repeat:Infinity
                }}

                className="text-3xl font-bold"

                >

                🤖 Analyzing Resume...

                </motion.h1>

            </div>

        )

    }







    if(!data){

        return(

            <div className="min-h-screen bg-black text-white flex items-center justify-center">

                <h1 className="text-3xl">

                No Resume Found

                </h1>

            </div>

        )

    }







    let status="";


    if(data.score >= 80){

        status="Excellent 🚀";

    }
    else if(data.score >=60){

        status="Good 👍";

    }
    else if(data.score >=40){

        status="Average ⚡";

    }
    else{

        status="Needs Improvement 📈";

    }






    const recommendedSkills=[

        "React",
        "Node.js",
        "MongoDB",
        "Git",
        "TypeScript",
        "AWS"

    ];




    const suggestions=[

        "Add more real world projects",

        "Mention GitHub profile",

        "Highlight achievements",

        "Add more technical skills",

        "Improve resume formatting"

    ];






return(


<div className="min-h-screen bg-black text-white p-10 overflow-hidden">



<motion.div

animate={{

x:[0,120,0],

y:[0,-50,0]

}}

transition={{

duration:8,

repeat:Infinity

}}

className="absolute w-96 h-96 bg-purple-600/30 blur-3xl rounded-full"

/>






<div className="relative max-w-6xl mx-auto">





<h1 className="text-5xl font-bold">

AI Resume <span className="text-purple-500">

Report

</span> 🤖

</h1>


<p className="text-gray-400 mt-3 mb-10">

SmartHire-AI analyzed your resume

</p>







<div className="grid md:grid-cols-2 gap-8">





{/* SCORE */}



<motion.div

initial={{
opacity:0,
scale:0.8
}}

animate={{
opacity:1,
scale:1
}}

className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/30 rounded-3xl p-8 text-center"

>


<h2 className="text-2xl font-bold mb-8">

Resume Score

</h2>



<div className="mx-auto w-52 h-52 rounded-full border-[10px] border-purple-500 flex items-center justify-center">


<motion.span

initial={{
scale:0
}}

animate={{
scale:1
}}

transition={{
duration:0.8
}}

className="text-5xl font-black"

>

{data.score}%

</motion.span>


</div>




<p className="text-2xl mt-6 font-bold text-purple-400">

{status}

</p>



</motion.div>








{/* SKILLS */}



<motion.div

initial={{
opacity:0,
x:50
}}

animate={{
opacity:1,
x:0
}}

className="bg-white/5 border border-white/10 rounded-3xl p-8"

>


<h2 className="text-2xl font-bold mb-6">

Skills Found 🚀

</h2>



<div className="flex flex-wrap gap-3">


{

data.skills.map((skill)=>(


<span

key={skill}

className="px-5 py-2 rounded-full bg-purple-600/30 border border-purple-400"

>

⚡ {skill}

</span>


))


}


</div>


</motion.div>



</div>









{/* Suggestions */}



<div className="grid md:grid-cols-2 gap-8 mt-8">





<div className="bg-white/5 border border-white/10 rounded-3xl p-8">


<h2 className="text-2xl font-bold mb-5">

AI Suggestions 💡

</h2>



{

suggestions.map((item,index)=>(


<p key={index}

className="text-gray-300 mb-3"

>

✓ {item}

</p>


))

}



</div>








<div className="bg-white/5 border border-white/10 rounded-3xl p-8">


<h2 className="text-2xl font-bold mb-5">

Recommended Skills 🔥

</h2>




<div className="flex flex-wrap gap-3">


{

recommendedSkills.map((skill)=>(


<span

key={skill}

className="px-4 py-2 bg-pink-500/20 border border-pink-400 rounded-full"

>

+ {skill}

</span>


))

}


</div>


</div>




</div>









{/* PREVIEW */}



<div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-8">


<h2 className="text-2xl font-bold mb-5">

Resume Preview 📄

</h2>


<p className="text-gray-400 leading-7">

{data.extractedText}

</p>


</div>







<div className="flex gap-5 mt-8">


<button

onClick={()=>navigate("/resume-upload")}

className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700"

>

Upload New Resume

</button>




<button

onClick={()=>navigate("/jobs")}

className="px-8 py-3 rounded-xl bg-pink-600 hover:bg-pink-700"

>

Find Matching Jobs 🚀

</button>



</div>





</div>



</div>


)


}


export default ResumeAnalysis;