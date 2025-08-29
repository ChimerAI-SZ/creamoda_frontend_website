import { getAllRoutes } from '@/src/config/routes';

export async function GET() {
  const baseUrl = 'https://creamoda.ai';
  const routes = getAllRoutes();
  
  // 静态页面
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' }, // 首页
    { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/terms-of-service', priority: '0.5', changefreq: 'yearly' }
  ];
  
  // 动态工具页面
  const toolPages = routes.map(route => ({
    url: `/${route}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));
  
  // SaaS 创建页面
  const createPages = [
    { url: '/magic-kit/create', priority: '0.9', changefreq: 'weekly' },
    { url: '/virtual-try-on/create', priority: '0.9', changefreq: 'weekly' },
    { url: '/fashion-design/create', priority: '0.9', changefreq: 'weekly' }
  ];
  
  const allPages = [...staticPages, ...toolPages, ...createPages];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${allPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
