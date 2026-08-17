import api from "../axiosInstance";

export const placeOrderApi = async (data) => {
  return await api.post("/api/orders/place", data);
};

export const getOrdersOfUser = async (page, size) => {
  return await api.get(`/api/orders?page=${page}&size=${size}`);
};

export const getAllOrders = async (pageNo, pageSize) => {
  return await api.get(`/admin/api/orders/all?page=${pageNo}&size=${pageSize}`);
};

export const getOrderById = async (orderId) => {
  return await api.get(`/api/orders/${orderId}`);
};

export const getUserOrdersApi = async (userId) => {
  return await api.get(`/api/orders/user/${userId}`);
};

export const getAllPaymentTypes = async () => {
  return await api.get("/api/orders/payment/types");
};

export const getAllOrderStatus = async () => {
  return await api.get("/api/orders/statuses");
};

export const updateOrderStatus = async (orderId, status) => {
  return await api.patch(`/admin/api/orders/${orderId}?status=${status}`);
};

export const getFilteredOrders = async (pageNo, pageSize, keyword) => {
  return await api.get(
    `/admin/api/orders?page=${pageNo}&size=${pageSize}&keyword=${keyword}`,
  );
};

export const getTotalOrderdAmount = async () => {
  return await api.get(`/admin/api/orders/amount`);
};

export const getTotalOrderCount = async () => {
  return await api.get(`/admin/api/orders/count`);
};
