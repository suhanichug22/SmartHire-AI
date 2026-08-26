import axios from "axios";


function JobCard({job}){


    const applyJob = async()=>{


        const user = JSON.parse(localStorage.getItem("user"));


        if(!user){

            alert("Please login first");

            return;
        }



        try{


            const res = await axios.post(

                "http://localhost:5000/api/applications/apply",

                {
                    userId:user.id,
                    jobId:job._id
                }

            );


            alert(res.data.message);



        }
        catch(error){


            console.log(
                "Apply Error:",
                error.response?.data || error.message
            );


            alert(
                error.response?.data?.message ||
                "Application failed"
            );


        }


    };



    return(


        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">


            <h2 className="text-2xl font-bold text-gray-800">
                {job.title}
            </h2>



            <h3 className="text-lg text-purple-600 font-semibold mt-2">
                {job.company}
            </h3>



            <p className="mt-3">
                📍 {job.location}
            </p>



            <p>
                💰 {job.salary}
            </p>



            <p className="mt-4 text-gray-600">
                {job.description}
            </p>



            <div className="mt-4">


                <h4 className="font-semibold">
                    Required Skills:
                </h4>



                <div className="flex flex-wrap gap-2 mt-2">


                {
                    job.skills?.map((skill,index)=>(

                        <span

                        key={index}

                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"

                        >

                            {skill}

                        </span>

                    ))
                }


                </div>


            </div>




            <button

            onClick={applyJob}

            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"

            >

                Apply Now

            </button>



        </div>


    )

}


export default JobCard;