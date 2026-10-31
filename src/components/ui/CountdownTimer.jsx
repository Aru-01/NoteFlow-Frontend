'use client';

import { useState, useEffect, useSyncExternalStore } from "react";
import { Clock, AlertCircle } from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function calculateTimeRemaining(dateStr) {
  if (!dateStr) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isOverdue: false,
      hasTarget: false,
    };
  }

  const target = new Date(`${dateStr}T23:59:59`).getTime();
  const now = Date.now();

  if (isNaN(target)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isOverdue: false,
      hasTarget: false,
    };
  }

  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isOverdue: true,
      hasTarget: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isOverdue: false,
    hasTarget: true,
  };
}

/**
 * Real-time Countdown Timer for Note Deadlines (approx_end_date)
 * Calculates Days, Hours, Minutes, Seconds until end of deadline date (23:59:59).
 */
export default function CountdownTimer({ targetDate, approxEndDate, compact = false }) {
  const effectiveDate = targetDate || approxEndDate;
  const mounted = useMounted();
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(effectiveDate));

  useEffect(() => {
    if (!effectiveDate) return;

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(effectiveDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [effectiveDate]);

  if (!mounted) {
    return (
      <span className="text-[11px] text-zinc-400 font-medium" suppressHydrationWarning>
        --:--:--
      </span>
    );
  }

  if (!timeLeft.hasTarget) {
    return (
      <span className="text-[11px] text-zinc-400 font-medium" suppressHydrationWarning>
        No deadline set
      </span>
    );
  }

  if (timeLeft.isOverdue) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-[11px] border border-rose-200 dark:border-rose-900/60 font-semibold" suppressHydrationWarning>
        <AlertCircle className="w-3 h-3" />
        <span>Deadline overdue</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium" suppressHydrationWarning>
        <Clock className="w-3 h-3 text-blue-500" />
        <span className="tabular-nums">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium" suppressHydrationWarning>
      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200">
        <Clock className="w-3 h-3 text-blue-500 shrink-0" />
        <span className="font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
          {timeLeft.days}d : {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
        <span className="text-[10px] text-zinc-400 ml-0.5">remaining</span>
      </div>
    </div>
  );
}
