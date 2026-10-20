import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }], qualities: [75, 85] },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://*.googleusercontent.com; font-src 'self'; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://www.google-analytics.com; frame-src https://*.firebaseapp.com https://www.paytr.com; object-src 'none'; base-uri 'self'; form-action 'self' https://*.iyzipay.com; frame-ancestors 'none'",
          },
          ...(process.env.NODE_ENV === 'production' && process.env.APP_URL?.startsWith('https:')
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
            : []),
        ],
      },
    ];
  },
};
export default config;
