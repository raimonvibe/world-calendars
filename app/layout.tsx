import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://world-calendars.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "World Calendar Hub",
  description: "Today's date in 18 major calendars — converters, holidays, and quick facts.",
  openGraph: {
    url: siteUrl,
    title: "World Calendar Hub",
    description: "Today's date in 18 major calendars — converters, holidays, and quick facts.",
    images: ["/social_preview_image.png"],
    type: "website",
  },
  icons: {
    icon: "/social_preview_image.png",
    apple: "/social_preview_image.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen text-zinc-900 antialiased dark:text-zinc-100`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
