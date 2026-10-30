'use client';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Neutral top lighting highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-radial from-stone-200/40 dark:from-zinc-800/20 to-transparent blur-2xl" />

      {/* Clean, minimalist neutral dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          color: "var(--dot-color, #d4d4d8)"
        }}
      />
    </div>
  );
}
