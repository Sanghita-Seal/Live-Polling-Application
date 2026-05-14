/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../features/auth/auth.service";
import { authStorage } from "../features/auth/auth.storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!authStorage.getAccessToken()) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const response = await authService.getMe();
        setUser(response.data);
      } catch {
        authStorage.clearAccessToken();
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    loadUser();
  }, []);

  const login = async (payload) => {
    const response = await authService.login(payload);
    setUser(response.data?.user || null);
    return response;
  };

  const register = async (payload) => {
    return authService.register(payload);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user || authStorage.getAccessToken()),
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
