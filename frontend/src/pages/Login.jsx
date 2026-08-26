import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,  //preserve old values 
      [e.target.name]: e.target.value
    });

  };

                     //asyn bcoz backend api ko call karna hai or response ane mai time lg skta hai
  const handleSubmit = async (e) => {

    e.preventDefault();          //browser ke def form sub ko prevent

    setMessage("");
    setLoading(true);

    try {
//Axios ek HTTP client library hai, jiska use frontend se backend API ko HTTP requests bhejne ke liye kiya hai.
//Axios ke through backend ke login API ko POST request bheji jaati hai aur formData backend ko send hota hai.     
const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );


      // Save login information
  //Browser ka storage mechanism hai jisme key-value data store kar sakte hain.
      localStorage.setItem(
        "token",
        response.data.token  //Backend ke response se JWT token retrieve kar raha hai.
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)  //localStorage directly JavaScript object store nahi karta. Isliye object ko JSON string mein convert karte hain.
      );


      setMessage("Login successful");


      // Role based dashboard
      if (response.data.user.role === "recruiter") {

        navigate("/recruiter-dashboard");

      } else {

        navigate("/dashboard");

      }

    }
    catch (error) {

      setMessage(
        error.response?.data?.message ||   
        //Ye optional chaining operator hai.
        "Login failed. Please try again."
      );

    }
    finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">


      {/* Background Glow */}

      <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 top-10 left-10"></div>

      <div className="absolute w-80 h-80 bg-pink-600 rounded-full blur-3xl opacity-10 bottom-10 right-10"></div>


      {/* Login Card */}

      <div className="relative z-10 w-full max-w-md">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">


          {/* Heading */}

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold">

              Welcome Back

            </h1>

            <p className="text-gray-400 mt-2">

              Login to your SmartHire account

            </p>

          </div>


          {/* Message */}

          {message && (

            <div className="mb-5 text-center text-sm text-purple-300">

              {message}

            </div>

          )}


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* Email */}

            <div>

              <label className="block text-sm text-gray-300 mb-2">

                Email

              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

            </div>


            {/* Password */}

            <div>

              <label className="block text-sm text-gray-300 mb-2">

                Password

              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
              />

            </div>


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium transition disabled:opacity-50"
            >

              {loading ? "Logging in..." : "Login"}

            </button>


          </form>


          {/* Signup */}

          <div className="text-center mt-6 text-sm text-gray-400">

            Don't have an account?

            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 ml-2"
            >
              Sign Up
            </Link>

          </div>


          {/* Back Home */}

          <div className="text-center mt-4">

            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-300"
            >
              ← Back to Home
            </Link>

          </div>


        </div>

      </div>

    </div>

  );

}

export default Login;
