import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar
          links={[
            { href: "/dashboard/spotify", label: "Dashboard" },
            { href: "/spotify/button", label: "Registry" },
            { href: "/spotify/button", label: "Theme" },
          ]}
        />

        {/* Main Content Wrapper */}
        <div className="mt-14 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
