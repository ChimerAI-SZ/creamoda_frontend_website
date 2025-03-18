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

  // 添加允许CORS的headers配置
  async headers() {
    return [
      {
        // 针对图片优化API添加CORS头
        source: '/_next/image/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // 所有API路由允许CORS
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ];
  },

  images: {
    remotePatterns: [
      // Wildcard pattern to allow all domains
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**'
      }
    ],
    // Allow all domains without restriction
    domains: ['*'],
    // Disable domain verification (alternative approach)
    // Set to true only if the above doesn't work with some images
    unoptimized: false,
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp']
  },
  outputFileTracingExcludes: {
    '*': ['**/*']
  },
  experimental: {}
};

module.exports = nextConfig;
