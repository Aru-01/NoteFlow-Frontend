"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Users,
  ShieldCheck,
  PieChart,
  CheckCircle2,
  Clock,
  Heart,
  Globe,
  Lock,
  Search,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { API_BASE_URL, ENDPOINTS } from "@/lib/constants";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";

const DEMO_FALLBACK_DEADLINE = "2026-11-20T23:59:59";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("notes");
  const [reacted, setReacted] = useState(false);
  const [reactCount, setReactCount] = useState(42);
  const [noteStatus, setNoteStatus] = useState("in_progress");
  const [notePriority, setNotePriority] = useState("urgent");

  // Real backend dynamic data
  const [livePost, setLivePost] = useState(null);
  const [liveGroups, setLiveGroups] = useState([]);
  const [liveNote, setLiveNote] = useState(null);

  const tabs = [
    { id: "notes", label: "Notes Lifecycle", icon: FileText },
    { id: "feed", label: "Community Feed", icon: Users },
  ];

  // Fetch live public data
  useEffect(() => {
    // 1. Group by interests
    api
      .get(ENDPOINTS.POSTS.GROUP_BY_INTERESTS)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLiveGroups(res.data);
        }
      })
      .catch(() => {});

    // 2. Public Community Post
    api
      .get(ENDPOINTS.POSTS.LIST_CREATE, { params: { privacy: "public" } })
      .then((res) => {
        const postsList =
          res.data?.results || (Array.isArray(res.data) ? res.data : []);
        if (postsList.length > 0) {
          const first = postsList[0];
          setLivePost(first);
          setReactCount(first.react_count || 0);
          setReacted(first.has_reacted || false);
        }
      })
      .catch(() => {});

    // 3. User latest note if logged in
    if (isAuthenticated) {
      api
        .get(ENDPOINTS.NOTES.LIST_CREATE)
        .then((res) => {
          const notesList =
            res.data?.results || (Array.isArray(res.data) ? res.data : []);
          if (notesList.length > 0) {
            setLiveNote(notesList[0]);
            setNoteStatus(notesList[0].status || "in_progress");
            setNotePriority(notesList[0].priority || "urgent");
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleReactToggle = async () => {
    if (livePost && isAuthenticated) {
      try {
        const res = await api.post(ENDPOINTS.POSTS.REACT(livePost.id), {
          reaction_type: "like",
        });
        const { reacted: isReacted, react_count } = res.data;
        setReacted(isReacted);
        if (react_count !== undefined) setReactCount(react_count);
        return;
      } catch (err) {
        // Fallback to local state toggle if error
      }
    }

    // Local toggle fallback
    if (reacted) {
      setReacted(false);
      setReactCount((prev) => Math.max(0, prev - 1));
    } else {
      setReacted(true);
      setReactCount((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        {/* Animated Brand Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-700 dark:text-blue-300 mb-8 shadow-xs backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span className="font-medium">
            NoteFlow • Your everyday workspace on the web
          </span>
          <span className="w-1 h-1 rounded-full bg-blue-400" />
          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[10px] tracking-wider uppercase font-semibold">
            Basic Mode - v.1
          </span>
        </motion.div>

        {/* High-Impact Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.12]"
        >
          Take notes, track deadlines{" "}
          <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            And share ideas - all in one tab.
          </span>
        </motion.h1>

        {/* Authentically Informative Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Track upcoming deadlines in real time, choose what to keep private or
          post publicly, and keep your workspace protected with passwordless OTP
          login.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link href="/register">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Start Free Workspace
            </Button>
          </Link>
          <Link href="/notes">
            <Button size="lg" variant="secondary" icon={FileText}>
              Open Notes Engine
            </Button>
          </Link>
          <a
            href={`${API_BASE_URL}/api/v1/docs/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" icon={ExternalLink}>
              Swagger API Docs
            </Button>
          </a>
        </motion.div>

        {/* Live Metrics Pill Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-500 font-medium"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Sub-10ms Indexed Queries</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Live Countdown Timers</span>
          </div>
          <div className="flex items-center gap-2">
            <PieChart className="w-3.5 h-3.5 text-purple-500" />
            <span>Smart Topic Discovery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>6-Digit Email OTP & RBAC</span>
          </div>
        </motion.div>
      </section>

      {/* Interactive Live Showcase Window (macOS Style) */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="border border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl bg-white/95 dark:bg-[#121216]/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden">
          {/* Window Titlebar */}
          <div className="px-4 py-3 bg-zinc-50/90 dark:bg-zinc-900/60 border-b border-zinc-200/90 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            {/* macOS Dots */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-zinc-300 dark:text-zinc-700 ml-2">|</span>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Live Module Sandbox
                </span>
              </div>
            </div>

            {/* Segmented Control Buttons */}
            <div className="flex flex-wrap items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Window Content */}
          <div className="p-6 sm:p-8 min-h-95 flex items-center justify-center">
            {/* 1. NOTES TAB */}
            {activeTab === "notes" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                      {liveNote
                        ? liveNote.title
                        : "Quarterly Architecture Migration"}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {liveNote
                        ? `Live user note indexed by composite key (owner_id, -created_at)`
                        : `Indexed query supported by composite key (owner_id, -created_at)`}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold">
                    ID: #{liveNote ? liveNote.id : "204"}
                  </span>
                </div>

                {/* Priority Selector & Countdown Timer */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 font-medium">Priority:</span>
                    {["low", "medium", "high", "urgent"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setNotePriority(p)}
                        className={`px-2.5 py-1 rounded-md text-[11px] uppercase font-semibold transition-all cursor-pointer ${
                          notePriority === p
                            ? p === "urgent"
                              ? "bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-2xs"
                              : p === "high"
                                ? "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs"
                                : p === "medium"
                                  ? "bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 shadow-2xs"
                                  : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <CountdownTimer
                      approxEndDate={
                        liveNote?.approx_end_date || DEMO_FALLBACK_DEADLINE
                      }
                    />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50/80 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200/90 dark:border-zinc-800/80">
                  {liveNote
                    ? liveNote.description ||
                      "No additional description provided for this note."
                    : "Implement relational integrity constraints, connect Django REST Framework endpoints to Next.js Axios client, and handle automatic refresh rotation for expired JWT tokens."}
                </p>

                {/* Status Lifecycle Selector */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 font-medium">
                      Lifecycle Status:
                    </span>
                    {["pending", "started", "in_progress", "completed"].map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => setNoteStatus(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all ${
                            noteStatus === st
                              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold shadow-xs"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60"
                          }`}
                        >
                          {st.replace("_", " ")}
                        </button>
                      ),
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    State: {noteStatus.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            )}

            {/* 2. COMMUNITY FEED TAB */}
            {activeTab === "feed" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl space-y-4"
              >
                <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/40 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                        {livePost?.author_username
                          ? livePost.author_username[0]
                          : livePost?.author_email
                            ? livePost.author_email[0]
                            : "A"}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <span>{livePost?.author_username || "Arif"}</span>
                          <span className="text-xs font-normal text-zinc-500">
                            (@
                            {livePost?.author_email
                              ? livePost.author_email.split("@")[0]
                              : "aru-01"}
                            )
                          </span>
                        </h4>
                        <span className="text-[11px] text-zinc-500">
                          {livePost?.created_at
                            ? formatDate(livePost.created_at)
                            : "Verified Author"}{" "}
                          • Live API
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/50 text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-medium">
                      <Globe className="w-3 h-3" />
                      <span>
                        {livePost?.privacy === "authenticated"
                          ? "In-App Post"
                          : "Public Post"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {livePost?.caption ||
                      "Just wrapped up database indexing on the NoteFlow Backend. The composite B-Tree indexes on (author, -created_at) ensure feeds load without full-table scans. Next up: polishing the Next.js UI!"}
                  </p>

                  <div className="pt-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-500">
                    <button
                      onClick={handleReactToggle}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        reacted
                          ? "bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 font-semibold border border-rose-300 dark:border-rose-800"
                          : "hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${reacted ? "fill-current" : ""}`}
                      />
                      <span>{reactCount} Reactions</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Bento Grid (High-End Visual Polish) */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-3">
            <span>Production Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Everything in its right place
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
            Everything you need to manage personal tasks, hit deadlines, and
            share ideas with people who care about the same topics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Card 1:  (Wide) */}
          <GlassCard className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Priority Notes & Live Timers
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                Organize tasks by priority—from Low to Urgent—track progress
                step-by-step, and stay on schedule with live countdown timers
                down to the second.
              </p>
            </div>

            {/* Visual Mini Timeline */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-zinc-900 dark:text-white">
                  Workspace View:
                </span>
                <span className="text-zinc-500">Personal & Admin Modes</span>
              </div>
              <Link
                href="/notes"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Open Notes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>

          {/* Bento Card 2: */}
          <GlassCard className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Flexible Sharing Controls
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Share updates with the open web or keep discussions exclusive to
                registered NoteFlow members. You decide who sees what.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/posts"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Explore Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>

          {/* Bento Card 3: */}
          <GlassCard className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Instant Post Reactions
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Show appreciation on community posts with quick likes, claps,
                and reactions that update live across the feed.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/posts"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Explore Posts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>

          {/* Bento Card 4 (Wide) */}
          <GlassCard className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Find Your Crowd
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                Find people who share your interests. Jump into active tags like
                #coding, #chess, or #reading and connect with builders and
                thinkers.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                #coding (18 members)
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                #chess (12 members)
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium">
                #reading (9 members)
              </span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Production Readiness CTA Banner */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-linear-to-br from-zinc-900 via-zinc-950 to-blue-950 text-white border border-zinc-800 shadow-2xl">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
              Ready to get organized?
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Your notes, deadlines, and community in one tab.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Create your free account, set up your first priority note, and
              connect with people sharing what they learn.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="primary"
                  icon={ArrowRight}
                  className="bg-white text-zinc-900 hover:bg-zinc-100"
                >
                  Get started for free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-600 text-white hover:bg-zinc-800"
                >
                  Sign In to Workspace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
