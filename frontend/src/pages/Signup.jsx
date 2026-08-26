import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";


function Signup(){

    const navigate = useNavigate();


    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [role,setRole] = useState("candidate");



    const handleSignup = async(e)=>{

        e.preventDefault();


        try{


            const response = await API.post("/auth/signup",{

                name,
                email,
                password,
                role

            });



            console.log(response.data);


            alert("Signup Successful 🚀");


            navigate("/login");


        }


        catch(error){


            console.log(
                "SIGNUP ERROR:",
                error.response
            );


            alert(

                error.response?.data?.message ||

                "Signup Failed"

            );


        }


    };





    return(


<div className="min-h-screen flex justify-center items-center bg-black">



<div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-10 rounded-3xl">



<h1 className="text-3xl font-bold mb-6 text-center text-white">

Create Account 🚀

</h1>





<form onSubmit={handleSignup}>



<input


className="border border-gray-400 bg-transparent text-white placeholder-gray-300 p-3 block mb-4 w-72 rounded"


placeholder="Name"


value={name}


onChange={(e)=>setName(e.target.value)}


/>







<input


type="email"


className="border border-gray-400 bg-transparent text-white placeholder-gray-300 p-3 block mb-4 w-72 rounded"


placeholder="Email"


value={email}


onChange={(e)=>setEmail(e.target.value)}


/>







<input


type="password"


className="border border-gray-400 bg-transparent text-white placeholder-gray-300 p-3 block mb-4 w-72 rounded"


placeholder="Password"


value={password}


onChange={(e)=>setPassword(e.target.value)}


/>









<select


className="border border-gray-400 bg-black text-white p-3 block mb-5 w-72 rounded"


value={role}


onChange={(e)=>setRole(e.target.value)}


>


<option value="candidate">

Candidate

</option>


<option value="recruiter">

Recruiter

</option>


</select>








<button


className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg w-full"


>


Signup


</button>





</form>






<p className="mt-5 text-center text-white">


Already have account?


<Link

to="/login"

className="text-purple-400 ml-2"

>

Login

</Link>


</p>




</div>



</div>


    )


}


export default Signup;