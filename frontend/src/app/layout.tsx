import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | EduVerse",
    default: "EduVerse",
  },
  description: "Very much a beta app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <ThemeProvider>
          <nav className="fixed top-0 w-full">
            <Navbar />
          </nav>
          <div className="mt-16 pt-3">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
