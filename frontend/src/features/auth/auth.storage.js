const ACCESS_TOKEN_KEY = "live_poll_access_token";

export const authStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
