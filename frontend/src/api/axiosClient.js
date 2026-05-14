import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { authStorage } from "../features/auth/auth.storage";

function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!raw) {
    return "/api";
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    const origin = raw.replace(/\/+$/, "");
    return origin.endsWith("/api") ? origin : `${origin}/api`;
  }
  return raw;
}

const axiosClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = authStorage.getAccessToken();

  if (accessToken && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipRefresh &&
      !originalRequest.url?.includes(API_ENDPOINTS.auth.refreshToken)
    ) {
      originalRequest._retry = true;

      try {
        const response = await axiosClient.post(API_ENDPOINTS.auth.refreshToken);
        const accessToken = response.data?.accessToken;

        if (accessToken) {
          authStorage.setAccessToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosClient(originalRequest);
      } catch (refreshError) {
        authStorage.clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;