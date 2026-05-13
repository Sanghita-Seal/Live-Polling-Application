import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import { authStorage } from "./auth.storage";

export const authService = {
  async register(payload) {
    return axiosClient.post(API_ENDPOINTS.auth.register, payload);
  },

  async login(payload) {
    const response = await axiosClient.post(API_ENDPOINTS.auth.login, payload);
    const accessToken = response.data?.accessToken;

    if (accessToken) {
      authStorage.setAccessToken(accessToken);
    }

    return response;
  },

  async logout() {
    try {
      return await axiosClient.post(API_ENDPOINTS.auth.logout);
    } finally {
      authStorage.clearAccessToken();
    }
  },

  async getMe() {
    return axiosClient.get(API_ENDPOINTS.auth.me);
  },

  async forgotPassword(payload) {
    return axiosClient.post(API_ENDPOINTS.auth.forgotPassword, payload);
  },

  async resetPassword(token, payload) {
    return axiosClient.put(API_ENDPOINTS.auth.resetPassword(token), payload);
  },

  async verifyEmail(token) {
    return axiosClient.get(API_ENDPOINTS.auth.verifyEmail(token));
  },
};
