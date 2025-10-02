/** @type {import('next').NextConfig} */
const nextConfig = {
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