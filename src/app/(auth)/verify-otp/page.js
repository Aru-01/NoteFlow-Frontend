'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { ShieldCheck, ArrowRight, RotateCw, KeyRound } from "lucide-react";

export default function VerifyOtpPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <GlassCard hoverEffect={false} className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1">
              Enter the 6-digit confirmation code sent to your inbox
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-11 h-13 text-center text-lg font-bold font-mono rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900/50 text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="•"
                />
              ))}
            </div>

            <Button variant="primary" className="w-full" icon={ArrowRight}>
              Verify & Complete Registration
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-xs text-stone-600 dark:text-zinc-400">
            <span>Didn&apos;t receive code?</span>
            <button className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer">
              <RotateCw className="w-3.5 h-3.5" />
              Resend OTP
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 dark:text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Code expires in 5 minutes</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
