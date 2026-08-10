import api from "../axiosInstance";

export const getAllUsers = async () => {
  return await api.get("/admin/api/user");
};

export const blockUser = async (id) => {
  return await api.patch(`/admin/api/user/block/${id}`);
};

export const unblockUser = async (id) => {
  return await api.patch(`/admin/api/user/unblock/${id}`);
};
export const totalUsersCount = async () => {
  return await api.get(`/admin/api/user/count`);
};
export const searchUsers = async (keyword) => {
  return await api.get(`/admin/api/user/${keyword}`);
};

export const getUserInformation = async () => {
  return await api.get("/api/user");
};

export const updateUserDetails = async (jsonData) => {
  return await api.put("/api/user", jsonData);
};

export const changePassword = async (passwordData) => {
  return await api.post("/api/user/password", passwordData);
};
