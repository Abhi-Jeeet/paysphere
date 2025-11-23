import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:8000", 
});

//Automatically attach jwt (if present)
API.interceptors.request.use((req)=>{
    const token = localStorage.getItem("token");
    if(token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

//Auth
export const registerUser = (data)=> API.post("/auth/register", data);
export const loginUser = (data)=>API.post("/auth/login", data);

export default API;