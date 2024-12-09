import axios from "axios";
import { SERVER_URI } from "./service/socket";

const axiosInstance = axios.create({
  baseURL: SERVER_URI + "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lc-dev-userId");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
