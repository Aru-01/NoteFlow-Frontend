'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, Mail, Lock, User, Tag } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg"
      >
        <GlassCard hoverEffect={false} className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 font-bold text-sm">
              N
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1">
              Join NoteFlow with email OTP verification & interest matching
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900/50 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                Username (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="arif"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900/50 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900/50 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900/50 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                Interests (Comma separated, e.g. chess, coding, books)
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="coding, chess, reading"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900/50 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <Button variant="primary" className="w-full mt-2" icon={ArrowRight}>
              Continue to OTP Verification
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-zinc-800 text-center">
            <p className="text-xs text-stone-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 dark:text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>A 6-digit OTP will be sent to your email to verify</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
