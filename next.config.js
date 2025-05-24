/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable Turbopack for faster development builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    serverActions: {
      allowedOrigins: ['*']
    },
  },
  // External packages for server components (moved from experimental)
  serverExternalPackages: ['mongoose'],
  // Configure allowed dev origins for cross-origin requests
  allowedDevOrigins: [
    'work-1-ctscfsondrbpxtkk.prod-runtime.all-hands.dev',
    'work-2-ctscfsondrbpxtkk.prod-runtime.all-hands.dev'
  ],
  // Suppress hydration warnings in development (caused by browser extensions)
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig