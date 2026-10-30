'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  FileText, 
  Users, 
  Info, 
  Mail, 
  Home, 
  Sun, 
  Moon, 
  ArrowRight,
  ShieldCheck,
  LogOut,
  ChevronDown,
  User as UserIcon
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notesDropdown, setNotesDropdown] = useState(false);
  const [mobileNotesExpanded, setMobileNotesExpanded] = useState(true);

  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const { theme, toggleTheme, mounted } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setNotesDropdown(false);
    setIsOpen(false);
  }, [pathname]);

  const isAdmin = user?.role === "admin";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-2xs"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-15">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
              NF
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                NoteFlow
              </span>
              {isAdmin && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold">
                  Admin
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* 1. Home */}
            <Link
              href="/"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === "/"
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              Home
            </Link>

            {/* 2. Notes (With Sub-links for Admin) */}
            {isAdmin ? (
              <div 
                ref={dropdownRef} 
                className="relative"
                onMouseEnter={() => setNotesDropdown(true)}
                onMouseLeave={() => setNotesDropdown(false)}
              >
                <button
                  onClick={() => setNotesDropdown(!notesDropdown)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    pathname.startsWith("/notes")
                      ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${notesDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* Admin Notes Sub-menu Dropdown */}
                <AnimatePresence>
                  {notesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-1 w-52 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-xl z-50 space-y-0.5"
                    >
                      <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-400">
                        Admin Notes Hub
                      </div>

                      <Link
                        href="/notes?view=my"
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                            My Notes
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            Notes authored by you
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/notes?view=all"
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                      >
                        <Users className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                            Users&apos; Notes
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            All user notes in system
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/notes"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  pathname === "/notes"
                    ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                }`}
              >
                Notes
              </Link>
            )}

            {/* 3. Community Feed */}
            <Link
              href="/posts"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === "/posts"
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              Community Feed
            </Link>

            {/* 4. User Manage (Admin only) */}
            {isAdmin && (
              <Link
                href="/admin/users"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  pathname === "/admin/users"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold"
                    : "text-blue-600/90 dark:text-blue-400/90 hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>User Manage</span>
              </Link>
            )}

            {/* 5. About Us */}
            <Link
              href="/about"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === "/about"
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              About Us
            </Link>

            {/* 6. Contact Us */}
            <Link
              href="/contact"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === "/contact"
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Section: Theme Toggle & Real Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            {/* Authenticated vs Guest View */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-1">
                <Link
                  href="/profile"
                  title="Manage Your Profile"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200/70 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px] group-hover:scale-105 transition-transform">
                    {user?.username ? user.username[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
                  </div>
                  <span className="font-medium max-w-[120px] truncate group-hover:text-zinc-900 dark:group-hover:text-white">
                    {user?.username || user?.email?.split("@")[0]}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] font-mono px-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      admin
                    </span>
                  )}
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>

                <Link href="/register">
                  <Button variant="primary" size="sm" icon={ArrowRight}>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Bar */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-5 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <Home className="w-4 h-4 opacity-80" />
                <span>Home</span>
              </Link>

              {/* Mobile Notes (Expandable for Admin) */}
              {isAdmin ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Notes</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Admin Sub-nav
                    </span>
                  </div>

                  {/* Sub-links */}
                  <div className="pl-6 space-y-1">
                    <Link
                      href="/notes?view=my"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>My Notes</span>
                    </Link>

                    <Link
                      href="/notes?view=all"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Users&apos; Notes</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  href="/notes"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <FileText className="w-4 h-4 opacity-80" />
                  <span>Notes</span>
                </Link>
              )}

              <Link
                href="/posts"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <Users className="w-4 h-4 opacity-80" />
                <span>Community Feed</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/users"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>User Manage</span>
                </Link>
              )}

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <Info className="w-4 h-4 opacity-80" />
                <span>About Us</span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <Mail className="w-4 h-4 opacity-80" />
                <span>Contact Us</span>
              </Link>

              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

              {isAuthenticated && (
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <UserIcon className="w-4 h-4 opacity-80" />
                  <span>My Profile & Settings</span>
                </Link>
              )}

              <div className="flex flex-col gap-2 pt-1">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      Signed in as <strong>{user?.username || user?.email}</strong>
                    </span>
                    <button
                      onClick={logout}
                      className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="secondary" className="w-full justify-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" className="w-full justify-center" icon={ArrowRight}>
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
