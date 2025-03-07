/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
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
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
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
