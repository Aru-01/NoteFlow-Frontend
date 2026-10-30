'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, FileText, Users, Search, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
          <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
          <span>Error 404 • Missing Resource</span>
        </div>

        {/* Big Numeric & Headline */}
        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist, was relocated, or requires higher access credentials.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <Link href="/">
            <Button variant="primary" size="md" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Direct Links */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
            Or explore active workspaces:
          </span>
          <div className="flex justify-center gap-4 text-xs">
            <Link
              href="/notes"
              className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes Workspace</span>
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link
              href="/posts"
              className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Community Feed</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

