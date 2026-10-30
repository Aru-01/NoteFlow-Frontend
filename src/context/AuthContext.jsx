'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { tokenStorage } from "@/lib/utils";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUserProfile: async () => {},
  setMockRole: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check existing stored user session
    const storedUser = tokenStorage.getUser();
    const token = tokenStorage.getAccessToken();

    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    const { access, refresh, user: userData } = response.data;
    tokenStorage.setTokens(access, refresh);
    tokenStorage.setUser(userData);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    tokenStorage.clearTokens();
    setUser(null);
  };

  const refreshUserProfile = async () => {
    try {
      const response = await api.get(ENDPOINTS.AUTH.PROFILE);
      tokenStorage.setUser(response.data);
      setUser(response.data);
      return response.data;
    } catch {
      return null;
    }
  };

  /**
   * Helper to toggle preview role during frontend design / testing
   * without needing the backend running.
   */
  const setMockRole = (role) => {
    if (!role) {
      logout();
      return;
    }
    const mockUser = {
      id: role === "admin" ? 1 : 42,
      email: role === "admin" ? "admin@noteflow.dev" : "user@noteflow.dev",
      username: role === "admin" ? "arif_admin" : "arif_user",
      role: role,
      is_verified: true,
      interests: ["coding", "architecture", "security"],
    };
    tokenStorage.setUser(mockUser);
    tokenStorage.setTokens("mock_access_token", "mock_refresh_token");
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUserProfile,
        setMockRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
