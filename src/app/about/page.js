"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import {
  FileText,
  Users,
  ShieldCheck,
  Database,
  PieChart,
  KeyRound,
  Layers,
  Server,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";

export default function AboutPage() {
  const projectModules = [
    {
      title: "1. Structured Notes & Timers",
      badge: "Workflow",
      icon: FileText,
      description:
        "Organize work with four priority levels (Low to Urgent), clear progress stages (Pending to Completed), and live countdowns for target dates.",
      technicalDetail:
        "Engineered for speed—indexed queries load your workspace in milliseconds, even as your archive grows.",
    },
    {
      title: "2. Public & Member-Only Visibility",
      badge: "Sharing",
      icon: Users,
      description:
        "Publish openly to the web or keep conversations strictly within the signed-in community—giving every post the right audience.",
      technicalDetail:
        "Privacy rules are enforced directly on the server, ensuring member-only posts stay strictly private.",
    },
    {
      title: "3. Instant Reactions",
      badge: "Engagement",
      icon: Layers,
      description:
        "Express feedback with single-click reactions (Like). Switch or undo reactions anytime with instant live counts..",
      technicalDetail:
        "Conflict-free syncing ensures accurate reaction counts without page reloads.",
    },
    {
      title: "4. Topic Circles & Profiles",
      badge: "Community",
      icon: PieChart,
      description:
        "Connect effortlessly with people who care about the same subjects. Shared interest tags automatically group members into active circles.",
      technicalDetail:
        "Smart relational queries surface relevant authors, posts, and topic groups in a single fast request.",
    },
    {
      title: "5. Role Controls",
      badge: "Security",
      icon: ShieldCheck,
      description:
        "Every account is verified with a quick 6-digit email code, paired with dedicated workspace permissions for regular members and admins.",
      technicalDetail:
        "Protected by short-lived 5-minute verification codes and rotating secure sessions.",
    },
    {
      title: "6. Built-In Rate Protection & Clean API",
      badge: "Reliability",
      icon: Server,
      description:
        "Designed to stay responsive and abuse-free around the clock, backed by structured API endpoints and clear standards.",
      technicalDetail:
        "Smart request throttling keeps traffic smooth for both guests and signed-in members.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <span>Inside NoteFlow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Thoughtful software, engineered for everyday use.
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            NoteFlow brings personal task management and community discussions
            under one roof—designed to feel effortless on the surface and
            rock-solid underneath
          </p>
        </div>

        {/* Core Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projectModules.map((module) => {
            const Icon = module.icon;
            return (
              <GlassCard
                key={module.title}
                hoverEffect={false}
                className="flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
                      {module.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                    {module.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block">
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      Optimization:
                    </strong>{" "}
                    {module.technicalDetail}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Technology Stack Specifications */}
        <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
            Powered By Modern Web Standards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                Backend
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                Django & Django REST Framework
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                Security
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                Email OTP Verification & JWT Sessions
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                Frontend
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                Next.js 16 & Tailwind CSS
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                Experience
              </span>
              <p className="text-zinc-600 dark:text-zinc-400">
                Framer Motion & Smooth Scroll
              </p>
            </div>
          </div>
        </div>

        {/* Project Author Credit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215]">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Designed & Built by Arif
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Crafted independently with a focus on clean design, fast
              performance, and practical everyday utility.
            </p>
          </div>
          <a
            href="https://github.com/aru-01"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Explore on GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
