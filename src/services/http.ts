import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./types";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
