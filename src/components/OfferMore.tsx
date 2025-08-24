'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { handleNavigation } from '../utils/navigation';

export default function OfferMore() {
  const router = useRouter();
  const pathname = usePathname();
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 卡片标题到路由的映射
  const cardRouteMapping: Record<string, string> = {
    'Image Background Remover': 'image-background-remover',
    'Image Background Changer': 'image-background-changer',
    'Image Enhancer': 'image-enhancer',
    'AI Image Changer': 'image-changer',
    'Image Color Changer': 'image-color-changer',
    'AI Virtual Try-On': 'virtual-try-on',
    'AI Outfit Generator': 'outfit-generator',
    'AI Sketch to Image Converter': 'sketch-to-image'
  };

  // 所有卡片配置
  const allCards = [
    {
      title: 'Image Background Remover',
      route: 'image-background-remover',
      image: '/marketing/images/card/removes_bg.png',
      cornerImage: '/marketing/images/card/removes_bg_rt.png',
      description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.',
      hasCorner: true,
      hasEnhance: false,
      hasColor: false
    },
    {
      title: 'Image Background Changer',
      route: 'image-background-changer',
      image: '/marketing/images/card/changes_bg.png',
      description: 'Replace any background with custom colors, images, or scenes.',
      hasCorner: false,
      hasEnhance: false,
      hasColor: false
    },
    {
      title: 'Image Enhancer',
      route: 'image-enhancer',
      image: '/marketing/images/card/upscaless.png',
      enhanceImage: '/marketing/images/card/upscale_r.png',
      description: 'Boost image resolution up to 2× without losing sharpness or detail.',
      hasCorner: false,
      hasEnhance: true,
      hasColor: false
    },
    {
      title: 'AI Image Changer',
      route: 'image-changer',
      image: '/marketing/images/card/partial_mod.png',
      description: 'Edit or replace only the areas you select, keeping the rest untouched.',
      hasCorner: false,
      hasEnhance: false,
      hasColor: false
    },
    {
      title: 'Image Color Changer',
      route: 'image-color-changer',
      image: '/marketing/images/card/change_colors.png',
      colorImage: '/marketing/images/card/change_color_r.png',
      description: 'Instantly swap product or object colors with realistic results.',
      hasCorner: false,
      hasEnhance: false,
      hasColor: true
    },
    {
      title: 'AI Virtual Try-On',
      route: 'virtual-try-on',
      image: '/marketing/images/card/virtual_try.png',
      description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.',
      hasCorner: false,
      hasEnhance: false,
      hasColor: false
    },
    {
      title: 'AI Outfit Generator',
      route: 'outfit-generator',
      image: '/marketing/images/card/designs.png',
      description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.',
      hasCorner: false,
      hasEnhance: false,
      hasColor: false
    },
    {
      title: 'AI Sketch to Image Converter',
      route: 'sketch-to-image',
      image: '/marketing/images/card/sketch_design.png',
      description: 'Turn garment sketches into realistic images for prototyping and presentations.',
      hasCorner: false,
      hasEnhance: false,
      hasColor: false
    }
  ];

  // 过滤掉当前页面对应的卡片
  const filteredCards = allCards.filter(card => {
    const currentRoute = pathname.replace('/', '');
    return card.route !== currentRoute;
  });

  // 处理卡片点击事件
  const handleCardClick = (cardTitle: string) => {
    const route = cardRouteMapping[cardTitle];
    if (route) {
      handleNavigation(route, router);
    }
  };

  const checkScrollPosition = () => {
    if (cardsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = cardsContainerRef.current;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = cardsContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  const scrollLeft = () => {
    if (cardsContainerRef.current && canScrollLeft) {
      cardsContainerRef.current.scrollBy({
        left: -350, // 滚动一个卡片的宽度
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (cardsContainerRef.current && canScrollRight) {
      cardsContainerRef.current.scrollBy({
        left: 350, // 滚动一个卡片的宽度
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="offer-more-section">
      <div className="offer-more-header">
        <h2 className="offer-more-title">We Offer More</h2>
        <div className="offer-more-navigation">
          <button className={`nav-arrow nav-arrow-left ${!canScrollLeft ? 'nav-arrow-disabled' : ''}`} onClick={scrollLeft}>
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M8 2L2 9L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={`nav-arrow nav-arrow-right ${!canScrollRight ? 'nav-arrow-disabled' : ''}`} onClick={scrollRight}>
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M2 2L8 9L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="offer-more-cards" ref={cardsContainerRef}>
        {filteredCards.map((card, index) => (
          <div 
            key={card.route}
            className={`offer-card ${card.hasCorner ? 'offer-card-with-corner' : ''} ${card.hasEnhance ? 'offer-card-with-enhance' : ''} ${card.hasColor ? 'offer-card-with-color' : ''}`} 
            onClick={() => handleCardClick(card.title)} 
            style={{ cursor: 'pointer' }}
          >
            {card.hasCorner && (
              <div className="corner-image">
                <Image
                  src={card.cornerImage!}
                  alt={`${card.title} Corner`}
                  width={120}
                  height={180}
                  className="corner-img"
                />
              </div>
            )}
            <div className={`offer-card-image ${card.hasCorner ? 'offer-card-image-transparent' : ''}`}>
              <Image
                src={card.image}
                alt={card.title}
                width={280}
                height={201}
                className="card-img"
              />
              {card.hasEnhance && (
                <div className="enhance-right">
                  <Image
                    src={card.enhanceImage!}
                    alt="After Enhancement"
                    width={70}
                    height={70}
                    className="enhance-img"
                  />
                </div>
              )}
              {card.hasColor && (
                <div className="color-change-right">
                  <Image
                    src={card.colorImage!}
                    alt="Color Change Effect"
                    width={110}
                    height={120}
                    className="color-change-img"
                  />
                </div>
              )}
            </div>
            <div className="offer-card-content">
              <h3 className="offer-card-title">{card.title}</h3>
              <p className="offer-card-desc">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
