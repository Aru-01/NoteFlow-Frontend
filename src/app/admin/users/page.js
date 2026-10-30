'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Filter, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Lock, 
  RefreshCw,
  Trash2,
  AlertTriangle,
  AlertCircle,
  X
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { TableRowSkeleton } from "@/components/ui/LoadingSkeleton";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal state for delete confirmation
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get(ENDPOINTS.AUTH.ADMIN_USERS);
      const data = res.data?.results || res.data || [];
      setUsersList(data);
    } catch (err) {
      setError("Failed to fetch users from backend. Please verify your admin credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin]);

  // Toggle user role (Admin <-> User)
  const handleToggleRole = async (userId, currentRole) => {
    setActionLoading(userId);
    const targetRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api.patch(`${ENDPOINTS.AUTH.ADMIN_USERS}${userId}/`, {
        role: targetRole,
      });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
      );
      setSuccessMsg(`User role updated to ${targetRole}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to update user role.");
    } finally {
      setActionLoading(null);
    }
  };

  // Remove / Delete user from database
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`${ENDPOINTS.AUTH.ADMIN_USERS}${userToDelete.id}/`);
      setUsersList((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setSuccessMsg(`User "${userToDelete.email}" has been successfully removed.`);
      setTimeout(() => setSuccessMsg(""), 3500);
      setUserToDelete(null);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && u.is_verified) ||
      (filterStatus === "pending" && !u.is_verified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
            RBAC Permission Guard
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Administrator Access Required
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            This module (/auth/admin/users/) requires an active session with Administrator privileges.
          </p>
        </div>

        <div className="flex justify-center gap-2">
          <Link href="/login">
            <Button variant="primary" size="sm">
              Sign In as Admin
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold">
              Admin Portal
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-mono">/auth/admin/users/</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
            User Management & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Manage user roles, verify account statuses, and remove user accounts from the database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            isLoading={isLoading}
            onClick={fetchUsers}
          >
            Refresh Data
          </Button>
          <Link href="/register">
            <Button variant="primary" size="sm" icon={UserPlus}>
              Register New User
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard hoverEffect={false} className="p-4 space-y-1">
          <span className="text-xs text-zinc-500">Total Users</span>
          <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            {usersList.length}
          </p>
          <span className="text-[10px] text-zinc-400">Database rows</span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-4 space-y-1">
          <span className="text-xs text-zinc-500">Admins</span>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {usersList.filter((u) => u.role === "admin").length}
          </p>
          <span className="text-[10px] text-zinc-400">Role: Admin</span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-4 space-y-1">
          <span className="text-xs text-zinc-500">OTP Verified</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {usersList.filter((u) => u.is_verified).length}
          </p>
          <span className="text-[10px] text-zinc-400">Email confirmed</span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-4 space-y-1">
          <span className="text-xs text-zinc-500">Pending OTP</span>
          <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {usersList.filter((u) => !u.is_verified).length}
          </p>
          <span className="text-[10px] text-zinc-400">Unverified</span>
        </GlassCard>
      </div>

      {/* Toolbar */}
      <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search email or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-zinc-500">Role:</span>
            {["all", "admin", "user"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                  filterRole === r
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>

          <div className="flex items-center gap-1">
            <span className="text-zinc-500">Status:</span>
            {[
              { id: "all", label: "All" },
              { id: "verified", label: "Verified" },
              { id: "pending", label: "Pending" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  filterStatus === st.id
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#121215] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">OTP Verification</th>
                <th className="py-3 px-4">Interests Array</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {isLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No users found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold flex items-center justify-center text-xs">
                          {(u.username || u.email || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {u.username || "Anonymous"}
                          </p>
                          <p className="text-[11px] text-zinc-500 font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          u.role === "admin"
                            ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {u.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                        {(u.role || "USER").toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          u.is_verified
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {u.is_verified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>Pending OTP</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.interests && u.interests.length > 0 ? (
                          u.interests.map((interest) => (
                            <span
                              key={interest}
                              className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400 font-mono"
                            >
                              #{interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-zinc-400 italic">None</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Toggle Role Button */}
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          disabled={actionLoading === u.id || u.id === user?.id}
                          className="px-2.5 py-1 rounded text-[11px] font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer disabled:opacity-40"
                          title={u.id === user?.id ? "Cannot change own role" : "Toggle Role"}
                        >
                          {actionLoading === u.id
                            ? "Updating..."
                            : u.role === "admin"
                            ? "Demote to User"
                            : "Make Admin"}
                        </button>

                        {/* Remove / Delete User Button */}
                        <button
                          onClick={() => setUserToDelete(u)}
                          disabled={u.id === user?.id}
                          className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
                          title={u.id === user?.id ? "Cannot delete own account" : "Remove user from system"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      Confirm User Deletion
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Permanent action: cannot be undone
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setUserToDelete(null)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-1">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Are you sure you want to remove user:
                </p>
                <p className="font-mono font-semibold text-zinc-900 dark:text-white">
                  {userToDelete.email} ({userToDelete.username || "no username"})
                </p>
                <p className="text-[11px] text-zinc-500 pt-1">
                  This will purge their account, notes, and activity from the database.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  isLoading={isDeleting}
                  onClick={confirmDeleteUser}
                >
                  Delete User
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
