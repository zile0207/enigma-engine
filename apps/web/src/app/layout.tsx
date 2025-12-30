import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
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
          ]}
          rightContent={
            <Badge
              variant="secondary"
              className="text-[10px] font-bold uppercase tracking-widest"
            >
              v0.1.0-alpha
            </Badge>
          }
        />

        {/* Main Content Wrapper */}
        <div className="pt-16 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
