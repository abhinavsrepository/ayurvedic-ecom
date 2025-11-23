import type { NextConfig } from "next";

// Bundle analyzer configuration (optional, enable with ANALYZE=true)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      // AWS S3 bucket - Update with your bucket name
      {
        protocol: "https",
        hostname: "ayurveda-uploads.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ayurveda-uploads.s3.amazonaws.com",
      },
      // CloudFront CDN (if configured)
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      // Cloudinary (alternative to S3)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Compression
  compress: true,

  // Production optimizations
  swcMinify: true,
  poweredByHeader: false,

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@tanstack/react-query',
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/shop',
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
