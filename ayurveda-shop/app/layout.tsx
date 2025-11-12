import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import GamificationWrapper from "@/components/gamification/GamificationWrapper";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

// Modern sans-serif for body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Elegant serif for headings
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayurveda Haven - Pure Herbal & Natural Wellness Products",
  description: "Discover the healing power of Ayurveda. Premium herbal supplements, natural oils, and wellness products for holistic health. 100% organic, cruelty-free, and sustainably sourced.",
  keywords: ["ayurveda", "herbal products", "natural wellness", "organic supplements", "ayurvedic medicine", "herbal oils"],
  authors: [{ name: "Ayurveda Haven" }],
  openGraph: {
    title: "Ayurveda Haven - Pure Herbal & Natural Wellness",
    description: "Ancient Ayurveda, Modern Wellness. Discover pure, herbal, wholesome products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <CartProvider>
          <Toaster position="top-right" richColors />
          {children}
          <GamificationWrapper />
        </CartProvider>
      </body>
    </html>
  );
}
