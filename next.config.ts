import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/marchio/the",
        destination: "/marchi",
        permanent: true,
      },
      {
        source: "/marchio/ballantine-s",
        destination: "/marchio/ballantines",
        permanent: true,
      },
      {
        source: "/marchio/crafter-s",
        destination: "/marchio/crafters",
        permanent: true,
      },
      {
        source: "/marchio/gosling-s",
        destination: "/marchio/goslings",
        permanent: true,
      },
      {
        source: "/marchio/glen",
        destination: "/marchio/the-glen-grant",
        permanent: true,
      },
      {
        source: "/marchio/glenlivet",
        destination: "/marchio/the-glenlivet",
        permanent: true,
      },
      {
        source: "/marchio/j-e-b-40",
        destination: "/marchio/j-b",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
