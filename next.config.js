/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO 和性能优化配置
  trailingSlash: false,
  compress: true,
  
  // 静态生成优化
  output: 'standalone',
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // 启用实验性功能
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
    // Future experimental features can go here
  },
  
  // TypeScript configuration
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  
  // ESLint configuration
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  
  async rewrites() {
    // 如果环境变量未设置，返回空数组，避免构建错误
    const apiUrl = process.env.NEXT_LOCAL_API_URL;
    
    if (!apiUrl) {
      console.warn('警告: NEXT_LOCAL_API_URL 环境变量未设置，跳过 API 重写配置');
      return [];
    }

    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`
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
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY'
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
      },
      {
        // SEO和安全头部配置
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  images: {
    remotePatterns: [
      // Specific pattern for Aliyun OSS
      {
        protocol: 'https',
        hostname: 'infini-imagegen.oss-cn-beijing.aliyuncs.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'new-creamoda.oss-us-west-1.aliyuncs.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.aliyuncs.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.pinterest.com',
        port: '',
        pathname: '/**'
      },
      // Wildcard pattern for other domains
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
    // SEO和性能优化配置
    unoptimized: false,
    minimumCacheTTL: 31536000, // 1年缓存
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'], // 支持更现代的格式
    dangerouslyAllowSVG: false, // SEO安全性
    contentDispositionType: 'inline'
  },

  // next.config.js
  webpack: config => {
    // This is to ignore the canvas module in client-side bundling
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      canvas: 'commonjs canvas'
    });
    return config;
  }
};

module.exports = nextConfig;
