import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import { headers } from "next/headers";
import StoreProvider from "./StoreProvider";
import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kliqly.link",
  description: "Create short, smart links with built-in analytics. Fast, fun, and totally kliq-worthy.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <Providers cookies={cookies}>{children}</Providers>
          </ThemeProvider>
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
