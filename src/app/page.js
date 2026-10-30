'use client';

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Filter,
  Check,
  Tag,
  KeyRound,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import { API_BASE_URL } from "@/lib/constants";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("notes");
  const [reacted, setReacted] = useState(false);
  const [reactCount, setReactCount] = useState(42);
  const [noteStatus, setNoteStatus] = useState("in_progress");
  const [notePriority, setNotePriority] = useState("urgent");

  const tabs = [
    { id: "notes", label: "Notes Lifecycle", icon: FileText },
    { id: "feed", label: "Community Feed", icon: Users },
    { id: "aggregations", label: "Interest Aggregations", icon: PieChart },
    { id: "security", label: "OTP & RBAC", icon: ShieldCheck },
  ];

  const handleReactToggle = () => {
    if (reacted) {
      setReacted(false);
      setReactCount((prev) => prev - 1);
    } else {
      setReacted(true);
      setReactCount((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-12 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-700 dark:text-zinc-300 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
          <span className="font-medium">NoteFlow Platform • Full-Stack Release</span>
        </div>

        {/* Clear, confident headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-3xl mx-auto leading-[1.15]">
          A structured notes workspace with verified community collaboration.
        </h1>

        {/* Informative, authentic subhead */}
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Manage task lifecycles with priority and timeframe tracking, share perspectives across
          dual-tier privacy feeds, and secure accounts with two-step email OTP verification.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Create Free Account
            </Button>
          </Link>
          <Link href="/notes">
            <Button size="lg" variant="secondary" icon={FileText}>
              Explore Notes Module
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
        </div>
      </section>

      {/* Interactive System Visualizer (Tabbed Deep-Dive) */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-[#121215] shadow-sm overflow-hidden">
          {/* Segmented Control Header */}
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                Live Module Preview
              </span>
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <span className="text-xs text-zinc-500 font-mono">Interactive</span>
            </div>

            {/* Tab Buttons */}
            <div className="flex flex-wrap items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800/60 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-2xs font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="p-6 sm:p-8 min-h-[380px] flex items-center justify-center">
            {/* 1. NOTES TAB */}
            {activeTab === "notes" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                      Quarterly Architecture Migration
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Indexed query supported by composite key (owner_id, -created_at)
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    ID: #204
                  </span>
                </div>

                {/* Priority Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500">Priority:</span>
                    {["low", "medium", "high", "urgent"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setNotePriority(p)}
                        className={`px-2 py-0.5 rounded text-[11px] uppercase font-mono font-medium transition-colors cursor-pointer ${
                          notePriority === p
                            ? p === "urgent"
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                              : p === "high"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : p === "medium"
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                              : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est: Oct 30 - Nov 15</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  Implement relational integrity constraints, connect Django REST Framework endpoints to Next.js Axios
                  client, and handle automatic refresh rotation for expired JWT tokens.
                </p>

                {/* Status Lifecycle Selector */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500">Lifecycle Status:</span>
                    {["pending", "started", "in_progress", "completed"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setNoteStatus(st)}
                        className={`px-2.5 py-1 rounded text-xs capitalize cursor-pointer transition-colors ${
                          noteStatus === st
                            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                        }`}
                      >
                        {st.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Updated: Just now
                  </span>
                </div>
              </motion.div>
            )}

            {/* 2. COMMUNITY FEED TAB */}
            {activeTab === "feed" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl space-y-4"
              >
                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs">
                        A
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                          Arif (@aru-01)
                        </h4>
                        <span className="text-[11px] text-zinc-500">Verified Author • 10m ago</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/50 text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <Globe className="w-3 h-3" />
                      <span>Public Post</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Just wrapped up database indexing on the NoteFlow Backend. The composite B-Tree indexes on
                    (author, -created_at) ensure feeds load without full-table scans. Next up: polishing the Next.js UI!
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
                    <button
                      onClick={handleReactToggle}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        reacted
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold"
                          : "hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${reacted ? "fill-current" : ""}`} />
                      <span>{reactCount} Reactions</span>
                    </button>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Endpoint: /api/v1/posts/:id/react/
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. AGGREGATIONS TAB */}
            {activeTab === "aggregations" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl space-y-4"
              >
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Scenario 1: Group Users by Interests Pipeline
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Processes user interest arrays in an optimized grouping pipeline (/api/v1/posts/aggregations/group-by-interests/)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-1.5">
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase">
                      #coding
                    </span>
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white">18 Members</h4>
                    <p className="text-[11px] text-zinc-500">Top shared interest among platform users</p>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-1.5">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                      #chess
                    </span>
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white">12 Members</h4>
                    <p className="text-[11px] text-zinc-500">Active strategy & problem-solving circle</p>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-1.5">
                    <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold uppercase">
                      #reading
                    </span>
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white">9 Members</h4>
                    <p className="text-[11px] text-zinc-500">Book notes & technical documentation</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400 font-mono">
                    Scenario 2: User Posts $lookup JOIN
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                    Latency: ~3.8ms (select_related)
                  </span>
                </div>
              </motion.div>
            )}

            {/* 4. SECURITY & OTP TAB */}
            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-xl space-y-4"
              >
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                    6-Digit OTP Email Verification
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Required for new self-registrations before JWT issuance
                  </p>
                </div>

                <div className="flex justify-center gap-2 py-2">
                  {["4", "8", "1", "9", "2", "0"].map((digit, i) => (
                    <div
                      key={i}
                      className="w-10 h-12 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-lg font-mono font-bold text-zinc-900 dark:text-white"
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                    <span className="font-semibold text-zinc-900 dark:text-white block">
                      Role-Based Access (RBAC)
                    </span>
                    <p className="text-zinc-500 mt-0.5">
                      Distinguishes User from Admin with custom permissions.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                    <span className="font-semibold text-zinc-900 dark:text-white block">
                      Sliding JWT Refresh
                    </span>
                    <p className="text-zinc-500 mt-0.5">
                      2-hour access lifetime with 7-day token rotation.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Comprehensive Platform Features
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
            Engineered directly against the NoteFlow Django REST backend specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <GlassCard className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Notes Lifecycle Engine
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Full CRUD with status state machines (pending, started, in_progress, completed)
              and 4 priority levels with timeframe date tracking.
            </p>
            <div className="pt-1">
              <Link href="/notes" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                View Notes Workspace &rarr;
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Dual-Privacy Social Feed
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Public posts for general visitors and authenticated in-app posts for registered users,
              with idempotent post reactions.
            </p>
            <div className="pt-1">
              <Link href="/posts" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Browse Community Feed &rarr;
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Role-Based Access & OTP
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Email-first accounts with 6-digit expiring OTP verification, JWT session rotation,
              and User/Admin role permissions.
            </p>
            <div className="pt-1">
              <Link href="/verify-otp" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                OTP Verification Flow &rarr;
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Stage 2 Readiness CTA */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Frontend Setup Complete • Next Step: Authentication
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-lg">
              Next.js 16 client architecture, neutral design system, Lenis smooth scrolling, and complete API service
              routing are ready. We can now connect registration, OTP verification, and JWT login.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/register">
              <Button variant="primary" icon={ArrowRight}>
                Start Registration
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
