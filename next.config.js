/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_LOCAL_API_URL}/api/v1/:path*`
      },
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '40e507dd0272b7bb46d376a326e6cb3c.cdn.bubble.io',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com'
      }
    ]
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': ['**/*']
    }
  }
};

module.exports = nextConfig;
