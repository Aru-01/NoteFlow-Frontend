'use client';

import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#0c0c0e] mt-auto transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                NF
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                NoteFlow
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              Full-stack note management and community discussion platform.
              Powered by Django REST Framework (RBAC + OTP) and Next.js 16.
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/aru-01"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>github.com/aru-01</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/posts" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Community Feed
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Modules */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              System Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <span className="text-zinc-500 dark:text-zinc-500">Status & Priority Lifecycle</span>
              </li>
              <li>
                <span className="text-zinc-500 dark:text-zinc-500">Dual-Tier Privacy Posts</span>
              </li>
              <li>
                <span className="text-zinc-500 dark:text-zinc-500">Real-Time Post Reactions</span>
              </li>
              <li>
                <span className="text-zinc-500 dark:text-zinc-500">Interest Grouping Aggregations</span>
              </li>
              <li>
                <span className="text-zinc-500 dark:text-zinc-500">6-Digit Email OTP Security</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with User Github link */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80 mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-500">
          <p>© 2026 NoteFlow. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <a
              href="https://github.com/aru-01"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 dark:text-white hover:underline underline-offset-4 transition-all"
            >
              aru-01
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
