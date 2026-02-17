import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import GamificationWrapper from "@/components/gamification/GamificationWrapper";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import QueryProvider from "@/lib/providers/QueryProvider";
import { DEFAULT_METADATA, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/seo/config";
import StructuredData from "@/components/seo/StructuredData";
import FloatingMenu from "@/components/shared/FloatingMenu";
import { UIProvider } from "@/contexts/UIContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ExtensionCleanup from "@/components/shared/ExtensionCleanup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  preload: true,
  fallback: ['Georgia', 'serif'],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2E7D32",
};

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className="scroll-smooth" 
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          .supplier-app-container, .supplier-app-mini, [class*="react-draggable"], [class*="supplier-app"] { 
            display: none !important; 
            visibility: hidden !important; 
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            z-index: -9999 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }
        `}} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function clean() {
                  try {
                    document.querySelectorAll('[class*="supplier"], [class*="draggable"]').forEach(function(el) {
                      el.remove();
                    });
                  } catch(e) {}
                }
                
                clean();
                for(var i=0; i<5; i++) setTimeout(clean, i*100);
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://i.pravatar.cc" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} crossOrigin="anonymous" />
        )}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <StructuredData data={ORGANIZATION_SCHEMA} />
        <StructuredData data={WEBSITE_SCHEMA} />
        <StructuredData data={LOCAL_BUSINESS_SCHEMA} />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>

        <QueryProvider>
          <AuthProvider>
            <UIProvider>
              <CartProvider>
                <Toaster position="top-right" richColors />
                {children}
                <GamificationWrapper />
                <FloatingMenu />
                <ExtensionCleanup />
              </CartProvider>
            </UIProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
