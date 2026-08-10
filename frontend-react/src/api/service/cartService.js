import api from "../axiosInstance"

export const addToCartApi = async (data) => {
  return await api.post("/api/cart/add", data);
};

export const getCartApi = async (userId) => {
  return await api.get(`/api/cart/${userId}`);
};

export const increaseCartApi = async (userId, foodId) => {
  return await api.put(`/api/cart/increase/${userId}/${foodId}`);
};

export const decreaseCartApi = async (userId, foodId) => {
  return await api.put(`/api/cart/decrease/${userId}/${foodId}`);
};

export const removeCartItemApi = async (userId, foodId) => {
  return await api.delete(`/api/cart/${userId}/${foodId}`);
};

export const clearCartApi = async (userId) => {
  return await api.delete(`/api/cart/clear/${userId}`);
};