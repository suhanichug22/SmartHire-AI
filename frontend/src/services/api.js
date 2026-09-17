import axios from "axios";

const API = axios.create({
    baseURL: "https://smarthire-ai-vm20.onrender.com/api"
});

export default API;