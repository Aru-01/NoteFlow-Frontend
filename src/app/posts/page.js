'use client';

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Users, Heart, Globe, Lock, ArrowRight, Plus } from "lucide-react";

export default function PostsFeedPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Arif (@aru-01)",
      caption: "Completed the Django REST NoteFlow backend architecture! The endpoints for OTP verification, notes CRUD, and community feed are fully live.",
      reactions: 28,
      privacy: "public",
      time: "2 hours ago",
      tag: "architecture",
      userReacted: false,
    },
    {
      id: 2,
      author: "Sara Dev",
      caption: "Testing the Scenario 2 $lookup JOIN query. Single SQL join with select_related retrieves posts and author metadata in under 5ms.",
      reactions: 19,
      privacy: "authenticated",
      time: "4 hours ago",
      tag: "performance",
      userReacted: false,
    },
  ]);

  const toggleReaction = (id) => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            reactions: p.userReacted ? p.reactions - 1 : p.reactions + 1,
            userReacted: !p.userReacted,
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Community Feed
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Public posts and in-app authenticated discussions powered by Django REST.
            </p>
          </div>
          <Link href="/login">
            <Button variant="primary" icon={Plus}>
              Create Post
            </Button>
          </Link>
        </div>

        {/* Posts Stream */}
        <div className="space-y-4">
          {posts.map((post) => (
            <GlassCard key={post.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs">
                    {post.author[0]}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {post.author}
                    </h4>
                    <span className="text-[11px] text-zinc-500">{post.time}</span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                    post.privacy === "public"
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  {post.privacy === "public" ? (
                    <>
                      <Globe className="w-3 h-3" />
                      <span>Public Feed</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>In-App Members Only</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {post.caption}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                <button
                  onClick={() => toggleReaction(post.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    post.userReacted
                      ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-semibold"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.userReacted ? "fill-current" : ""}`} />
                  <span>{post.reactions} Reactions</span>
                </button>

                <span className="text-[11px] font-mono text-zinc-400">
                  #{post.tag}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
