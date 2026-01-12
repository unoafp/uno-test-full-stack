import authService from "@/features/auth/services/auth.service";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const guestClient = axios.create({
  baseURL: apiUrl || "http://localhost:3000",
  withCredentials: true,
});
export const apiClient = axios.create({
  baseURL: apiUrl || "http://localhost:3000",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await authService.getTokenForRequest();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("API CLIENT REQUEST ERROR", error);
    return Promise.reject(error);
  }
);

export default apiClient;
