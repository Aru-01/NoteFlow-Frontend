'use client';

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-200/80 dark:bg-zinc-800/80",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-16 h-4 rounded" />
        <Skeleton className="w-20 h-4 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded" />
      <Skeleton className="w-full h-12 rounded" />
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
        <Skeleton className="w-24 h-3.5 rounded" />
        <Skeleton className="w-16 h-3.5 rounded" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800/80">
      <td className="py-3 px-4"><Skeleton className="w-8 h-4" /></td>
      <td className="py-3 px-4"><Skeleton className="w-32 h-4" /></td>
      <td className="py-3 px-4"><Skeleton className="w-24 h-4" /></td>
      <td className="py-3 px-4"><Skeleton className="w-16 h-5 rounded-full" /></td>
      <td className="py-3 px-4"><Skeleton className="w-20 h-5 rounded-full" /></td>
      <td className="py-3 px-4"><Skeleton className="w-16 h-7 rounded-md" /></td>
    </tr>
  );
}

