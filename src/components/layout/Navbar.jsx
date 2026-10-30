'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  UserCheck,
  ChevronDown
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const { user, isAuthenticated, logout, setMockRole } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Base navigation links
  const baseNavLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Community Feed", href: "/posts", icon: Users },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Contact Us", href: "/contact", icon: Mail },
  ];

  // If user role is admin, dynamically add "User Manage" link
  const isAdmin = user?.role === "admin";
  const navLinks = isAdmin
    ? [
        ...baseNavLinks.slice(0, 3), // Home, Notes, Community Feed
        { name: "User Manage", href: "/admin/users", icon: ShieldCheck, isAdminOnly: true },
        ...baseNavLinks.slice(3),    // About Us, Contact Us
      ]
    : baseNavLinks;

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
                  Admin Mode
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isSpecialAdmin = link.isAdminOnly;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? isSpecialAdmin
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold"
                        : "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold"
                      : isSpecialAdmin
                      ? "text-blue-600/90 dark:text-blue-400/90 hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  {isSpecialAdmin && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Role Simulator, Theme Toggle & Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Role Tester / Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200/70 transition-colors cursor-pointer"
                title="Switch demo view role"
              >
                <span>Role: <strong>{user?.role ? user.role : "Guest"}</strong></span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              <AnimatePresence>
                {showRoleMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-1 w-36 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-lg text-xs z-50"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-mono text-zinc-400 uppercase">
                      Preview Role
                    </div>
                    <button
                      onClick={() => {
                        setMockRole(null);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                        !user ? "font-semibold text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      Guest (Logged Out)
                    </button>
                    <button
                      onClick={() => {
                        setMockRole("user");
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                        user?.role === "user" ? "font-semibold text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      Regular User
                    </button>
                    <button
                      onClick={() => {
                        setMockRole("admin");
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 ${
                        user?.role === "admin" ? "font-bold" : ""
                      }`}
                    >
                      ★ Admin (Shows Nav)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                <div className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center font-bold text-[10px]">
                    {user?.username ? user.username[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden lg:inline text-xs font-medium">
                    {user?.username || user?.email?.split("@")[0]}
                  </span>
                </div>
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
            {/* Quick role toggle on mobile */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800 text-xs">
              <span className="text-zinc-500 text-[11px]">Preview State:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setMockRole(null)}
                  className={`px-2 py-0.5 rounded text-[11px] ${!user ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
                >
                  Guest
                </button>
                <button
                  onClick={() => setMockRole("user")}
                  className={`px-2 py-0.5 rounded text-[11px] ${user?.role === "user" ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
                >
                  User
                </button>
                <button
                  onClick={() => setMockRole("admin")}
                  className={`px-2 py-0.5 rounded text-[11px] ${user?.role === "admin" ? "bg-blue-600 text-white font-semibold" : "bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400"}`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                const isSpecialAdmin = link.isAdminOnly;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? isSpecialAdmin
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold"
                          : "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800"
                        : isSpecialAdmin
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{link.name}</span>
                    {isSpecialAdmin && (
                      <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        Admin
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="h-px bg-zinc-200 dark:border-zinc-800 my-2" />

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
