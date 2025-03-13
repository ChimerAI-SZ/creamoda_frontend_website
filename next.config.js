/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_LOCAL_API_URL}/api/v1/:path*`
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
      },
      {
        protocol: 'https',
        hostname: 'creamoda-test.oss-cn-beijing.aliyuncs.com',
        pathname: '/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      }
    ],
    domains: ['creamoda-test.oss-cn-beijing.aliyuncs.com', 'lh3.googleusercontent.com']
  },
  outputFileTracingExcludes: {
    '*': ['**/*']
  },
  experimental: {}
};

module.exports = nextConfig;
