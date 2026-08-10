import api from "../axiosInstance";

export const getRevenueLast7Days = async () => {
  return await api.get("/admin/api/analytics/revenue/last7days");
};
export const getOrderStatusChart = () => {
  return api.get("/admin/api/analytics/order-status");
};
export const getRecentOrders = () => {
  return api.get("/admin/api/analytics/recent-orders");
};
export const getTopSellingFoods = () => {
  return api.get("/admin/api/analytics/top-selling-foods");
};
export const getRecentUsers = () => {
  return api.get("/admin/api/analytics/recent-users");
};
export const getRecentQueries = () => {
  return api.get("/admin/api/analytics/recent-queries");
};
