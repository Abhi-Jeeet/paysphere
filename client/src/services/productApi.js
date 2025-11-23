import API from "./api";

export const fetchProducts = (params) => API.get("/products", { params }); // public
export const fetchProduct = (id) => API.get(`/products/${id}`);

export const createProduct = (payload) => API.post("/products", payload);
export const updateProduct = (id, payload) => API.put(`/products/${id}`, payload);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
