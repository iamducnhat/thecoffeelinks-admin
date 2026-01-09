import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee Links Admin",
  description: "Admin dashboard for The Coffee Links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen bg-neutral-100">
          <Sidebar />
          <main className="flex-1 min-w-0">
            {/* Header Spacer or Top Bar if needed, otherwise padding */}
            <div className="p-8 lg:p-12 w-full max-w-[1600px]">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
