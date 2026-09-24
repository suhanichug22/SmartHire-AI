import axios from "axios";

const API = axios.create({
    baseURL: typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "https://smarthire-ai-vm20.onrender.com/api"
});

export default API;