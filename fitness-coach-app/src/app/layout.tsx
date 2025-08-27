import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fitness Coach App - Your Personalized Filipino Fitness Coach",
  description: "A mobile-first fitness app designed for Filipino users. Get personalized workout plans, meal suggestions, and track your progress.",
  keywords: ["fitness", "workout", "nutrition", "Philippines", "Filipino", "health", "exercise"],
  authors: [{ name: "Fitness Coach App Team" }],
  creator: "Fitness Coach App",
  publisher: "Fitness Coach App",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fitness Coach",
  },
  openGraph: {
    type: "website",
    siteName: "Fitness Coach App",
    title: "Fitness Coach App - Your Personalized Filipino Fitness Coach",
    description: "A mobile-first fitness app designed for Filipino users. Get personalized workout plans, meal suggestions, and track your progress.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness Coach App - Your Personalized Filipino Fitness Coach",
    description: "A mobile-first fitness app designed for Filipino users. Get personalized workout plans, meal suggestions, and track your progress.",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        {/* Resource Hints */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        {/* Supabase project preconnect (safe fallback if env missing) */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL || "https://supabase.co"} crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fitness Coach" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        <LocaleProvider>
          <AuthProvider>
            <div id="root" className="relative flex min-h-screen flex-col pb-16 md:pb-0">
              {children}
            </div>
            <BottomNavigation />
            <Toaster />
            <GoogleAnalytics />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
