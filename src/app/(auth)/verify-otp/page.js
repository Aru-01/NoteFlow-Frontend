'use client';

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { ShieldCheck, ArrowRight, RotateCw, KeyRound, AlertCircle, CheckCircle2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuth();

  const [email, setEmail] = useState(() => {
    const paramEmail = searchParams.get("email");
    const storedEmail =
      typeof window !== "undefined"
        ? sessionStorage.getItem("noteflow_verify_email")
        : "";
    return paramEmail || storedEmail || "";
  });
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const inputRefs = useRef([]);

  const handleDigitChange = (index, value) => {
    // Keep only the last character entered if numeric
    const cleanValue = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);
    setError("");

    // Auto-focus next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = digits.join("");

    if (!email) {
      setError("Please provide the registered email address.");
      return;
    }

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await verifyOtp({
        email: email.trim(),
        otp_code: otpCode,
        purpose: "registration",
      });

      setMessage(res?.message || "Account verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 1500);
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.otp_code) {
        setError(Array.isArray(resp.otp_code) ? resp.otp_code[0] : resp.otp_code);
      } else if (resp?.email) {
        setError(Array.isArray(resp.email) ? resp.email[0] : resp.email);
      } else if (resp?.detail) {
        setError(resp.detail);
      } else {
        setError("Invalid or expired OTP code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please provide your email address to resend OTP.");
      return;
    }

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const res = await resendOtp({
        email: email.trim(),
        purpose: "registration",
      });
      setMessage(res?.message || "A fresh 6-digit OTP has been sent to your inbox.");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.email) {
        setError(Array.isArray(resp.email) ? resp.email[0] : resp.email);
      } else if (resp?.detail) {
        setError(resp.detail);
      } else {
        setError("Could not resend OTP. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

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
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Enter the 6-digit confirmation code sent to your inbox
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleVerify}>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Registered Email
                </label>
                <Link
                  href="/register"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Change email
                </Link>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="email"
                  required
                  readOnly={Boolean(email)}
                  disabled={Boolean(email)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl border ${
                    email
                      ? "border-zinc-200 dark:border-zinc-700 bg-zinc-100/90 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 font-medium cursor-not-allowed select-none"
                      : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  }`}
                />
                {email && (
                  <Lock className="absolute right-3.5 top-2.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 text-center">
                6-Digit Security Code
              </label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 sm:w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="•"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Verify & Complete Registration
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
            <span>Didn&apos;t receive code?</span>
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
              <span>Resend OTP</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Code expires in 5 minutes</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-xs text-zinc-500">Loading verification...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
