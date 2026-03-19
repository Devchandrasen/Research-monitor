import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Research Monitor - Global Research Intelligence",
  description: "Real-time monitoring of global research activities, PhD positions, postdoc opportunities, funding calls, and R&D investment across the world.",
  keywords: ["research", "PhD", "postdoc", "funding", "global research", "academic positions", "research grants"],
  authors: [{ name: "World Research Monitor" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "World Research Monitor",
    description: "Real-time global research intelligence platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
