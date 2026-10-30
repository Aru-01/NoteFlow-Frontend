'use client';

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center select-none">
      <div className="relative flex items-center justify-center mb-5">
        {/* Outer glowing pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-14 h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800"
        />

        {/* Central Brand Emblem */}
        <div className="relative w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-sm">
          NF
        </div>
      </div>

      {/* Progress Dots Animation */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dark:bg-zinc-500 animate-pulse [animation-delay:200ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 dark:bg-zinc-400 animate-pulse [animation-delay:400ms]" />
      </div>

      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-normal">
        Loading NoteFlow workspace...
      </p>
    </div>
  );
}

