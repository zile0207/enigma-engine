import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enigma Engine",
  description: "AI-Powered Design System Architect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        {/* Global Navbar */}
        <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-white/80 backdrop-blur-md z-[100] flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-bold text-xl tracking-tighter hover:opacity-70 transition-opacity"
            >
              ENIGMA
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
              <Link
                href="/dashboard/spotify"
                className="hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/spotify/button"
                className="hover:text-slate-900 transition-colors"
              >
                Registry
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-200">
              v0.1.0-alpha
            </div>
          </div>
        </nav>

        {/* Main Content Wrapper */}
        <div className="pt-16 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
