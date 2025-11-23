import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import GamificationWrapper from "@/components/gamification/GamificationWrapper";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import QueryProvider from "@/lib/providers/QueryProvider";
import { DEFAULT_METADATA, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/seo/config";
import StructuredData from "@/components/seo/StructuredData";

// Modern sans-serif for body text - optimized with next/font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// Elegant serif for headings - optimized with next/font
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ['Georgia', 'serif'],
});

// Enhanced metadata with full SEO optimization
export const metadata: Metadata = DEFAULT_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Performance: Preconnect to external domains */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://i.pravatar.cc" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />

        {/* Preconnect to API endpoints for better performance */}
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} crossOrigin="anonymous" />
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Structured Data for SEO */}
        <StructuredData data={ORGANIZATION_SCHEMA} />
        <StructuredData data={WEBSITE_SCHEMA} />
        <StructuredData data={LOCAL_BUSINESS_SCHEMA} />

        {/* Accessibility: Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>

        <QueryProvider>
          <CartProvider>
            <Toaster position="top-right" richColors />
            {children}
            <GamificationWrapper />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
