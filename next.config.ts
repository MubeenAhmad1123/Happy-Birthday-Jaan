import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Robots-Tag',           value: 'noindex, nofollow' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'Referrer-Policy',         value: 'no-referrer' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://storage.googleapis.com",
              "media-src 'self' blob: https://storage.googleapis.com",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // Images from signed GCS URLs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },

  outputFileTracingIncludes: {
    '/api/photos/[id]': ['./assets-private/assets/photos/**/*'],
    '/api/photos/*': ['./assets-private/assets/photos/**/*'],
    '/api/**/*': ['./assets-private/assets/photos/**/*'],
  },
}

export default nextConfig
