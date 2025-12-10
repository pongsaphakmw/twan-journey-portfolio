import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TerminalPanel from "@/components/TerminalPanel";
import TopNav from "@/components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twan Journey Portfolio",
  description: "Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <TopNav />

        {/* Main Canvas Area - 65% height */}
        <main className="h-[65%] w-full overflow-auto relative border-b border-slate-700 pt-14">
          {children}
        </main>

        {/* Terminal Panel Area - 35% height */}
        <footer className="h-[35%] w-full">
          <TerminalPanel />
        </footer>
      </body>
    </html>
  );
}
