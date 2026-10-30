import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import AmbientBackground from "@/components/ui/AmbientBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

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
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col font-sans bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300"
      >
        <ThemeProvider>
          <AuthProvider>
            <SmoothScroll>
              <AmbientBackground />
              <Navbar />
              <main className="flex-1 pt-16 lg:pt-18 flex flex-col">{children}</main>
              <Footer />
            </SmoothScroll>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
