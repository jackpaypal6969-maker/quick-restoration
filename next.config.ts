import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 * - No third-party scripts are loaded; fonts are self-hosted by next/font.
 * - 'unsafe-inline' for scripts is required by Next.js hydration without a
 *   per-request nonce (which would force every page to render dynamically).
 * - 'unsafe-eval' is only enabled in development for React Fast Refresh.
 * - upgrade-insecure-requests and HSTS are added ONLY when the request arrived
 *   over https (Nginx sets X-Forwarded-Proto). Sending them on a plain-http
 *   preview (http://IP:PORT) makes browsers upgrade every asset URL to https,
 *   which fails and renders the page unstyled.
 */
const cspBase = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];

const commonHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const httpHeaders = [
  { key: "Content-Security-Policy", value: cspBase.join("; ") },
  ...commonHeaders,
];

const httpsHeaders = [
  { key: "Content-Security-Policy", value: [...cspBase, "upgrade-insecure-requests"].join("; ") },
  // preload is deliberately omitted until the client opts into the HSTS preload list.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  ...commonHeaders,
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2400],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: httpHeaders },
      // Later entries override earlier ones for the same header key.
      {
        source: "/(.*)",
        has: [{ type: "header", key: "x-forwarded-proto", value: "https" }],
        headers: httpsHeaders,
      },
    ];
  },
};

export default nextConfig;
