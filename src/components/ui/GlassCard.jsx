'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className,
  hoverEffect = true,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2, ease: "easeOut" } } : {}}
      className={cn(
        "relative rounded-2xl p-5 sm:p-6 transition-all duration-200 overflow-hidden",
        "bg-white/95 dark:bg-[#121216]/85 backdrop-blur-md",
        "border border-zinc-200/90 dark:border-zinc-800/80",
        "shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]",
        hoverEffect && "hover:border-zinc-300 dark:hover:border-zinc-700/80 hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_48px_-10px_rgba(0,0,0,0.7)]",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Subtle top etched rim light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700/50 to-transparent rounded-t-2xl pointer-events-none" />
      {children}
    </motion.div>
  );
}
