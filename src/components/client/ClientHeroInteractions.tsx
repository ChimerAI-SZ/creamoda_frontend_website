'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleNavigation } from '../../utils/navigation';

interface ClientHeroInteractionsProps {
  currentSaasUrl?: string;
}

export default function ClientHeroInteractions({ currentSaasUrl }: ClientHeroInteractionsProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  
  // 检查当前路径是否为 /designs/slug
  const [isDesignSlugPage, setIsDesignSlugPage] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesignSlugPage(window.location.pathname.startsWith('/designs/') && window.location.pathname !== '/designs');
    }
  }, []);

  // 设置导航高度CSS变量
  useEffect(() => {
    const updateNavHeightVar = () => {
      const navEl = document.querySelector('.hero-nav') as HTMLElement;
      if (!navEl) return;
      const height = navEl.offsetHeight;
      document.documentElement.style.setProperty('--hero-nav-height', `${height}px`);
    };

    updateNavHeightVar();
    const resizeObserver = new ResizeObserver(updateNavHeightVar);
    const navEl = document.querySelector('.hero-nav');
    if (navEl) {
      resizeObserver.observe(navEl);
    }
    window.addEventListener('resize', updateNavHeightVar);
    
    return () => {
      window.removeEventListener('resize', updateNavHeightVar);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // 如果是 /designs/slug 页面，直接设置为滚动状态（黑色导航栏）
      if (isDesignSlugPage) {
        setIsScrolled(true);
      } else {
        // 获取导航栏的实际高度
        const navElement = document.querySelector('.hero-nav') as HTMLElement;
        const navHeight = navElement ? navElement.offsetHeight : 75;
        
        // 检测是否为移动端
        const isMobile = window.innerWidth < 768;
        
        // 移动端：滚动很少距离就变黑，确保用户看到效果
        // 桌面端：保持原有逻辑，滚动20px后变黑  
        const threshold = isMobile ? 10 : 20;
        
        const shouldScroll = window.scrollY > threshold;
        setIsScrolled(shouldScroll);
        
        // 调试信息（可以在开发者工具中查看）
        console.log('Scroll Debug:', {
          scrollY: window.scrollY,
          threshold,
          isMobile,
          navHeight,
          shouldScroll
        });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesignSlugPage]);

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

  // 应用滚动效果到导航
  useEffect(() => {
    const nav = document.querySelector('.hero-nav');
    
    if (nav) {
      nav.classList.toggle('scrolled', isScrolled);
      
      // 调试：检查类是否正确应用
      console.log('Nav class applied:', {
        isScrolled,
        hasScrolledClass: nav.classList.contains('scrolled'),
        allClasses: Array.from(nav.classList)
      });
    }
  }, [isScrolled]);

  // 创建和管理下拉菜单
  useEffect(() => {
    const dropdownContainer = document.querySelector('.dropdown-container');
    if (!dropdownContainer) return;

    // 创建下拉菜单HTML结构
    dropdownContainer.innerHTML = `
      <!-- Design Tools 下拉菜单 -->
      <div class="tools-dropdown fashion-design-dropdown ${isScrolled ? 'tools-dropdown-scrolled' : ''}">
        <div class="tools-dropdown-content-new">
          <div class="dropdown-grid">
            <div class="dropdown-column">
              <h3 class="dropdown-column-title">Fashion Design</h3>
              <div class="dropdown-tools-list">
                <a href="/outfit-generator" class="dropdown-tool-item" data-route="outfit-generator">AI Outfit Generator</a>
                <a href="/sketch-to-image" class="dropdown-tool-item" data-route="sketch-to-image">AI Sketch to Image Converter</a>
              </div>
            </div>
            <div class="dropdown-column">
              <h3 class="dropdown-column-title">Virtual Try-on</h3>
              <div class="dropdown-tools-list">
                <a href="/virtual-try-on" class="dropdown-tool-item" data-route="virtual-try-on">Virtual Try-On</a>
              </div>
            </div>
            <div class="dropdown-column">
              <h3 class="dropdown-column-title">Magic Kit</h3>
              <div class="dropdown-tools-list">
                <a href="/image-background-remover" class="dropdown-tool-item" data-route="image-background-remover">Image Background Remover</a>
                <a href="/image-background-changer" class="dropdown-tool-item" data-route="image-background-changer">Image Background Changer</a>
                <a href="/image-enhancer" class="dropdown-tool-item" data-route="image-enhancer">Image Enhancer</a>
                <a href="/image-changer" class="dropdown-tool-item" data-route="image-changer">AI Image Changer</a>
                <a href="/image-color-changer" class="dropdown-tool-item" data-route="image-color-changer">Image Color Changer</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    `;

    // 为下拉菜单添加交互事件
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    const cleanupFunctions: (() => void)[] = [];

    dropdowns.forEach((dropdown, index) => {
      const dropdownNames = ['fashion-design'];
      const dropdownName = dropdownNames[index];
      
      if (dropdownName) {
        const handleMouseEnter = () => openDropdown(dropdownName);
        const handleMouseLeave = () => scheduleClose();
        
        dropdown.addEventListener('mouseenter', handleMouseEnter);
        dropdown.addEventListener('mouseleave', handleMouseLeave);
        
        cleanupFunctions.push(() => {
          dropdown.removeEventListener('mouseenter', handleMouseEnter);
          dropdown.removeEventListener('mouseleave', handleMouseLeave);
        });
      }
    });

    // 为工具项添加点击事件
    const toolItems = document.querySelectorAll('.tool-item[data-route], .tool-title[data-route], .magic-tool-item[data-route]');
    
    const handleToolClick = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const route = target.getAttribute('data-route');
      if (route) {
        // 由于 event 参数是可选的，我们只传递必要的参数
        handleNavigation(route, router);
      }
    };

    toolItems.forEach(item => {
      item.addEventListener('click', handleToolClick);
      cleanupFunctions.push(() => {
        item.removeEventListener('click', handleToolClick);
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [router, isScrolled]);

  // 应用下拉菜单显示效果
  useEffect(() => {
    const allDropdowns = document.querySelectorAll('.tools-dropdown');
    allDropdowns.forEach((dropdown) => {
      dropdown.classList.remove('tools-dropdown-open');
    });

    if (activeDropdown) {
      const targetDropdown = document.querySelector(`.${activeDropdown}-dropdown`);
      if (targetDropdown) {
        targetDropdown.classList.add('tools-dropdown-open');
        
        // 为下拉菜单添加鼠标事件以保持显示
        const handleMouseEnter = () => openDropdown(activeDropdown);
        const handleMouseLeave = () => scheduleClose();
        
        targetDropdown.addEventListener('mouseenter', handleMouseEnter);
        targetDropdown.addEventListener('mouseleave', handleMouseLeave);
      }
      
      // 为hero-content添加dropdown-active类
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        heroContent.classList.add('dropdown-active');
      }
    } else {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        heroContent.classList.remove('dropdown-active');
      }
    }
  }, [activeDropdown]);

  return null; // 这个组件只提供行为，不渲染任何内容
}
