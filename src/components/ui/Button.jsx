'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className,
  onClick,
  type = "button",
  icon: Icon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5 font-semibold",
  };

  const variants = {
    primary:
      "bg-gradient-to-b from-zinc-800 to-zinc-950 dark:from-white dark:to-zinc-200 text-white dark:text-zinc-950 shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.15)] hover:brightness-110 active:scale-[0.98] border border-zinc-700/50 dark:border-white/40",
    accent:
      "bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-[0_2px_10px_rgba(37,99,235,0.25)] active:scale-[0.98] border border-blue-400/30",
    secondary:
      "bg-zinc-100/90 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-700/70 shadow-2xs active:scale-[0.98]",
    outline:
      "bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 border border-zinc-300/80 dark:border-zinc-700 active:scale-[0.98]",
    ghost:
      "bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 active:scale-[0.98]",
    danger:
      "bg-rose-50 text-rose-600 hover:bg-rose-100/90 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shadow-2xs active:scale-[0.98]",
  };

  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  );
}
