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
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.15 } } : {}}
      className={cn(
        "relative rounded-xl p-5 sm:p-6 transition-all duration-200",
        "bg-white dark:bg-[#121215]",
        "border border-zinc-200/80 dark:border-zinc-800/80",
        "text-zinc-900 dark:text-zinc-100",
        "shadow-xs dark:shadow-none",
        hoverEffect && "hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm dark:hover:shadow-lg dark:hover:shadow-black/40",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
