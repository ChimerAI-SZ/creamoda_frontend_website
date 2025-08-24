'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSaasUrlByRoute } from '../config/routes';
import { handleNavigation } from '../utils/navigation';
import HeroMain from './HeroMain';
import FusionGuide from './FusionGuide';
import WhyChoose from './WhyChoose';
import OfferMore from './OfferMore';

export default function Hero() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // 获取当前页面对应的SaaS URL
  const currentSaasUrl = getSaasUrlByRoute(pathname.replace('/', ''));

  useEffect(() => {
    const updateNavHeightVar = () => {
      const navEl = navRef.current;
      if (!navEl) return;
      const height = navEl.offsetHeight;
      document.documentElement.style.setProperty('--hero-nav-height', `${height}px`);
    };

    updateNavHeightVar();
    const resizeObserver = new ResizeObserver(updateNavHeightVar);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }
    window.addEventListener('resize', updateNavHeightVar);
    return () => {
      window.removeEventListener('resize', updateNavHeightVar);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openDropdown = (dropdownName: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(dropdownName);
  };

  const scheduleClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      closeTimeoutRef.current = null;
    }, 180);
  };

  return (
    <section className="hero-container">
      {/* 背景 */}
      <div className="hero-background"></div>
      
      {/* 内容 */}
      <div className={`hero-content ${activeDropdown ? 'dropdown-active' : ''}`}>
        {/* 导航栏 */}
        <nav
          className={`hero-nav ${isScrolled ? 'scrolled' : ''}`}
          ref={(el) => {
            navRef.current = el;
          }}
        >
          <div className="hero-logo">
            <Image
              src={isScrolled ? "/marketing/images/logo_light.png" : "/marketing/images/logo.png"}
              alt="CREAMODA"
              width={140}
              height={45}
              className="logo-image"
              style={{
                width: 'clamp(80px, 12vw, 140px)',
                height: 'auto'
              }}
            />
          </div>
          <div className="hero-nav-links">
            <div 
              className="nav-dropdown"
              onMouseEnter={() => openDropdown('fashion-design')}
              onMouseLeave={scheduleClose}
            >
              <button 
                className="nav-link tools-link"
              >
                Fashion Design
                <svg 
                  className={`dropdown-arrow ${activeDropdown === 'fashion-design' ? 'dropdown-arrow-open' : ''}`}
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div 
              className="nav-dropdown"
              onMouseEnter={() => openDropdown('virtual-tryon')}
              onMouseLeave={scheduleClose}
            >
              <button 
                className="nav-link tools-link"
              >
                Virtual Try-on
                <svg 
                  className={`dropdown-arrow ${activeDropdown === 'virtual-tryon' ? 'dropdown-arrow-open' : ''}`}
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div 
              className="nav-dropdown"
              onMouseEnter={() => openDropdown('magic-kit')}
              onMouseLeave={scheduleClose}
            >
              <button 
                className="nav-link tools-link"
              >
                Magic Kit
                <svg 
                  className={`dropdown-arrow ${activeDropdown === 'magic-kit' ? 'dropdown-arrow-open' : ''}`}
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
      
          </div>
          <a 
            href={currentSaasUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="create-btn"
          >
            Create
          </a>
        </nav>

        {/* 下拉菜单容器 */}
        <div className="dropdown-container">
          {/* Fashion Design 下拉菜单 */}
          {activeDropdown === 'fashion-design' && (
            <div 
              className={`tools-dropdown tools-dropdown-open fashion-design-dropdown ${isScrolled ? 'tools-dropdown-scrolled' : ''}`}
              onMouseEnter={() => openDropdown('fashion-design')}
              onMouseLeave={scheduleClose}
            >
              <div className="tools-dropdown-content">
                <div className="tools-category">
                  {/* <h3 className="category-title">Design Kit</h3> */}
                  <div className="category-items-container">
                    <div className="category-items">
                      <button 
                        onClick={(e) => handleNavigation('outfit-generator', router, e)} 
                        className="tool-item"
                      >
                        AI Outfit Generator
                      </button>
                      <button 
                        onClick={(e) => handleNavigation('sketch-to-image', router, e)} 
                        className="tool-item"
                      >
                        AI Sketch to Image Converter
                      </button>
                      {/* <button onClick={(e) => handleNavigation('sketch-to-image', router, e)} className="tool-item">Video Virtual Try-on</button>
                      <button onClick={(e) => handleNavigation('sketch-to-image', router, e)} className="tool-item">Plus-Size Try-on Model</button>
                      <button onClick={(e) => handleNavigation('sketch-to-image', router, e)} className="tool-item">AI Image Extender</button> */}
                      
                    </div>
                    {/* <div className="category-items">
                      <a href="https://create.creamoda.ai/" className="tool-item">Change Style</a>
                      <a href="https://create.creamoda.ai/" className="tool-item">Change Fabric</a>
                      <a href="https://create.creamoda.ai/" className="tool-item">Change Printing</a>
                      <a href="https://create.creamoda.ai/" className="tool-item">Style Fusion</a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Virtual Try-on 下拉菜单 */}
          {activeDropdown === 'virtual-tryon' && (
            <div 
              className={`tools-dropdown tools-dropdown-open virtual-tryon-dropdown ${isScrolled ? 'tools-dropdown-scrolled' : ''}`}
              onMouseEnter={() => openDropdown('virtual-tryon')}
              onMouseLeave={scheduleClose}
            >
              <div className="tools-dropdown-content">
                <div className="tools-category">
                  {/* <h3 className="category-title">Virtual Tryon</h3> */}
                  <div className="category-items">
                    <button 
                      onClick={(e) => handleNavigation('virtual-try-on', router, e)} 
                      className="tool-item"
                    >
                      Virtual Try-On
                    </button>
                    {/* <a href="https://create.creamoda.ai/virtual-try-on" className="tool-item">Change Pose</a> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Magic Kit 下拉菜单 */}
          {activeDropdown === 'magic-kit' && (
            <div 
              className={`tools-dropdown tools-dropdown-open magic-kit-dropdown ${isScrolled ? 'tools-dropdown-scrolled' : ''}`}
              onMouseEnter={() => openDropdown('magic-kit')}
              onMouseLeave={scheduleClose}
            >
              <div className="tools-dropdown-content">
                <div className="tools-category">
                  {/* <h3 className="category-title">Magic Kit</h3> */}
                  <div className="category-items-container">
                    <div className="category-items">
                      <button 
                        onClick={(e) => handleNavigation('image-background-remover', router, e)} 
                        className="tool-item"
                      >
                        Image Background Remover
                      </button>
                      <button 
                        onClick={(e) => handleNavigation('image-background-changer', router, e)} 
                        className="tool-item"
                      >
                        Image Background Changer
                      </button>
                      <button 
                        onClick={(e) => handleNavigation('image-enhancer', router, e)} 
                        className="tool-item"
                      >
                        Image Enhancer
                      </button>
                      <button 
                        onClick={(e) => handleNavigation('image-changer', router, e)} 
                        className="tool-item"
                      >
                        AI Image Changer
                      </button>
                      <button 
                        onClick={(e) => handleNavigation('image-color-changer', router, e)} 
                        className="tool-item"
                      >
                        Image Color Changer
                      </button>
                    </div>
                    {/* <div className="category-items">
                      <a href="https://create.creamoda.ai/magic-kit" className="tool-item">Pattern Extraction</a>
                      <a href="https://create.creamoda.ai/magic-kit" className="tool-item">pattern application</a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 主要内容 - 使用子组件 */}
        <HeroMain />
        {/* 只在子页面显示 FusionGuide 组件，首页不显示 */}
        {pathname !== '/' && <FusionGuide />}
        {/* 只在子页面显示 WhyChoose 组件，首页不显示 */}
        {pathname !== '/' && <WhyChoose />}
        {/* 只在子页面显示 We Offer More 组件，首页不显示 */}
        {pathname !== '/' && <OfferMore />}
      </div>
    </section>
  );
}