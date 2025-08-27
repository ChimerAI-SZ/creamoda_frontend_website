import Image from 'next/image';
import Link from 'next/link';
import { ThemeConfig } from '../../types/theme';

interface StaticHeroMainProps {
  theme: ThemeConfig;
  saasUrl: string;
  isHomepage?: boolean;
}

export default function StaticHeroMain({ theme, saasUrl, isHomepage = false }: StaticHeroMainProps) {
  const { heroMain } = theme;

  // 首页内容（静态版本 - 移除所有客户端交互）
  if (isHomepage) {
    return (
      <div className="hero-main homepage-hero-center">
        <div className="homepage-hero-cards" aria-label="homepage-hero-cards">
          <div className="hero-card hero-card-top">
            <div className="hero-card-content">
              <h1 className="hero-title">
                <span>From Idea to Bestseller</span>
                <span>in 24 Hours</span>
              </h1>
              <div className="hero-subtitle">
                <p className="subtitle-main">Reimagine Fashion with All-in-One AI-powered Solution</p>
              </div>
              <div>
                <Link
                  href="https://create.creamoda.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="upload-demo-btn"
                >
                  Design Now
                </Link>
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <Image
              src="/marketing/images/hero/official_hero/official_girl.png"
              alt="Fashion girl"
              fill
              quality={100}
              priority
              className="hero-visual-img"
            />
          </div>
          <div className="hero-card hero-card-bottom-right">
            <div className="hero-slider" aria-label="official-hero-slider">
              {[
                'one.png',
                'two.png',
                'three.png',
                'four.png',
                'five.png',
                'six.png',
                'seven.png',
              ].map((name) => (
                <div key={name} className="hero-slide">
                  <Image
                    src={`/marketing/images/hero/official_hero/${name}`}
                    alt={`official hero ${name}`}
                    fill
                    sizes="(max-width: 900px) 200px, 240px"
                    quality={100}
                    className="hero-slide-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stacked Cards Section */}
        {/* <section className="stacked-cards-section">
          <div className="stacked-cards-container">
            <div className="stacked-card stacked-card-1">
              <Image 
                src="/marketing/images/stacked/left_one.png" 
                alt="Fashion design example 1" 
                width={340} 
                height={520} 
                className="stacked-img" 
              />
            </div>
            <div className="stacked-card stacked-card-2">
              <Image 
                src="/marketing/images/stacked/left_two.png" 
                alt="Fashion design example 2" 
                width={360} 
                height={540} 
                className="stacked-img" 
              />
            </div>
            <div className="stacked-card stacked-card-3">
              <Image 
                src="/marketing/images/stacked/left_three.png" 
                alt="Fashion design example 3" 
                width={380} 
                height={560} 
                className="stacked-img" 
              />
            </div>
            <div className="stacked-card stacked-card-4">
              <Image 
                src="/marketing/images/stacked/left_four.png" 
                alt="Fashion design example 4" 
                width={360} 
                height={540} 
                className="stacked-img" 
              />
            </div>
            <div className="stacked-card stacked-card-5">
              <Image 
                src="/marketing/images/stacked/left_five.png" 
                alt="Fashion design example 5" 
                width={340} 
                height={520} 
                className="stacked-img" 
              />
            </div>
          </div>
          <p className="stacked-cards-caption">From idea to bestseller in 24 hours</p>
        </section> */}
        
        {/* Feature Overview */}
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

        {/* General Workflow - 完整版本（桌面 + 移动） */}
        <section className="circle-deco-section">
          <div className="circle-deco-title-container">
            <h3 className="circle-deco-title">
              <span>General</span>
              <span>Workflow</span>
            </h3>
          </div>
          <div className="circle-deco-row">
            <div className="circle-deco-wrap">
              <div className="circle-deco-left" />
              <div
                className="circle-dot circle-dot-1 active-dot"
                data-label="01"
                role="button"
                aria-label="Step 01"
              />
              <div
                className="circle-dot circle-dot-2"
                data-label="02"
                role="button"
                aria-label="Step 02"
              />
              <div
                className="circle-dot circle-dot-3"
                data-label="03"
                role="button"
                aria-label="Step 03"
              />
            </div>

            {/* Right-side content (默认显示第一步) */}
            <div className="circle-content">
              <Image
                src="/marketing/images/step/icon.png"
                alt="step icon"
                width={450}
                height={400}
                className="circle-content-icon"
              />
              <h4 className="circle-content-title">Input Design Idea or Reference Image</h4>
              <p className="circle-content-desc">Share your concept or upload a reference picture to get started.</p>
            </div>

            {/* Mobile-only simplified steps */}
            <div className="circle-content-mobile">
              <div className="circle-step">
                <div className="circle-step-index">01</div>
                <div className="circle-step-texts">
                  <h4 className="circle-step-title">Input Design Idea or Reference Image</h4>
                  <p className="circle-step-desc">Share your concept or upload a reference picture to get started.</p>
                </div>
              </div>
              <div className="circle-step">
                <div className="circle-step-index">02</div>
                <div className="circle-step-texts">
                  <h4 className="circle-step-title">Generate Design Images in Multiple Styles</h4>
                  <p className="circle-step-desc">Instantly receive AI-generated fashion designs in various styles.</p>
                </div>
              </div>
              <div className="circle-step">
                <div className="circle-step-index">03</div>
                <div className="circle-step-texts">
                  <h4 className="circle-step-title">Bring Designs to Market</h4>
                  <p className="circle-step-desc">Contact our professional team to turn your finalized design into production, and launch your fashion pieces in the market.</p>
                </div>
              </div>
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
            <div className="fashion-showcase-column">
              <div className="fashion-showcase-item">
                <Image src="/marketing/images/pubu/six.png" alt="Fashion showcase 1" width={450} height={340} className="fashion-showcase-img" />
              </div>
              <div className="fashion-showcase-item">
                <Image src="/marketing/images/pubu/five.png" alt="Fashion showcase 2" width={450} height={470} className="fashion-showcase-img" />
              </div>
            </div>
            <div className="fashion-showcase-column">
              <div className="fashion-showcase-item">
                <Image src="/marketing/images/pubu/four.png" alt="Fashion showcase 3" width={450} height={580} className="fashion-showcase-img" />
              </div>
              <div className="fashion-showcase-item">
                <Image src="/marketing/images/pubu/three.png" alt="Fashion showcase 4" width={450} height={410} className="fashion-showcase-img" />
              </div>
            </div>
            <div className="fashion-showcase-column">
              <div className="fashion-showcase-item">
                <Image src="/marketing/images/pubu/one.png" alt="Fashion showcase 5" width={450} height={360} className="fashion-showcase-img" />
              </div>
              <div className="fashion-showcase-item">
                <Image src="/marketing/images/pubu/two.png" alt="Fashion showcase 6" width={450} height={530} className="fashion-showcase-img" />
              </div>
            </div>
          </div>
        </section>

        {/* Beta Testers Section */}
        <section className="beta-testers-section">
          <h2 className="beta-testers-title">
            <span>Insights from</span>
            <span>Our Beta Testers</span>
          </h2>
          <div className="beta-testers-slider">
            <div className="beta-testers-track">
              <div className="beta-tester-card">
                <div className="beta-tester-content">
                  <p className="beta-tester-text">
                  &quot;CREAMODA has been an invaluable partner for Hellotalk Knitted Hats. Their ability to offer a high variety of SKUs with low MOQs has allowed us to maintain product diversity while keeping production costs manageable. Their flexible and efficient design solutions, combined with their ability to deliver varied styles, have made them a trusted partner for our brand. We are confident in CREAMODA&apos;s capabilities and look forward to a long-term partnership with them. Their all-in-one design and production services have been a huge asset to our business.&quot;
                  </p>
                </div>
              </div>
              <div className="beta-tester-card">
                <div className="beta-tester-content">
                  <p className="beta-tester-text">
                  &quot;CREAMODA has consistently impressed us with their high standard of design flexibility and precision. Every sample they create meets our expectations and is production-ready, which has streamlined our manufacturing process significantly. Their commitment to excellence in both design and sample quality has made it easy for us to bring our products to market with confidence. We highly recommend CREAMODA for their professionalism, attention to detail, and ability to deliver exceptional results.&quot;
                  </p>
                </div>
              </div>
              <div className="beta-tester-card">
                <div className="beta-tester-content">
                  <p className="beta-tester-text">
                  &quot;CREAMODA has been an absolute game-changer for my brand. It is now an indispensable tool in my workflow, helping me stay ahead in the fast-paced world of fashion. I highly recommend it to any designer looking to boost efficiency and innovation!&quot;
                  </p>
                </div>
              </div>
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
            <Link
              href="https://create.creamoda.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="homepage-cta-button"
            >
              Create Now
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // 功能页面内容（静态版本）
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
            alt={`${heroMain.title} sample image`}
            width={600}
            height={900}
            className="sample-img"
          />
        </div>
        
        <div className="upload-showcase">
          <div className="upload-demo-area">
            <Link 
              href={saasUrl} 
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
            </Link>
          </div>
          
          <div className="demo-suggestions">
            <p>No image? Try one of these:</p>
            <div className="demo-thumbnails">
              {heroMain.demoImages.map((imageSrc, index) => (
                <div key={index} className="demo-thumb">
                  <Image
                    src={imageSrc}
                    alt={`Demo image ${index + 1} for ${heroMain.title}`}
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
