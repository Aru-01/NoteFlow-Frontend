'use client';

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Heart, 
  Globe, 
  Lock, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Tag,
  Sparkles,
  PieChart,
  MessageSquare
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

function PostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  // Data states
  const [posts, setPosts] = useState([]);
  const [interestGroups, setInterestGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState(searchParams.get("author_id") || "");

  // Pagination
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    current: 1,
  });

  // Modal states: "create" | "edit" | "delete" | null
  const [modalMode, setModalMode] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [caption, setCaption] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [reactingPostId, setReactingPostId] = useState(null);

  // Fetch posts from Django backend
  const fetchPosts = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError("");

    try {
      const params = { page };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (privacyFilter !== "all") params.privacy = privacyFilter;
      if (authorFilter.trim()) params.author_id = authorFilter.trim();

      const res = await api.get(ENDPOINTS.POSTS.LIST_CREATE, { params });
      const results = res.data?.results !== undefined 
        ? res.data.results 
        : Array.isArray(res.data) 
        ? res.data 
        : [];

      setPosts(results);
      setPagination({
        count: res.data?.count || results.length,
        next: res.data?.next || null,
        previous: res.data?.previous || null,
        current: page,
      });
    } catch (err) {
      setError("Failed to load community feed. Please check backend connection.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, privacyFilter, authorFilter]);

  // Fetch Scenario 1: Group by Interests Aggregations
  const fetchInterestGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const res = await api.get(ENDPOINTS.POSTS.GROUP_BY_INTERESTS);
      setInterestGroups(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // Non-blocking
    } finally {
      setIsLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    fetchInterestGroups();
  }, [fetchPosts]);

  // Handle post reaction toggle
  const handleToggleReaction = async (postId) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/posts");
      return;
    }

    setReactingPostId(postId);

    try {
      const res = await api.post(ENDPOINTS.POSTS.REACT(postId), {
        reaction_type: "like",
      });

      // Update state with backend response
      const { reacted, react_count } = res.data;
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              has_reacted: reacted,
              react_count: react_count !== undefined ? react_count : p.react_count,
            };
          }
          return p;
        })
      );
    } catch (err) {
      // Rollback
    } finally {
      setReactingPostId(null);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/posts");
      return;
    }
    setCaption("");
    setPrivacy("public");
    setFormError("");
    setModalMode("create");
  };

  // Open Edit Modal
  const handleOpenEdit = (post) => {
    setSelectedPost(post);
    setCaption(post.caption || "");
    setPrivacy(post.privacy || "public");
    setFormError("");
    setModalMode("edit");
  };

  // Open Delete Modal
  const handleOpenDelete = (post) => {
    setSelectedPost(post);
    setModalMode("delete");
  };

  // Submit Post Create or Edit
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!caption.trim()) {
      setFormError("Caption cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalMode === "create") {
        const res = await api.post(ENDPOINTS.POSTS.LIST_CREATE, {
          caption: caption.trim(),
          privacy: privacy,
        });
        setPosts((prev) => [res.data, ...prev]);
        setSuccessMsg("Post shared successfully to community!");
      } else if (modalMode === "edit" && selectedPost) {
        const res = await api.patch(ENDPOINTS.POSTS.DETAIL(selectedPost.id), {
          caption: caption.trim(),
          privacy: privacy,
        });
        setPosts((prev) =>
          prev.map((p) => (p.id === selectedPost.id ? res.data : p))
        );
        setSuccessMsg("Post updated successfully!");
      }

      setModalMode(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.caption) {
        setFormError(Array.isArray(resp.caption) ? resp.caption[0] : resp.caption);
      } else if (resp?.detail) {
        setFormError(resp.detail);
      } else {
        setFormError("Failed to save post.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete post
  const handleConfirmDelete = async () => {
    if (!selectedPost) return;
    setIsSubmitting(true);

    try {
      await api.delete(ENDPOINTS.POSTS.DETAIL(selectedPost.id));
      setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      setSuccessMsg("Post deleted successfully.");
      setModalMode(null);
      setSelectedPost(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to delete post. Author or admin permission required.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold">
              Live API
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-mono">/api/v1/posts/</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
            Community Feed
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Public community perspectives & authenticated discussions with real-time reaction toggle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            isLoading={isLoading}
            onClick={() => fetchPosts(pagination.current)}
          >
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Share a Thought
          </Button>
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

      {/* Main Layout: Feed Stream + Aggregations Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Feed Stream (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Toolbar */}
          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search caption..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white text-xs"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="text-zinc-400 text-[11px]">Privacy:</span>
              {[
                { id: "all", label: "All Posts" },
                { id: "public", label: "Public" },
                { id: "authenticated", label: "In-App Members" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPrivacyFilter(p.id)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                    privacyFilter === p.id
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Author Filter Banner */}
          {authorFilter && (
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
              <span>Filtering posts authored by User #{authorFilter}</span>
              <button
                onClick={() => setAuthorFilter("")}
                className="text-xs font-semibold hover:underline cursor-pointer"
              >
                Clear Author Filter
              </button>
            </div>
          )}

          {/* Posts List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                  <Skeleton className="w-full h-14 rounded" />
                  <Skeleton className="w-20 h-4" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <GlassCard hoverEffect={false} className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                  No community posts found
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Be the first to publish a perspective to the community feed.
                </p>
              </div>
              <div className="pt-2">
                <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
                  Share the First Post
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const isAuthor = user?.id === post.author?.id;
                const canModify = isAuthor || isAdmin;

                return (
                  <GlassCard
                    key={post.id}
                    hoverEffect={false}
                    className="p-5 space-y-3.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold flex items-center justify-center text-xs">
                          {(post.author?.username || post.author?.email || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                              {post.author?.username || post.author?.email?.split("@")[0]}
                            </span>
                            {post.author?.id && (
                              <button
                                onClick={() => setAuthorFilter(String(post.author.id))}
                                title="Filter posts by this author"
                                className="text-[10px] text-zinc-400 hover:text-blue-500 font-mono"
                              >
                                #{post.author.id}
                              </button>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {post.created_at ? formatDate(post.created_at) : ""}
                          </span>
                        </div>
                      </div>

                      {/* Privacy Badge */}
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
                    </div>

                    {/* Caption / Content */}
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                      {post.caption}
                    </p>

                    {/* Author Interest Tags */}
                    {post.author?.interests && post.author.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {post.author.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-[10px] text-zinc-600 dark:text-zinc-400 font-medium"
                          >
                            #{interest}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                      {/* Reaction Toggle Button */}
                      <button
                        onClick={() => handleToggleReaction(post.id)}
                        disabled={reactingPostId === post.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          post.has_reacted
                            ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-semibold"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            post.has_reacted ? "fill-rose-500 text-rose-500" : ""
                          }`}
                        />
                        <span>{post.react_count || 0}</span>
                        <span className="text-[11px] font-normal text-zinc-400">
                          {post.react_count === 1 ? "reaction" : "reactions"}
                        </span>
                      </button>

                      {/* Author/Admin Actions */}
                      {canModify && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(post)}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit Post"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(post)}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.count > 10 && (
            <div className="pt-4 flex items-center justify-between text-xs text-zinc-500">
              <span>
                Page {pagination.current} of {Math.ceil(pagination.count / 10)}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronLeft}
                  disabled={!pagination.previous}
                  onClick={() => fetchPosts(pagination.current - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronRight}
                  disabled={!pagination.next}
                  onClick={() => fetchPosts(pagination.current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Scenario 1 - Interest Groups & Community Circles */}
        <div className="space-y-4">
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Interest Circles
                </h3>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/60">
                Active Circles
              </span>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Real-time aggregation pipeline grouping community members by shared interest arrays.
            </p>

            {isLoadingGroups ? (
              <div className="space-y-2">
                <Skeleton className="w-full h-8 rounded" />
                <Skeleton className="w-full h-8 rounded" />
              </div>
            ) : interestGroups.length === 0 ? (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-center text-xs text-zinc-500">
                No interest groups formed yet. Add interests in your{" "}
                <Link href="/profile" className="text-blue-500 underline font-medium">
                  Profile
                </Link>{" "}
                to start circles!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {interestGroups.map((group) => (
                  <div
                    key={group.interest}
                    className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        #{group.interest}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {group.user_count} {group.user_count === 1 ? "member" : "members"}
                      </span>
                    </div>

                    {/* Member Avatars / Names */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {group.users?.map((u) => (
                        <span
                          key={u.id}
                          className="inline-flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700"
                        >
                          <UserIcon className="w-2.5 h-2.5 text-zinc-400" />
                          <span>{u.username || u.email?.split("@")[0]}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick Info Box */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-xs text-zinc-500 space-y-2">
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">
              Dual Privacy Architecture
            </h4>
            <p className="leading-relaxed">
              Public posts are visible to any unauthenticated visitor, while In-App Member posts are
              strictly gated behind JWT session verification.
            </p>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT POST MODAL */}
      <AnimatePresence>
        {(modalMode === "create" || modalMode === "edit") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {modalMode === "create" ? "Share a New Thought" : "Edit Post"}
                </h3>
                <button
                  onClick={() => setModalMode(null)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitPost} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Caption / Content <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Share what you are working on, ideas, or architectural thoughts..."
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white resize-none text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Visibility & Privacy
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPrivacy("public")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        privacy === "public"
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
                          : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-white">
                        <Globe className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Public</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Visible to all visitors & search queries
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrivacy("authenticated")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        privacy === "authenticated"
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                          : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-white">
                        <Lock className="w-3.5 h-3.5 text-blue-500" />
                        <span>In-App Members</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Restricted to verified authenticated users
                      </p>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setModalMode(null)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    {modalMode === "create" ? "Publish Thought" : "Save Changes"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {modalMode === "delete" && selectedPost && (
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
                      Delete Post
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Are you sure you want to delete this post?
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalMode(null)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 text-xs">
                <p className="text-zinc-700 dark:text-zinc-300 line-clamp-3">
                  &ldquo;{selectedPost.caption}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setModalMode(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  isLoading={isSubmitting}
                  onClick={handleConfirmDelete}
                >
                  Delete Post
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-500">Loading community feed...</div>}>
      <PostsContent />
    </Suspense>
  );
}
