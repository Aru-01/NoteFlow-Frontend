'use client';

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { FileText, Plus, Search, Filter, Clock, ArrowRight, Lock } from "lucide-react";

export default function NotesIndexPage() {
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const sampleNotes = [
    {
      id: 1,
      title: "Django REST SimpleJWT Implementation",
      description: "Set up TokenObtainPairView with custom serializer embedding role and verification status.",
      priority: "urgent",
      status: "completed",
      startDate: "2026-10-28",
      endDate: "2026-10-30",
    },
    {
      id: 2,
      title: "6-Digit Email OTP Verification Workflow",
      description: "Implemented OTPVerification model with 5-minute expiry and clean_expired_otps() purge pipeline.",
      priority: "high",
      status: "in_progress",
      startDate: "2026-10-29",
      endDate: "2026-10-31",
    },
    {
      id: 3,
      title: "Composite Index Optimization for Notes & Posts",
      description: "Added compound indexes (owner, -created_at) and (author, -created_at) for sub-5ms retrieval.",
      priority: "medium",
      status: "started",
      startDate: "2026-10-30",
      endDate: "2026-11-02",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Notes Workspace
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Structured note management with 4 priority levels, 4 lifecycle states, and date range filters.
            </p>
          </div>
          <Link href="/login">
            <Button variant="primary" icon={Plus}>
              Create New Note
            </Button>
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500">Priority Filter:</span>
            {["all", "urgent", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                  filterPriority === p
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
            <span>Endpoint: /api/v1/notes/</span>
          </div>
        </div>

        {/* Sample Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleNotes.map((note) => (
            <GlassCard key={note.id} className="p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      note.priority === "urgent"
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                        : note.priority === "high"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                        : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                    }`}
                  >
                    {note.priority}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Status: {note.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {note.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {note.startDate}
                </span>
                <span>Due: {note.endDate}</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Authenticated Guard Banner */}
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Personalized Notes Dashboard
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Log in to create, edit, filter, and archive notes tied to your verified account.
              </p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="primary" size="sm" icon={ArrowRight}>
              Sign In to Access
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
