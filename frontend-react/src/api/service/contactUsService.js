import api from "../axiosInstance";

export const fetchAllSubjects = async () => {
  return api.get("/api/contact/subjects");
};

export const saveContactUsDetails = async (formData) => {
  return api.post("/api/contact", formData);
};

export const getAllTicketStatus = async () => {
  return api.get("/api/contact/status");
};

export const getAllContactUsMessage = async () => {
  return api.get("/admin/api/contact");
};

export const updateContactUsMessageStatus = async (id, ticketStatus) => {
  return api.patch(`/admin/api/contact/${id}?ticketStatus=${ticketStatus}`);
};

export const getFilteredContactUsMessage = async (keyword) => {
  return api.get(`/admin/api/contact/search?keyword=${keyword}`);
};
export const getTotalQueryCount = async () => {
  return api.get(`/admin/api/contact/count`);
};

export const getTotalPendingQueryCount = async () => {
  return api.get(`/admin/api/contact/pending-queries/count`);
};
