'use client';

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Filter, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Lock, 
  MoreVertical,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Mail,
  UserCheck
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  const { user, setMockRole } = useAuth();
  const isAdmin = user?.role === "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Initial mock users list aligning with Django backend data structure
  const [usersList, setUsersList] = useState([
    {
      id: 1,
      email: "admin@noteflow.dev",
      username: "arif_admin",
      role: "admin",
      is_verified: true,
      interests: ["architecture", "security", "django"],
      created_at: "2026-10-25",
    },
    {
      id: 2,
      email: "alex.turner@company.com",
      username: "alex_turner",
      role: "user",
      is_verified: true,
      interests: ["coding", "react", "nextjs"],
      created_at: "2026-10-26",
    },
    {
      id: 3,
      email: "sara.chen@techlab.io",
      username: "sara_chen",
      role: "user",
      is_verified: true,
      interests: ["chess", "algorithms", "reading"],
      created_at: "2026-10-27",
    },
    {
      id: 4,
      email: "dev.candidate@gmail.com",
      username: "dev_candidate",
      role: "user",
      is_verified: false,
      interests: ["python", "machine-learning"],
      created_at: "2026-10-29",
    },
    {
      id: 5,
      email: "security.lead@noteflow.dev",
      username: "sec_auditor",
      role: "admin",
      is_verified: true,
      interests: ["rbac", "jwt", "otp"],
      created_at: "2026-10-24",
    },
    {
      id: 6,
      email: "maria.garcia@design.co",
      username: "maria_ui",
      role: "user",
      is_verified: false,
      interests: ["ui-ux", "design", "figma"],
      created_at: "2026-10-30",
    },
  ]);

  // Handle role toggle simulation
  const handleToggleRole = (id) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newRole = u.role === "admin" ? "user" : "admin";
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  // Filter users based on search and pills
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && u.is_verified) ||
      (filterStatus === "pending" && !u.is_verified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // If user is not admin, show permission barrier with quick one-click preview helper
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
            This module (/admin/users) is protected by Django REST Framework Role-Based Access Control
            and requires an authenticated administrator session.
          </p>
        </div>

        {/* Quick simulator helper */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs space-y-3">
          <p className="text-zinc-600 dark:text-zinc-400">
            You can test this view right now by simulating the Admin role:
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={ShieldCheck}
              onClick={() => setMockRole("admin")}
            >
              Simulate Admin Login
            </Button>
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Full Admin User Management View
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
            User Management & Roles
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Manage user verification status, assign administrator privileges, and review interest arrays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => setSearchQuery("")}
          >
            Reset
          </Button>
          <Link href="/register">
            <Button variant="primary" size="sm" icon={UserPlus}>
              Invite New User
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard hoverEffect={false} className="p-4 space-y-1">
          <span className="text-xs text-zinc-500">Total Users</span>
          <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            {usersList.length}
          </p>
          <span className="text-[10px] text-zinc-400">Registered accounts</span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-4 space-y-1">
          <span className="text-xs text-zinc-500">Admins</span>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {usersList.filter((u) => u.role === "admin").length}
          </p>
          <span className="text-[10px] text-zinc-400">Privileged accounts</span>
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
          <span className="text-[10px] text-zinc-400">Awaiting 6-digit code</span>
        </GlassCard>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
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

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
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

          {/* Verification Status Filter */}
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

      {/* Users Data Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#121215] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">OTP Verification</th>
                <th className="py-3 px-4">Interests Array</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No users matching &quot;{searchQuery}&quot; found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* User Identity */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold flex items-center justify-center text-xs">
                          {u.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {u.username}
                          </p>
                          <p className="text-[11px] text-zinc-500 font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          u.role === "admin"
                            ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {u.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Verification Status */}
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

                    {/* Interests Chips */}
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

                    {/* Created Date */}
                    <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                      {u.created_at}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleRole(u.id)}
                        className="px-2.5 py-1 rounded text-[11px] font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                        title="Toggle Admin / User Role"
                      >
                        {u.role === "admin" ? "Demote to User" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

