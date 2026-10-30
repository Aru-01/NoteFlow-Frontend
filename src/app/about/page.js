'use client';

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
  ExternalLink
} from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";

export default function AboutPage() {
  const projectModules = [
    {
      title: "1. Structured Notes Engine",
      badge: "CRUD & Lifecycle",
      icon: FileText,
      description:
        "Full-featured note workspace where notes are tied to authenticated owners. Features 4 priority tiers (Low, Medium, High, Urgent), 4 lifecycle statuses (Pending, Started, In Progress, Completed), and planned start and approximate completion dates.",
      technicalDetail: "Backed by compound database index (owner, -created_at) ensuring sub-10ms retrieval even under heavy data volume.",
    },
    {
      title: "2. Dual-Privacy Community Feed",
      badge: "Public & In-App",
      icon: Users,
      description:
        "Content publishing system with dual visibility control. Public posts can be viewed by anyone, while Authenticated posts are strictly guarded for verified platform members. Includes author attribution and relational linking.",
      technicalDetail: "Protected at the ORM and serializer level; anonymous requests are automatically restricted from in-app records.",
    },
    {
      title: "3. Atomic Post Reactions",
      badge: "Interactive Toggle",
      icon: Layers,
      description:
        "Real-time reaction system allowing verified users to react to posts (like, love, clap). Features idempotent toggle logic—clicking the same reaction removes it, while switching updates the reaction type.",
      technicalDetail: "Enforces unique_together (post, user) constraint and atomically updates the aggregate react_count field.",
    },
    {
      title: "4. Aggregation Pipelines",
      badge: "Data Processing",
      icon: PieChart,
      description:
        "Custom query pipelines matching users by shared interest arrays (Scenario 1: Group Users by Interests) and multi-model relational joins retrieving all posts for specific authors (Scenario 2: $lookup JOIN).",
      technicalDetail: "Optimized through Python defaultdict grouping and Django select_related single-query joins with composite index (author, -created_at).",
    },
    {
      title: "5. Dual-Layer Auth & OTP Verification",
      badge: "Security & RBAC",
      icon: ShieldCheck,
      description:
        "Custom AbstractUser with email as primary credential. Role-Based Access Control differentiates regular Users from Administrators. Registrations require 6-digit numeric OTP email verification before login is permitted.",
      technicalDetail: "OTPs expire in 5 minutes and are purged on consumption. Session tokens are managed via SimpleJWT with sliding rotation.",
    },
    {
      title: "6. Performance & Throttling",
      badge: "Infrastructure",
      icon: Server,
      description:
        "Configured rate limiting (100 req/min for anonymous visitors, 500 req/min for authenticated users) to prevent API abuse, paired with OpenAPI/Swagger interactive documentation.",
      technicalDetail: "Drf-spectacular documentation schema available at /api/v1/docs/ with full parameter annotations.",
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
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300">
            <span>Project Specification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            NoteFlow Architecture & Modules
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            NoteFlow is a production-grade full-stack platform combining a secure Django REST Framework
            backend with an optimized Next.js 16 client. Below is a detailed breakdown of the real
            features and technical modules implemented in this system.
          </p>
        </div>

        {/* Core Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projectModules.map((module) => {
            const Icon = module.icon;
            return (
              <GlassCard key={module.title} hoverEffect={false} className="flex flex-col justify-between space-y-3">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
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
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block">
                    <strong className="text-zinc-700 dark:text-zinc-300">Optimization:</strong> {module.technicalDetail}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Technology Stack Specifications */}
        <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
            Full-Stack Technology Stack
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Backend Framework</span>
              <p className="text-zinc-600 dark:text-zinc-400">Django 5.2 + Django REST Framework</p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Authentication</span>
              <p className="text-zinc-600 dark:text-zinc-400">SimpleJWT + 6-digit Email OTP + RBAC</p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Frontend Framework</span>
              <p className="text-zinc-600 dark:text-zinc-400">Next.js 16 (App Router) + Tailwind v4</p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">UX & Interaction</span>
              <p className="text-zinc-600 dark:text-zinc-400">Lenis Smooth Scroll + Framer Motion</p>
            </div>
          </div>
        </div>

        {/* Project Author Credit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215]">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Project Developer & Maintainer
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Architected and built by Arif (<a href="https://github.com/aru-01" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">@aru-01</a>).
            </p>
          </div>
          <a
            href="https://github.com/aru-01"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>View GitHub Repository</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
