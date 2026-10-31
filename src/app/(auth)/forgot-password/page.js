'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  RotateCw,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step 1: Request OTP, Step 2: Verify OTP and Set New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(() => searchParams.get("email")?.trim() || "");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const inputRefs = useRef([]);

  // Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post(ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, {
        email: email.trim(),
      });
      setMessage(res.data?.message || "A 6-digit password reset code has been sent to your email.");
      setStep(2);
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.email) {
        setError(Array.isArray(resp.email) ? resp.email[0] : resp.email);
      } else if (resp?.detail) {
        setError(resp.detail);
      } else {
        setError("Unable to process password reset request. Please verify your email.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Digits Handling
  const handleDigitChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);
    setError("");

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

  // Step 2: Confirm Password Reset
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    const otpCode = digits.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post(ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
        email: email.trim(),
        otp_code: otpCode,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage(res.data?.message || "Password reset successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/login?reset=true");
      }, 1500);
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.otp_code) {
        setError(Array.isArray(resp.otp_code) ? resp.otp_code[0] : resp.otp_code);
      } else if (resp?.new_password) {
        setError(Array.isArray(resp.new_password) ? resp.new_password[0] : resp.new_password);
      } else if (resp?.confirm_password) {
        setError(Array.isArray(resp.confirm_password) ? resp.confirm_password[0] : resp.confirm_password);
      } else if (resp?.detail) {
        setError(resp.detail);
      } else {
        setError("Failed to reset password. Please verify the OTP and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post(ENDPOINTS.AUTH.RESEND_OTP, {
        email: email.trim(),
        purpose: "password_reset",
      });
      setMessage(res.data?.message || "A new 6-digit reset code has been dispatched.");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.email) {
        setError(Array.isArray(resp.email) ? resp.email[0] : resp.email);
      } else if (resp?.detail) {
        setError(resp.detail);
      } else {
        setError("Failed to resend code. Please try again in a few moments.");
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
              {step === 1 ? "Reset your password" : "Enter OTP & new password"}
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
              {step === 1
                ? "Enter your registered email address to receive a 6-digit recovery code."
                : `We sent a 6-digit code to ${email || "your email"}.`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <div>{message}</div>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Email Form */
            <form className="space-y-4" onSubmit={handleRequestOtp}>
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
                icon={ArrowRight}
              >
                Send Reset Code
              </Button>
            </form>
          ) : (
            /* STEP 2: OTP + New Password Form */
            <form className="space-y-4" onSubmit={handleConfirmReset}>
              <div className="p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[190px] sm:max-w-[240px]">
                    {email}
                  </span>
                  <Lock className="w-3 h-3 text-zinc-400 shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer shrink-0"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 text-center">
                  6-Digit Verification Code
                </label>
                <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-10 h-12 sm:w-11 sm:h-12 text-center text-base sm:text-lg font-mono font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
                icon={ArrowRight}
              >
                Reset Password
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                  <span>Resend 6-digit code</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-xs text-zinc-500">Loading recovery...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}

