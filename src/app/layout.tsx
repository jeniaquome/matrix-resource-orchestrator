import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MRO | Matrix Resource Orchestrator",
  description: "AI-Powered R&D Resource Allocation for Matrix Organizations. Optimize cross-functional team allocation, track project ROI, and resolve resource conflicts in real-time.",
  keywords: ["resource management", "R&D", "matrix organization", "project management", "biotech", "pharmaceutical"],
  authors: [{ name: "Genentech" }],
  openGraph: {
    title: "MRO | Matrix Resource Orchestrator",
    description: "AI-Powered R&D Resource Allocation for Matrix Organizations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
