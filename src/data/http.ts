import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./types";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
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
    const apiError = new Error(errorMessage) as Error & { status?: number };
    apiError.status = error.response?.status;
    return Promise.reject(apiError);
  }
);

export default axiosInstance;
