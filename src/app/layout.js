import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import AmbientBackground from "@/components/ui/AmbientBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NoteFlow | Thoughtful Note-Taking & Community Feed",
  description:
    "A clean, human-centered workspace for organized notes, authentic sharing, and secure OTP verification.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300">
        <ThemeProvider>
          <AuthProvider>
            <SmoothScroll>
              <AmbientBackground />
              <Navbar />
              <main className="flex-1 pt-15 flex flex-col">{children}</main>
              <Footer />
            </SmoothScroll>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
