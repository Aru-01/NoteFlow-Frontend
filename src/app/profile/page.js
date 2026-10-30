'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Tag, 
  Plus, 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, updateProfile } = useAuth();

  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Populate user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setInterests(Array.isArray(user.interests) ? user.interests : []);
    }
  }, [user]);

  // Add an interest tag
  const handleAddInterest = (e) => {
    if (e) e.preventDefault();
    const cleanTag = interestInput.trim().toLowerCase();
    if (cleanTag && !interests.includes(cleanTag)) {
      setInterests([...interests, cleanTag]);
      setInterestInput("");
    }
  };

  // Remove an interest tag
  const handleRemoveInterest = (tagToRemove) => {
    setInterests(interests.filter((tag) => tag !== tagToRemove));
  };

  // Submit profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      await updateProfile({
        username: username.trim(),
        interests: interests,
      });
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.username) {
        setError(Array.isArray(resp.username) ? resp.username[0] : resp.username);
      } else if (resp?.detail) {
        setError(resp.detail);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guard for unauthenticated visitor
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-700">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Sign In Required
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Please log in to your account to view and update your user profile.
          </p>
        </div>
        <Link href="/login?redirect=/profile">
          <Button variant="primary" size="md" icon={ArrowRight}>
            Go to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold">
            Account Settings
          </span>
          <span className="text-xs text-zinc-400">•</span>
          <span className="text-xs text-zinc-500 font-mono">/auth/profile/</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
          Personal Profile
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
          View your verified account credentials, manage your display username, and customize community interest tags.
        </p>
      </div>

      {/* Notifications */}
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

      {/* Profile Form Card */}
      <GlassCard hoverEffect={false} className="p-6 sm:p-8 space-y-6">
        {/* Account Identity Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-base shadow-xs">
              {(username || user?.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                {username || "User"}
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              Role: {(user?.role || "USER").toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Account</span>
            </span>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* Email (Read-Only) */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address (Primary Credential)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 cursor-not-allowed select-none"
              />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Email is permanently verified via 6-digit OTP and cannot be modified directly.
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Display Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter unique display username"
                className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
          </div>

          {/* Interests Manager */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Interests & Topics (Used in Scenario 1 Group Aggregations)
            </label>

            {/* Existing tags list */}
            <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 min-h-12 mb-2">
              {interests.length === 0 ? (
                <span className="text-xs text-zinc-400 italic">
                  No interests added yet. Add topics below to match with community members.
                </span>
              ) : (
                interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                  >
                    <span>#{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-zinc-400 hover:text-rose-500 ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Input to add tag */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  placeholder="Type an interest (e.g. coding, chess, ai) and press Enter"
                  className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="md"
                icon={Plus}
                onClick={handleAddInterest}
              >
                Add Tag
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              isLoading={isSubmitting}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

