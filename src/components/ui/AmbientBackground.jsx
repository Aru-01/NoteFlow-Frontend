'use client';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Top Ambient Glow Orb */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1100px] h-[550px] bg-gradient-to-b from-blue-500/12 via-indigo-500/6 to-transparent dark:from-blue-600/18 dark:via-purple-600/10 dark:to-transparent rounded-full blur-3xl" />

      {/* Subtle Side Color Fill */}
      <div className="absolute top-1/4 -left-36 w-80 h-80 bg-blue-400/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-2/3 -right-36 w-96 h-96 bg-indigo-400/5 dark:bg-purple-500/10 rounded-full blur-3xl" />

      {/* Elegant Radial Dot Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.22] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
          backgroundSize: "28px 28px",
          color: "var(--dot-color, #a1a1aa)"
        }}
      />
    </div>
  );
}
