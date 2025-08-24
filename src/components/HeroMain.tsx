'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSaasUrlByRoute } from '../config/routes';

// 主题ID到SaaS页面和功能类型的映射
const themeToSaasConfigMap: Record<string, { page: string; variationType?: string; tab?: string }> = {
  // Magic Kit 相关功能
  'background_remove': { page: 'magic-kit', variationType: '3' },    // Remove Background
  'background_change': { page: 'magic-kit', variationType: '2' },    // Change Background
  'image_enhance': { page: 'magic-kit', variationType: '5' },        // Upscale
  'color_change': { page: 'magic-kit', variationType: '1' },         // Change Color
  'partial_modify': { page: 'magic-kit', variationType: '4' },       // Partial Modification
  
  // Virtual Try-On 相关功能
  'virtual_try': { page: 'virtual-try-on' },                        // Virtual Try-On
  
  // 首页 Image to Image 相关功能
  'outfit_generator': { page: '', variationType: '11', tab: 'image-to-image' },  // Vary style (首页)
  'sketch_convert': { page: '', variationType: '4', tab: 'image-to-image' },     // Sketch to Design (首页)
};

export default function HeroMain() {
  const { currentTheme } = useTheme();
  const { heroMain } = currentTheme;
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 获取当前页面对应的SaaS URL
  const currentSaasUrl = getSaasUrlByRoute(pathname.replace('/', ''));

  // 根据当前域名确定SaaS环境
  const getSaasBaseUrl = useCallback(() => {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
    
    // 根据当前域名判断环境
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      // 本地开发：默认跳转测试环境，避免本地未启动或端口冲突
      return 'https://test-mvp.creamoda.ai';
    } else if (currentHost.includes('test-mvp.creamoda.ai')) {
      // 测试环境
      return 'https://test-mvp.creamoda.ai';
    } else if (currentHost.includes('create.creamoda.ai')) {
      // 生产环境
      return 'https://create.creamoda.ai';
    } else if (currentHost.includes('vercel.app')) {
      // Vercel 预览部署环境，跳转到测试环境
      return 'https://test-mvp.creamoda.ai';
    } else {
      // 默认回退到测试环境
      return 'https://test-mvp.creamoda.ai';
    }
  }, []);

  // 处理demo图片点击事件
  const handleDemoClick = useCallback((imageSrc: string) => {
    // 构建完整的图片URL（落地页的图片路径）
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    
    // 处理图片路径兼容性：将 /marketing/images/ 路径转换为 SaaS 系统可访问的路径
    let processedImageSrc = imageSrc;
    if (imageSrc.startsWith('/marketing/images/')) {
      // 替换为标准的 /images/ 路径，这样 SaaS 系统可以访问
      processedImageSrc = imageSrc.replace('/marketing/images/', '/images/');
    }
    
    // 对于营销页面的图片，优先使用落地页域名，确保 SaaS 系统能够访问
    const landingBase = (hostname === 'localhost' || hostname === '127.0.0.1') 
      ? 'https://creamoda-loadingpage.vercel.app'
      : (imageSrc.startsWith('/marketing/') 
          ? 'https://creamoda-loadingpage.vercel.app' 
          : currentOrigin);
    
    const fullImageUrl = processedImageSrc.startsWith('http') ? processedImageSrc : `${landingBase}${processedImageSrc}`;
    
    // 将完整图片URL编码后传递给SaaS系统
    const encodedImageSrc = encodeURIComponent(fullImageUrl);
    
    // 根据当前主题获取对应的SaaS页面配置
    const saasConfig = themeToSaasConfigMap[currentTheme.id] || { page: 'magic-kit', variationType: '3' };
    
    // 动态获取SaaS系统的URL
    const saasBaseUrl = getSaasBaseUrl();
    
    // 根据页面类型构建不同的URL
    let saasUrl: string;
    const params = new URLSearchParams();
    params.set('imageUrl', encodedImageSrc);
    
    if (saasConfig.variationType) {
      params.set('variationType', saasConfig.variationType);
    }
    
    if (saasConfig.tab) {
      params.set('tab', saasConfig.tab);
    }
    
    // 构建最终URL
    if (saasConfig.page) {
      saasUrl = `${saasBaseUrl}/${saasConfig.page}?${params.toString()}`;
    } else {
      // 首页
      saasUrl = `${saasBaseUrl}/?${params.toString()}`;
    }
    
    console.log('Jumping to SaaS with theme:', currentTheme.id, 'page:', saasConfig.page, 'variationType:', saasConfig.variationType);
    
    // 在新窗口中打开SaaS系统
    window.open(saasUrl, '_blank');
  }, [currentTheme.id, getSaasBaseUrl]);

  // 首页公共状态（放在顶层，避免 Hook 顺序变化）
  const [saasBaseUrl, setSaasBaseUrl] = useState('https://test-mvp.creamoda.ai');
  useEffect(() => {
    setSaasBaseUrl(getSaasBaseUrl());
  }, [getSaasBaseUrl]);
  const [activeDot, setActiveDot] = useState<number | null>(1);

  // 首页（根路径）使用独立的 Hero 样式与内容
  if (isHomepage) {
    // 为避免 SSR/CSR 不一致，首页内容仅在客户端挂载后渲染
    if (!mounted) {
      return null;
    }

    return (
      <div className="hero-main homepage-hero-center">
        <div className="homepage-hero-logo">
          <Image
            src="/marketing/images/hero/official_hero.svg"
            alt="CREAMODA"
            width={900}
            height={280}
            className="homepage-hero-logo-img"
          />
        </div>
        <div className="homepage-tagline">
          <p>Reimagine Fashion with All-in-One</p>
          <p>AI-powered Solution</p>
        </div>
        <div className="homepage-cta">
          <a
            href={`${saasBaseUrl}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="homepage-cta-button"
          >
            Create Now
          </a>
        </div>

        {/* Stacked Cards Section */}
        <section className="stacked-cards-section">
          <div className="stacked-cards-container">
            <div className="stacked-card stacked-card-1">
              <Image src="/marketing/images/stacked/left_one.png" alt="stacked one" width={340} height={520} className="stacked-img" />
            </div>
            <div className="stacked-card stacked-card-2">
              <Image src="/marketing/images/stacked/left_two.png" alt="stacked two" width={360} height={540} className="stacked-img" />
            </div>
            <div className="stacked-card stacked-card-3">
              <Image src="/marketing/images/stacked/left_three.png" alt="stacked three" width={380} height={560} className="stacked-img" />
            </div>
            <div className="stacked-card stacked-card-4">
              <Image src="/marketing/images/stacked/left_four.png" alt="stacked four" width={360} height={540} className="stacked-img" />
            </div>
            <div className="stacked-card stacked-card-5">
              <Image src="/marketing/images/stacked/left_five.png" alt="stacked five" width={340} height={520} className="stacked-img" />
            </div>
          </div>
          <p className="stacked-cards-caption">From idea to bestseller in 24 hours</p>
        </section>
        
        {/* Feature Overview - horizontal scroll */}
        <section className="feature-overview-section">
          <h2 className="feature-overview-title">
            <span>Feature</span>
            <span>Overview</span>
          </h2>
          <div className="feature-overview-track">
            {[
              { href: '/image-background-remover', img: '/marketing/images/overview/bg_remover_before.png', title: 'Image Background Remover' },
              { href: '/image-background-changer', img: '/marketing/images/overview/bg_changer.png', title: 'Image Background Changer' },
              { href: '/image-color-changer', img: '/marketing/images/overview/color_changer.png', title: 'Image Color Changer' },
              { href: '/image-changer', img: '/marketing/images/overview/img_changer.png', title: 'AI Image Changer' },
              { href: '/image-enhancer', img: '/marketing/images/overview/img_enhancer.png', title: 'Image Enhancer' },
              { href: '/outfit-generator', img: '/marketing/images/overview/outfit_generate.png', title: 'Outfit Generator' },
              { href: '/sketch-to-image', img: '/marketing/images/overview/sketch_imgs.png', title: 'Sketch to Image' },
              { href: '/virtual-try-on', img: '/marketing/images/overview/virtual_try_on.png', title: 'Virtual Try-on' },
            ].map((card, index) => (
              <div key={card.href} className={`feature-card ${index === 0 ? 'feature-card-remover' : ''}`}>
                <Link href={card.href} className="feature-card-link">
                  <Image src={card.img} alt={card.title} width={900} height={620} className="feature-img" />
                </Link>
                {index === 0 && (
                  <div className="feature-overlay">
                    <Image
                      src="/marketing/images/overview/bg_remover_after.png"
                      alt="Image Background Removed"
                      width={360}
                      height={520}
                      className="feature-overlay-img"
                    />
                  </div>
                )}
                <div className="feature-card-caption">{card.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative hollow circle below Feature Overview */}
        <section className="circle-deco-section">
          <h3 className="circle-deco-title">
            <span>General</span>
            <span>Workflow</span>
          </h3>
          <div className="circle-deco-row">
            <div className="circle-deco-wrap">
              <div className="circle-deco-left" />
              <div
                className={`circle-dot circle-dot-1 ${activeDot === 1 ? 'active-dot' : ''}`}
                data-label="01"
                role="button"
                aria-label="Step 01"
                onClick={() => setActiveDot(1)}
              />
              <div
                className={`circle-dot circle-dot-2 ${activeDot === 2 ? 'active-dot' : ''}`}
                data-label="02"
                role="button"
                aria-label="Step 02"
                onClick={() => setActiveDot(2)}
              />
              <div
                className={`circle-dot circle-dot-3 ${activeDot === 3 ? 'active-dot' : ''}`}
                data-label="03"
                role="button"
                aria-label="Step 03"
                onClick={() => setActiveDot(3)}
              />
            </div>

            {/* Right-side content changes with activeDot */}
            <div className="circle-content">
              <Image
                src="/marketing/images/step/icon.png"
                alt="step icon"
                width={450}
                height={400}
                className="circle-content-icon"
              />
              {activeDot === 1 && (
                <>
                  <h4 className="circle-content-title">Input Design Idea or Reference Image</h4>
                  <p className="circle-content-desc">Share your concept or upload a reference picture to get started.</p>
                </>
              )}
              {activeDot === 2 && (
                <>
                  <h4 className="circle-content-title">Generate Design Images in Multiple Styles</h4>
                  <p className="circle-content-desc">Instantly receive AI-generated fashion designs in various styles.</p>
                </>
              )}
              {activeDot === 3 && (
                <>
                  <h4 className="circle-content-title">Bring Designs to Market</h4>
                  <p className="circle-content-desc">Contact our professional team to turn your finalized design into production, and launch your fashion pieces in the market.</p>
                </>
              )}
            </div>
            {/* Mobile-only simplified steps (no icon) */}
            <div className="circle-content-mobile">
              {[
                {
                  title: 'Input Design Idea or Reference Image',
                  desc: 'Share your concept or upload a reference picture to get started.'
                },
                {
                  title: 'Generate Design Images in Multiple Styles',
                  desc: 'Instantly receive AI-generated fashion designs in various styles.'
                },
                {
                  title: 'Bring Designs to Market',
                  desc: 'Contact our professional team to turn your finalized design into production, and launch your fashion pieces in the market.'
                }
              ].map((s, idx) => (
                <div className="circle-step" key={idx}>
                  <div className="circle-step-index">{`0${idx + 1}`}</div>
                  <div className="circle-step-texts">
                    <h4 className="circle-step-title">{s.title}</h4>
                    <p className="circle-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fashion Showcase Section */}
        <section className="fashion-showcase-section">
          <h2 className="fashion-showcase-title">
            <span>Fashion</span>
            <span>Showcase</span>
          </h2>
          <div className="fashion-showcase-gallery">
            {/* 第一列 */}
            <div className="fashion-showcase-column">
              <div className="fashion-showcase-item">
                <Image
                  src="/marketing/images/pubu/six.png"
                  alt="Fashion showcase 1"
                  width={450}
                  height={340}
                  className="fashion-showcase-img"
                />
              </div>
              <div className="fashion-showcase-item">
                <Image
                  src="/marketing/images/pubu/five.png"
                  alt="Fashion showcase 2"
                  width={450}
                  height={470}
                  className="fashion-showcase-img"
                />
              </div>
            </div>
            
            {/* 第二列 */}
            <div className="fashion-showcase-column">
              <div className="fashion-showcase-item">
                <Image
                  src="/marketing/images/pubu/four.png"
                  alt="Fashion showcase 3"
                  width={450}
                  height={580}
                  className="fashion-showcase-img"
                />
              </div>
              <div className="fashion-showcase-item">
                <Image
                  src="/marketing/images/pubu/three.png"
                  alt="Fashion showcase 4"
                  width={450}
                  height={410}
                  className="fashion-showcase-img"
                />
              </div>
            </div>
            
            {/* 第三列 */}
            <div className="fashion-showcase-column">
              <div className="fashion-showcase-item">
                <Image
                  src="/marketing/images/pubu/one.png"
                  alt="Fashion showcase 5"
                  width={450}
                  height={360}
                  className="fashion-showcase-img"
                />
              </div>
              <div className="fashion-showcase-item">
                <Image
                  src="/marketing/images/pubu/two.png"
                  alt="Fashion showcase 6"
                  width={450}
                  height={530}
                  className="fashion-showcase-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Beta Insights Section */}
        <section className="beta-insights-section">
          <h2 className="beta-insights-title">
            <span>Insights from</span>
            <span>Our Beta Testers</span>
          </h2>
          
          <div className="beta-insights-slider">
            <div className="beta-insights-track">
              {/* Beta Insight Card 1 */}
              <div className="beta-insight-card">
                <div className="beta-insight-content">
                  <p className="beta-insight-text">
                  "CREAMODA has been an invaluable partner for Hellotalk Knitted Hats. Their ability to offer a high variety of SKUs with low MOQs has allowed us to maintain product diversity while keeping production costs manageable. Their flexible and efficient design solutions, combined with their ability to deliver varied styles, have made them a trusted partner for our brand. We are confident in CREAMODA's capabilities and look forward to a long-term partnership with them. Their all-in-one design and production services have been a huge asset to our business."
                  </p>
                </div>
              </div>

              {/* Beta Insight Card 2 */}
              <div className="beta-insight-card">
                <div className="beta-insight-content">
                  <p className="beta-insight-text">
                    "Working with CREAMODA has set Hubble Pet Clothing to new heights. Their fast design delivery and comprehensive one-stop services have allowed us to focus on growing our brand while they handle the complexities of design and production. CREAMODA's value-added solutions, such as sourcing affordable fabrics and assisting with international e-commerce certifications, have been incredibly helpful. Their efficiency and holistic support have strengthened our partnership, and we are excited to renew our contract with them for 2025. CREAMODA has truly earned our trust and loyalty."
                  </p>
                </div>
              </div>

              {/* Beta Insight Card 3 */}
              <div className="beta-insight-card">
                <div className="beta-insight-content">
                  <p className="beta-insight-text">
                    "CREAMODA has consistently impressed us with their high standard of design flexibility and precision. Every sample they create meets our expectations and is production-ready, which has streamlined our manufacturing process significantly. Their commitment to excellence in both design and sample quality has made it easy for us to bring our products to market with confidence. We highly recommend CREAMODA for their professionalism, attention to detail, and ability to deliver exceptional results."
                  </p>
                </div>
              </div>

              {/* Beta Insight Card 4 */}
              <div className="beta-insight-card">
                <div className="beta-insight-content">
                  <p className="beta-insight-text">
                  "CREAMODA has been an absolute game-changer for my brand. It is now an indispensable tool in my workflow, helping me stay ahead in the fast-paced world of fashion. I highly recommend it to any designer looking to boost efficiency and innovation!"
                   
                  </p>
                </div>
              </div>
            </div>

            {/* 滑动导航按钮 */}
            <div className="insights-slider-nav">
              <button 
                className="insights-slider-btn"
                onClick={() => {
                  const track = document.querySelector('.beta-insights-track');
                  if (track) {
                    track.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="insights-slider-btn"
                onClick={() => {
                  const track = document.querySelector('.beta-insights-track');
                  if (track) {
                    track.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </section>
          {/* Trend CTA Section */}
          <section className="trend-cta-section">
          <h2 className="trend-cta-title">
            <span>No more chasing trends</span>
            <span>Start creating them instead</span>
          </h2>
          <div className="trend-cta-actions">
            <a
              href={`${saasBaseUrl}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="homepage-cta-button"
            >
              Create Now
            </a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="hero-main">
      <h1 className="hero-title">{heroMain.title}</h1>
      <div className="hero-subtitle">
        <p className="subtitle-main">{heroMain.subtitle}</p>
      </div>

      {/* 图片展示区域 */}
      <div className="hero-images">
        <div className="sample-image sample-1">
          <Image
            src={heroMain.mainImage}
            alt="Main sample image"
            width={500}
            height={750}
            className="sample-img"
          />
        </div>
        
        <div className="upload-showcase">
          <div className="upload-demo-area">
            <a 
              href={currentSaasUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="upload-demo-btn"
            >
              <Image
                src="/marketing/images/hero/upload.png"
                alt="Upload icon"
                width={18}
                height={18}
                className="upload-icon"
              />
              {heroMain.uploadText}
            </a>
            {/* <p className="upload-demo-text">{heroMain.uploadSubText}</p> */}
            {/* <button className="upload-tips-btn">
              <Image
                src="/images/hero/enhance/light.png"
                alt="Tips icon"
                width={16}
                height={16}
                className="tips-icon"
              />
              Upload Tips
            </button> */}
          </div>
          
          <div className="demo-suggestions">
            <p>No image? Try on of these:</p>
            <div className="demo-thumbnails">
              {heroMain.demoImages.map((imageSrc, index) => (
                <div key={index} className="demo-thumb" onClick={() => handleDemoClick(imageSrc)}>
                  <Image
                    src={imageSrc}
                    alt={`Demo image ${index + 1}`}
                    width={50}
                    height={50}
                    className="demo-img"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
