import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:5001/api", //auth-service backend
});

//Automatically attach jwt (if present)
API.interceptors.request.use((req)=>{
    const token = localStorage.getItem("token");
    if(token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const registerUser = (data)=> API.post("/auth/register", data);
export const loginUser = (data)=>API.post("/auth/login", data);