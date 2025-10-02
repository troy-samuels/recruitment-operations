/** @type {import('next').NextConfig} */
const nextConfig = {
  // Workaround for Next.js 15.0.3 static error page bug
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'www.jobwall.co.uk' },
        ],
        destination: 'https://jobwall.co.uk/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
