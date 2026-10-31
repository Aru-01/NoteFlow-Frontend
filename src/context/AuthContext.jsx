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
  verifyOtp: async () => {},
  resendOtp: async () => {},
  logout: () => {},
  refreshUserProfile: async () => {},
  updateProfile: async () => {},
  setMockRole: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    const storedUser = tokenStorage.getUser();
    const token = tokenStorage.getAccessToken();

    if (token && storedUser) {
      queueMicrotask(() => {
        setUser(storedUser);
      });
      // Silently sync latest profile in background
      api
        .get(ENDPOINTS.AUTH.PROFILE)
        .then((res) => {
          tokenStorage.setUser(res.data);
          setUser(res.data);
        })
        .catch(() => {
          // Keep stored user if offline or token still refreshable
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      queueMicrotask(() => {
        setIsLoading(false);
      });
    }
  }, []);

  /**
   * User Self-Registration
   * Payload: { email, username, password, confirm_password, interests }
   */
  const register = async (formData) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, formData);
    return response.data;
  };

  /**
   * 6-Digit OTP Verification
   * Payload: { email, otp_code, purpose }
   */
  const verifyOtp = async ({ email, otp_code, purpose = "registration" }) => {
    const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, {
      email,
      otp_code,
      purpose,
    });
    return response.data;
  };

  /**
   * Resend 6-Digit OTP
   * Payload: { email, purpose }
   */
  const resendOtp = async ({ email, purpose = "registration" }) => {
    const response = await api.post(ENDPOINTS.AUTH.RESEND_OTP, {
      email,
      purpose,
    });
    return response.data;
  };

  /**
   * JWT Login with Email & Password
   * Response: { access, refresh, user: { id, email, username, role, is_verified, ... } }
   */
  const login = async (email, password) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    const { access, refresh, user: userData } = response.data;
    tokenStorage.setTokens(access, refresh);
    tokenStorage.setUser(userData);
    setUser(userData);
    return userData;
  };

  /**
   * Sign Out
   */
  const logout = () => {
    tokenStorage.clearTokens();
    setUser(null);
  };

  /**
   * Fetch current user profile
   */
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
   * Update current user profile
   */
  const updateProfile = async (data) => {
    const response = await api.patch(ENDPOINTS.AUTH.PROFILE, data);
    tokenStorage.setUser(response.data);
    setUser(response.data);
    return response.data;
  };

  /**
   * Helper to toggle preview role during frontend design/testing
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
        register,
        verifyOtp,
        resendOtp,
        logout,
        refreshUserProfile,
        updateProfile,
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
