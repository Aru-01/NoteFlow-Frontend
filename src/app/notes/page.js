"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Clock,
  Lock,
  Trash2,
  Edit3,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Users,
  Eye,
  Check,
  Tag,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";

function NotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  // Admin View Scope: "my" (personal notes) or "all" (all users' notes across the system)
  const viewParam = searchParams.get("view");
  const adminView = isAdmin && viewParam === "all" ? "all" : "my";

  // Data & Loading states
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminUserFilter, setAdminUserFilter] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    current: 1,
  });

  // Modal states: "create" | "edit" | "delete" | "detail" | null
  const [modalMode, setModalMode] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const initialFormState = {
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    start_date: "",
    approx_end_date: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // Manual & Paginated fetch
  const fetchNotes = async (page = 1) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError("");

    try {
      const params = { page };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (filterPriority !== "all") params.priority = filterPriority;
      if (filterStatus !== "all") params.status = filterStatus;

      if (isAdmin) {
        if (adminView === "my" && user?.id) {
          params.user_id = user.id;
        } else if (adminView === "all" && adminUserFilter.trim()) {
          params.user_id = adminUserFilter.trim();
        }
      }

      const res = await api.get(ENDPOINTS.NOTES.LIST_CREATE, { params });
      const results =
        res.data?.results !== undefined
          ? res.data.results
          : Array.isArray(res.data)
            ? res.data
            : [];

      setNotes(results);
      setPagination({
        count: res.data?.count || results.length,
        next: res.data?.next || null,
        previous: res.data?.previous || null,
        current: page,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else {
        setError("Failed to load notes. Please verify backend connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial and reactive fetch
  useEffect(() => {
    let ignore = false;

    if (authLoading || !isAuthenticated) {
      return;
    }

    const loadNotes = async () => {
      try {
        const params = { page: 1 };
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (filterPriority !== "all") params.priority = filterPriority;
        if (filterStatus !== "all") params.status = filterStatus;

        if (isAdmin) {
          if (adminView === "my" && user?.id) {
            params.user_id = user.id;
          } else if (adminView === "all" && adminUserFilter.trim()) {
            params.user_id = adminUserFilter.trim();
          }
        }

        const res = await api.get(ENDPOINTS.NOTES.LIST_CREATE, { params });
        if (ignore) return;

        const results =
          res.data?.results !== undefined
            ? res.data.results
            : Array.isArray(res.data)
              ? res.data
              : [];

        setNotes(results);
        setPagination({
          count: res.data?.count || results.length,
          next: res.data?.next || null,
          previous: res.data?.previous || null,
          current: 1,
        });
        setError("");
      } catch (err) {
        if (!ignore) {
          if (err.response?.status === 401) {
            setError("Your session has expired. Please sign in again.");
          } else {
            setError("Failed to load notes. Please verify backend connection.");
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      ignore = true;
    };
  }, [
    authLoading,
    isAuthenticated,
    searchQuery,
    filterPriority,
    filterStatus,
    adminUserFilter,
    isAdmin,
    adminView,
    user,
  ]);

  // Switch Admin Scope View
  const handleAdminViewChange = (newView) => {
    router.replace(`/notes?view=${newView}`, { scroll: false });
  };

  // Open Task Details Modal
  const handleOpenDetail = (note) => {
    setSelectedNote(note);
    setModalMode("detail");
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setFormError("");
    setModalMode("create");
  };

  // Open Edit Modal
  const handleOpenEdit = (note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title || "",
      description: note.description || "",
      priority: note.priority || "medium",
      status: note.status || "pending",
      start_date: note.start_date || "",
      approx_end_date: note.approx_end_date || "",
    });
    setFormError("");
    setModalMode("edit");
  };

  // Open Delete Modal
  const handleOpenDelete = (note) => {
    setSelectedNote(note);
    setModalMode("delete");
  };

  // Submit Create or Edit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Title is required.");
      return;
    }

    if (
      formData.start_date &&
      formData.approx_end_date &&
      formData.approx_end_date < formData.start_date
    ) {
      setFormError("Approximate end date cannot be earlier than start date.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      start_date: formData.start_date || null,
      approx_end_date: formData.approx_end_date || null,
    };

    try {
      if (modalMode === "create") {
        const res = await api.post(ENDPOINTS.NOTES.LIST_CREATE, payload);
        setNotes((prev) => [res.data, ...prev]);
        setSuccessMsg("Note created successfully!");
      } else if (modalMode === "edit" && selectedNote) {
        const res = await api.patch(
          ENDPOINTS.NOTES.DETAIL(selectedNote.id),
          payload,
        );
        setNotes((prev) =>
          prev.map((n) => (n.id === selectedNote.id ? res.data : n)),
        );
        if (selectedNote?.id === res.data.id) {
          setSelectedNote(res.data);
        }
        setSuccessMsg("Note updated successfully!");
      }

      setModalMode(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.approx_end_date) {
        setFormError(
          Array.isArray(resp.approx_end_date)
            ? resp.approx_end_date[0]
            : resp.approx_end_date,
        );
      } else if (resp?.title) {
        setFormError(Array.isArray(resp.title) ? resp.title[0] : resp.title);
      } else if (resp?.detail) {
        setFormError(resp.detail);
      } else {
        setFormError("Failed to save note. Please check inputs.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick inline status update
  const handleQuickStatusChange = async (noteId, newStatus) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, status: newStatus } : n)),
    );
    if (selectedNote?.id === noteId) {
      setSelectedNote({ ...selectedNote, status: newStatus });
    }

    try {
      await api.patch(ENDPOINTS.NOTES.DETAIL(noteId), { status: newStatus });
    } catch (err) {
      fetchNotes(pagination.current);
    }
  };

  // Confirm delete note
  const handleConfirmDelete = async () => {
    if (!selectedNote) return;
    setIsSubmitting(true);

    try {
      await api.delete(ENDPOINTS.NOTES.DETAIL(selectedNote.id));
      setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id));
      setSuccessMsg("Note deleted successfully.");
      setModalMode(null);
      setSelectedNote(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to delete note.");
    } finally {
      setIsSubmitting(false);
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
      case "low":
      default:
        return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "in_progress":
        return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "started":
        return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "pending":
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
    }
  };

  // Non-authenticated state: show guard banner
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-700">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
            Authentication Required
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Access Your Notes Workspace
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            NoteFlow keeps your notes private and encrypted per user account.
            Please sign in or register to create and manage your notes.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link href="/login?redirect=/notes">
            <Button variant="primary" size="md">
              Sign In to Notes
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="md">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isViewingMyNotes = !isAdmin || adminView === "my";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {isAdmin
              ? adminView === "my"
                ? "My Notes"
                : "Users' Notes"
              : "My Notes"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            {isAdmin
              ? adminView === "my"
                ? "Your personal tasks, priorities, and deadlines."
                : "Workspace overview: viewing notes across all users in the system."
              : "Plan your day, set clear priorities, and keep every deadline in sight with live countdowns."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Admin Sub-nav Toggle Tabs (Only shown for Admin) */}
          {isAdmin && (
            <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 mr-1">
              <button
                onClick={() => handleAdminViewChange("my")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  adminView === "my"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-2xs font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>My Notes</span>
              </button>

              <button
                onClick={() => handleAdminViewChange("all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  adminView === "all"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-2xs font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>Users&apos; Notes</span>
              </button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            isLoading={isLoading}
            onClick={() => fetchNotes(pagination.current)}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            New Note
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

      {/* Simplified, Clean Search & Filter Bar */}
      <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Simple Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white text-xs"
          />
        </div>

        {/* Clean Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-400 text-[11px]">Status:</span>
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "started", label: "Started" },
              { id: "in_progress", label: "In Progress" },
              { id: "completed", label: "Done" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  filterStatus === st.id
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">
            •
          </span>

          {/* Priority Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-400 text-[11px]">Priority:</span>
            {["all", "urgent", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2 py-0.5 rounded capitalize text-[11px] transition-colors cursor-pointer ${
                  filterPriority === p
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Admin-only User ID Filter (STRICTLY only shown in 'Users Notes' view, never in 'My Notes') */}
          {isAdmin && adminView === "all" && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">
                •
              </span>
              <div className="flex items-center gap-1">
                <span className="text-zinc-400 text-[11px]">User ID:</span>
                <input
                  type="number"
                  placeholder="ID..."
                  value={adminUserFilter}
                  onChange={(e) => setAdminUserFilter(e.target.value)}
                  className="w-16 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] space-y-3"
            >
              <div className="flex justify-between">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-32 h-4" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <GlassCard hoverEffect={false} className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              {searchQuery ||
              filterPriority !== "all" ||
              filterStatus !== "all" ||
              adminUserFilter
                ? "No notes match your active filters"
                : isViewingMyNotes
                  ? "You haven't created any notes yet"
                  : "No notes found in the system"}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {searchQuery ||
              filterPriority !== "all" ||
              filterStatus !== "all" ||
              adminUserFilter
                ? "Try adjusting your search keywords or clear the active filters."
                : "Create your first task to start organizing deadlines with live countdown timers."}
            </p>
          </div>

          <div className="pt-2">
            {searchQuery ||
            filterPriority !== "all" ||
            filterStatus !== "all" ||
            adminUserFilter ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterPriority("all");
                  setFilterStatus("all");
                  setAdminUserFilter("");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleOpenCreate}
              >
                Create Your First Note
              </Button>
            )}
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <GlassCard
              key={note.id}
              className="p-5 flex flex-col justify-between space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
              onClick={() => handleOpenDetail(note)}
            >
              <div className="space-y-2.5">
                {/* Priority & Status Badges */}
                <div
                  className="flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold border ${getPriorityBadge(
                      note.priority,
                    )}`}
                  >
                    {note.priority}
                  </span>

                  {/* Inline quick status selector */}
                  <select
                    value={note.status}
                    onChange={(e) =>
                      handleQuickStatusChange(note.id, e.target.value)
                    }
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                      note.status,
                    )}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="started">Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {note.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {note.description || (
                    <span className="italic text-zinc-400">
                      No description provided.
                    </span>
                  )}
                </p>

                {/* Real-Time Countdown Timer */}
                <div className="pt-1">
                  <CountdownTimer targetDate={note.approx_end_date} />
                </div>
              </div>

              {/* Note Metadata & Action Buttons */}
              <div
                className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Dates Information */}
                {(note.start_date || note.approx_end_date) && (
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span>
                      {note.start_date || "Start"} &rarr;{" "}
                      {note.approx_end_date || "No deadline"}
                    </span>
                  </div>
                )}

                {/* Author attribution (Shown only when admin is viewing Users' Notes) */}
                {isAdmin && adminView === "all" && note.owner_email && (
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-0.5">
                    <UserIcon className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span className="truncate">
                      Author:{" "}
                      <strong className="text-zinc-700 dark:text-zinc-300">
                        {note.owner_username || note.owner_email.split("@")[0]}
                      </strong>
                    </span>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleOpenDetail(note)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Details</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Edit Note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(note)}
                      className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {pagination.count > 10 && (
        <div className="pt-4 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Page {pagination.current} of {Math.ceil(pagination.count / 10)} (
            {pagination.count} total)
          </span>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={!pagination.previous}
              onClick={() => fetchNotes(pagination.current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronRight}
              disabled={!pagination.next}
              onClick={() => fetchNotes(pagination.current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* 1. TASK DETAILS MODAL */}
      <AnimatePresence>
        {modalMode === "detail" && selectedNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold border ${getPriorityBadge(
                        selectedNote.priority,
                      )}`}
                    >
                      {selectedNote.priority}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        selectedNote.status,
                      )}`}
                    >
                      {selectedNote.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                    {selectedNote.title}
                  </h2>
                </div>

                <button
                  onClick={() => setModalMode(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
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

              {/* Full Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Description & Context
                </span>
                <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                  {selectedNote.description || (
                    <span className="italic text-zinc-400">
                      No description provided.
                    </span>
                  )}
                </div>
              </div>

              {/* Timeframe & Author Details */}
              <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="space-y-0.5">
                  <span className="text-zinc-400 text-[11px]">Start Date</span>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">
                    {selectedNote.start_date || "Not specified"}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-400 text-[11px]">
                    Approx End Date
                  </span>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">
                    {selectedNote.approx_end_date || "Not specified"}
                  </p>
                </div>
                {selectedNote.owner_email && (
                  <div className="col-span-2 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-0.5">
                    <span className="text-zinc-400 text-[11px]">Author</span>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {selectedNote.owner_username ||
                        selectedNote.owner_email.split("@")[0]}{" "}
                      ({selectedNote.owner_email})
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-400">Change Status:</span>
                  <select
                    value={selectedNote.status}
                    onChange={(e) =>
                      handleQuickStatusChange(selectedNote.id, e.target.value)
                    }
                    className="text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="started">Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit3}
                    onClick={() => {
                      setModalMode(null);
                      setTimeout(() => handleOpenEdit(selectedNote), 100);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => {
                      setModalMode(null);
                      setTimeout(() => handleOpenDelete(selectedNote), 100);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. CREATE / EDIT NOTE MODAL */}
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
                  {modalMode === "create"
                    ? "Create New Note"
                    : "Edit Note Details"}
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

              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Design sprint planning"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter detailed action items or context..."
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white resize-none"
                  />
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Priority Tier
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["low", "medium", "high", "urgent"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, priority: p })
                        }
                        className={`py-1.5 rounded-lg capitalize text-[11px] font-semibold border transition-all cursor-pointer ${
                          formData.priority === p
                            ? p === "urgent"
                              ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-400 font-bold"
                              : p === "high"
                                ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-400 font-bold"
                                : p === "medium"
                                  ? "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-400 font-bold"
                                  : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-400 font-bold"
                            : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Lifecycle Status
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "pending", label: "Pending" },
                      { id: "started", label: "Started" },
                      { id: "in_progress", label: "In Progress" },
                      { id: "completed", label: "Completed" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, status: st.id })
                        }
                        className={`py-1.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                          formData.status === st.id
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold border-zinc-900 dark:border-white"
                            : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates: Start & Approx End */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Approx End Date (Countdown Deadline)
                    </label>
                    <input
                      type="date"
                      value={formData.approx_end_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          approx_end_date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
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
                    {modalMode === "create" ? "Create Note" : "Save Changes"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. DELETE NOTE CONFIRMATION MODAL */}
      <AnimatePresence>
        {modalMode === "delete" && selectedNote && (
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
                      Delete Note
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Are you sure you want to delete this note?
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
                <p className="font-semibold text-zinc-900 dark:text-white">
                  &ldquo;{selectedNote.title}&rdquo;
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                  {selectedNote.description || "No description"}
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
                  Delete Note
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-zinc-500">
          Loading notes workspace...
        </div>
      }
    >
      <NotesContent />
    </Suspense>
  );
}
