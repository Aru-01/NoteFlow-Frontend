/**
 * API Endpoints mapping to NoteFlow Django REST Backend
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export const ENDPOINTS = {
  // Authentication & Accounts
  AUTH: {
    REGISTER: "/auth/register/",
    VERIFY_OTP: "/auth/verify-otp/",
    RESEND_OTP: "/auth/resend-otp/",
    LOGIN: "/auth/login/",
    REFRESH: "/auth/token/refresh/",
    PROFILE: "/auth/profile/",
    PASSWORD_RESET_REQUEST: "/auth/password-reset/request/",
    PASSWORD_RESET_CONFIRM: "/auth/password-reset/confirm/",
    ADMIN_USERS: "/auth/admin/users/",
  },

  // Notes
  NOTES: {
    LIST_CREATE: "/api/v1/notes/",
    DETAIL: (id) => `/api/v1/notes/${id}/`,
  },

  // Posts & Aggregations
  POSTS: {
    LIST_CREATE: "/api/v1/posts/",
    DETAIL: (id) => `/api/v1/posts/${id}/`,
    REACT: (id) => `/api/v1/posts/${id}/react/`,
    USER_POSTS: (userId) => `/api/v1/posts/user/${userId}/`,
    GROUP_BY_INTERESTS: "/api/v1/posts/aggregations/group-by-interests/",
  },

  // API Documentation
  DOCS: "/api/v1/docs/",
};

/**
 * Priority Choices
 */
export const NOTE_PRIORITIES = [
  { value: "low", label: "Low", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { value: "medium", label: "Medium", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { value: "high", label: "High", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { value: "urgent", label: "Urgent", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
];

/**
 * Status Choices
 */
export const NOTE_STATUSES = [
  { value: "pending", label: "Pending", dot: "bg-slate-400" },
  { value: "started", label: "Started", dot: "bg-blue-400" },
  { value: "in_progress", label: "In Progress", dot: "bg-amber-400" },
  { value: "completed", label: "Completed", dot: "bg-emerald-400" },
];

/**
 * Post Privacy Choices
 */
export const POST_PRIVACIES = [
  { value: "public", label: "Public (Everyone)", icon: "Globe" },
  { value: "authenticated", label: "In-App Members Only", icon: "Lock" },
];

