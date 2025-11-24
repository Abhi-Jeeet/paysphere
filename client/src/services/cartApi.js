import API from "./api";

export const getCart = () => API.get("/cart");
export const addToCart = (payload) => API.post("/cart/add", payload);
export const updateCartItem = (productId, payload) => API.put(`/cart/item/${productId}`, payload);
export const removeCartItem = (productId) => API.delete(`/cart/item/${productId}`);
export const clearCart = () => API.post("/cart/clear");
export const checkoutCart = () => API.post("/cart/checkout");