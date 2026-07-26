import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Static (no-nonce) CSP so pages can stay statically generated — this site
// is static-first (AGENTS.md), and nonce-based CSP forces dynamic rendering
// on every page. Embeds only: Spotify/YouTube/Audiomack, per the same doc.
// Google Tag hosts are allowlisted for optional GA4/GTM (validated IDs only).
const csp = [
  "default-src 'self'",
  [
    "script-src",
    "'self'",
    "'unsafe-inline'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" "),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src",
    "'self'",
    "https://*.supabase.co",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://*.google-analytics.com",
    "https://www.googletagmanager.com",
    isDev ? "http://127.0.0.1:* ws://127.0.0.1:*" : "",
  ]
    .filter(Boolean)
    .join(" "),
  [
    "frame-src",
    "https://open.spotify.com",
    "https://www.youtube-nocookie.com",
    "https://audiomack.com",
    "https://www.googletagmanager.com",
  ].join(" "),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory confuses workspace inference.
  turbopack: { root: __dirname },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: csp },
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
        ],
      },
      {
        // Never let the SW itself go stale in a browser cache — a cached
        // old sw.js would keep serving an outdated offline strategy.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
