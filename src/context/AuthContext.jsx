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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUserProfile,
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

