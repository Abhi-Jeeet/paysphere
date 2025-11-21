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

//Public Products
export const getProducts = ()=>API.get("/products");
export const getProductById = (id)=>API.get(`/products/${id}`);

//Admin Products
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data)=>API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
