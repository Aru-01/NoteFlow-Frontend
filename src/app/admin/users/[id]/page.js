'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Heart,
  Globe,
  Lock,
  Tag,
  Trash2,
  Eye,
  X,
  RefreshCw,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id;

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  const [targetUser, setTargetUser] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("notes"); // "notes" | "posts"

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal states
  const [selectedNote, setSelectedNote] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all data for this specific user
  const fetchUserData = async () => {
    if (!userId || !isAdmin) return;

    setIsLoading(true);
    setError("");

    try {
      // 1. Fetch user profile from admin endpoint
      const userRes = await api.get(`${ENDPOINTS.AUTH.ADMIN_USERS}${userId}/`);
      setTargetUser(userRes.data);

      // 2. Fetch specific user's notes
      const notesRes = await api.get(ENDPOINTS.NOTES.LIST_CREATE, {
        params: { user_id: userId },
      });
      const notesList = notesRes.data?.results !== undefined 
        ? notesRes.data.results 
        : Array.isArray(notesRes.data) 
        ? notesRes.data 
        : [];
      setUserNotes(notesList);

      // 3. Fetch specific user's community posts
      const postsRes = await api.get(ENDPOINTS.POSTS.LIST_CREATE, {
        params: { author_id: userId },
      });
      const postsList = postsRes.data?.results !== undefined 
        ? postsRes.data.results 
        : Array.isArray(postsRes.data) 
        ? postsRes.data 
        : [];
      setUserPosts(postsList);
    } catch (err) {
      setError("Failed to load user activity or user does not exist.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    if (!isAdmin || !userId) {
      return;
    }

    const loadUserData = async () => {
      try {
        const [userRes, notesRes, postsRes] = await Promise.all([
          api.get(`${ENDPOINTS.AUTH.ADMIN_USERS}${userId}/`),
          api.get(ENDPOINTS.NOTES.LIST_CREATE, { params: { user_id: userId } }),
          api.get(ENDPOINTS.POSTS.LIST_CREATE, { params: { author_id: userId } }),
        ]);

        if (ignore) return;

        setTargetUser(userRes.data);

        const notesList = notesRes.data?.results !== undefined 
          ? notesRes.data.results 
          : Array.isArray(notesRes.data) 
          ? notesRes.data 
          : [];
        setUserNotes(notesList);

        const postsList = postsRes.data?.results !== undefined 
          ? postsRes.data.results 
          : Array.isArray(postsRes.data) 
          ? postsRes.data 
          : [];
        setUserPosts(postsList);
        setError("");
      } catch (err) {
        if (!ignore) {
          setError("Failed to load user activity or user does not exist.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      ignore = true;
    };
  }, [userId, isAdmin]);

  // Toggle user role
  const handleToggleRole = async () => {
    if (!targetUser) return;
    setActionLoading(true);
    const targetRole = targetUser.role === "admin" ? "user" : "admin";

    try {
      await api.patch(`${ENDPOINTS.AUTH.ADMIN_USERS}${targetUser.id}/`, {
        role: targetRole,
      });
      setTargetUser((prev) => ({ ...prev, role: targetRole }));
      setSuccessMsg(`User role updated to ${targetRole.toUpperCase()}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to change user role.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user from system
  const handleDeleteUser = async () => {
    if (!targetUser) return;
    setIsDeleting(true);

    try {
      await api.delete(`${ENDPOINTS.AUTH.ADMIN_USERS}${targetUser.id}/`);
      setSuccessMsg(`User ${targetUser.email} has been permanently deleted.`);
      setTimeout(() => {
        router.push("/admin/users");
      }, 1200);
    } catch (err) {
      setError("Failed to delete user account.");
      setIsDeleting(false);
      setConfirmDeleteModal(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800";
      case "high":
        return "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "medium":
        return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      default:
        return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "in_progress":
        return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "started":
        return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
    }
  };

  // RBAC Permission Guard
  if (!authLoading && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
            RBAC Permission Guard
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Administrator Access Required
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Viewing individual user notes and activity history requires an active Administrator session.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <Link href="/login">
            <Button variant="primary" size="sm">
              Sign In as Admin
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="secondary" size="sm">
              Back to Users List
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Users Management</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {targetUser?.username ? `${targetUser.username}'s Activity Hub` : "User Activity & Records"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Inspection view: reviewing all personal notes, deadlines, and community posts for this account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            isLoading={isLoading}
            onClick={fetchUserData}
          >
            Refresh
          </Button>
          {targetUser && targetUser.id !== user?.id && (
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setConfirmDeleteModal(true)}
            >
              Delete User
            </Button>
          )}
        </div>
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

      {/* User Identity Card */}
      {isLoading ? (
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <Skeleton className="w-48 h-6 rounded" />
          <Skeleton className="w-full h-12 rounded" />
        </div>
      ) : targetUser ? (
        <GlassCard hoverEffect={false} className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                {(targetUser.username || targetUser.email || "U")[0].toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                    {targetUser.username || "Anonymous User"}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                      targetUser.role === "admin"
                        ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {targetUser.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                    {targetUser.role?.toUpperCase()}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      targetUser.is_verified
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    {targetUser.is_verified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Verified Account</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Pending OTP</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{targetUser.email}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Joined {targetUser.created_at ? formatDate(targetUser.created_at) : "N/A"}</span>
                  </span>
                  <span>•</span>
                  <span>User ID: #{targetUser.id}</span>
                </div>
              </div>
            </div>

            {/* Quick Administrative Role Switcher */}
            {targetUser.id !== user?.id && (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={actionLoading}
                  onClick={handleToggleRole}
                >
                  {targetUser.role === "admin" ? "Demote to User" : "Promote to Admin"}
                </Button>
              </div>
            )}
          </div>

          {/* Interests Tags & Activity Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="sm:col-span-1 p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                User Interests
              </span>
              <div className="flex flex-wrap gap-1">
                {targetUser.interests && targetUser.interests.length > 0 ? (
                  targetUser.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 font-medium border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                    >
                      #{interest}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400 italic">No interests specified</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Notes Authored
              </span>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {userNotes.length}
              </p>
              <span className="text-[10px] text-zinc-400">Personal & tracked tasks</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Community Posts
              </span>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {userPosts.length}
              </p>
              <span className="text-[10px] text-zinc-400">Public & in-app discussions</span>
            </div>
          </div>
        </GlassCard>
      ) : null}

      {/* Segmented Tab Controls: Notes vs Posts */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6">
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === "notes"
              ? "text-blue-600 dark:text-blue-400"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>User&apos;s Notes ({userNotes.length})</span>
          {activeTab === "notes" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === "posts"
              ? "text-blue-600 dark:text-blue-400"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Community Feed Posts ({userPosts.length})</span>
          {activeTab === "posts" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            />
          )}
        </button>
      </div>

      {/* TAB 1: User's Notes */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <Skeleton className="w-20 h-4 rounded" />
                  <Skeleton className="w-full h-6 rounded" />
                  <Skeleton className="w-3/4 h-4 rounded" />
                </div>
              ))}
            </div>
          ) : userNotes.length === 0 ? (
            <GlassCard hoverEffect={false} className="p-12 text-center space-y-3">
              <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                No Notes Created Yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                This user has not created any personal tasks or notes in the system.
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userNotes.map((note) => (
                <GlassCard
                  key={note.id}
                  className="p-5 flex flex-col justify-between space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="space-y-2.5">
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold border ${getPriorityBadge(
                          note.priority
                        )}`}
                      >
                        {note.priority}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(
                          note.status
                        )}`}
                      >
                        {note.status?.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {note.description || <span className="italic text-zinc-400">No description provided.</span>}
                    </p>

                    {/* Countdown Timer */}
                    <div className="pt-1">
                      <CountdownTimer targetDate={note.approx_end_date} />
                    </div>
                  </div>

                  {/* Dates & Actions */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    {(note.start_date || note.approx_end_date) ? (
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {note.start_date || "Start"} &rarr; {note.approx_end_date || "No deadline"}
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-400">Created {formatDate(note.created_at)}</span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(note);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: User's Community Posts */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <Skeleton className="w-32 h-4 rounded" />
                  <Skeleton className="w-full h-8 rounded" />
                </div>
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <GlassCard hoverEffect={false} className="p-12 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                No Community Posts
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                This user has not published any perspectives or updates in the community feed.
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPosts.map((post) => (
                <GlassCard key={post.id} hoverEffect={false} className="p-5 sm:p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          post.privacy === "public"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {post.privacy === "public" ? (
                          <>
                            <Globe className="w-3 h-3" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>In-App Members</span>
                          </>
                        )}
                      </span>

                      <span className="text-[11px] text-zinc-400 font-medium">
                        {post.created_at ? formatDate(post.created_at) : ""}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                      {post.caption}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5 text-rose-500">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {post.react_count || 0}
                      </span>
                      <span className="text-[11px] text-zinc-400">reactions</span>
                    </div>

                    <span className="text-[11px] text-zinc-400">
                      Post ID: #{post.id}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note Details Modal */}
      <AnimatePresence>
        {selectedNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5 my-8"
            >
              <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold border ${getPriorityBadge(
                        selectedNote.priority
                      )}`}
                    >
                      {selectedNote.priority}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        selectedNote.status
                      )}`}
                    >
                      {selectedNote.status?.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                    {selectedNote.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Countdown Banner */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                  Time Remaining Until Deadline
                </span>
                <CountdownTimer targetDate={selectedNote.approx_end_date} />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Description & Context
                </span>
                <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                  {selectedNote.description || <span className="italic text-zinc-400">No description provided.</span>}
                </div>
              </div>

              {/* Timeframes */}
              <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="space-y-0.5">
                  <span className="text-zinc-400 text-[11px]">Start Date</span>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">
                    {selectedNote.start_date || "Not specified"}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-400 text-[11px]">Approx End Date</span>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">
                    {selectedNote.approx_end_date || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedNote(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete User Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteModal && targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Confirm Account Removal
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Irreversible administrative action
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-1">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Are you sure you want to remove user:
                </p>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {targetUser.email} ({targetUser.username || "no username"})
                </p>
                <p className="text-[11px] text-zinc-500 pt-1">
                  This will purge their account, notes ({userNotes.length}), and posts ({userPosts.length}) from the system.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmDeleteModal(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={isDeleting}
                  onClick={handleDeleteUser}
                >
                  Confirm Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

