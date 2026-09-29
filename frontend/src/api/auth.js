import axiosInstance from "../lib/axios";

export const authApi = {
  register: async (details) => {
    const response = await axiosInstance.post("/auth/register", details);
    return response.data;
  },
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
  me: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },
};