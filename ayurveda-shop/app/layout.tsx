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
      data-extension-cleaned="false"
    >
      <head>
        {/* Anti-extension: Remove injected elements immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove any existing extension elements
                document.querySelectorAll('div[class*="supplier"], div[class*="react-draggable"]').forEach(el => el.remove());
                
                // Block future injections
                const originalAppendChild = Element.prototype.appendChild;
                Element.prototype.appendChild = function(node) {
                  if (node.nodeType === 1) {
                    const className = node.className || '';
                    if (className.includes && (className.includes('supplier') || className.includes('react-draggable'))) {
                      return node;
                    }
                  }
                  return originalAppendChild.call(this, node);
                };
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
          <UIProvider>
            <CartProvider>
              <Toaster position="top-right" richColors />
              {children}
              <GamificationWrapper />
              <FloatingMenu />
            </CartProvider>
          </UIProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
