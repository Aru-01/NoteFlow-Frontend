import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names and resolves Tailwind CSS conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Token management helpers for browser storage
 */
export const tokenStorage = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("noteflow_access_token");
  },
  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("noteflow_refresh_token");
  },
  setTokens: (access, refresh) => {
    if (typeof window === "undefined") return;
    if (access) localStorage.setItem("noteflow_access_token", access);
    if (refresh) localStorage.setItem("noteflow_refresh_token", refresh);
  },
  clearTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("noteflow_access_token");
    localStorage.removeItem("noteflow_refresh_token");
    localStorage.removeItem("noteflow_user");
  },
  getUser: () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("noteflow_user");
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("noteflow_user", JSON.stringify(user));
  },
};

/**
 * Format date utility
 */
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

