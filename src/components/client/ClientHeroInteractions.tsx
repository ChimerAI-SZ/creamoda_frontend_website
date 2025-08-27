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

  // 应用滚动效果到导航
  useEffect(() => {
    const nav = document.querySelector('.hero-nav');
    
    if (nav) {
      nav.classList.toggle('scrolled', isScrolled);
    }
  }, [isScrolled]);

  // 创建和管理下拉菜单
  useEffect(() => {
    const dropdownContainer = document.querySelector('.dropdown-container');
    if (!dropdownContainer) return;

    // 创建下拉菜单HTML结构
    dropdownContainer.innerHTML = `
      <!-- Fashion Design 下拉菜单 -->
      <div class="tools-dropdown fashion-design-dropdown ${isScrolled ? 'tools-dropdown-scrolled' : ''}">
        <div class="tools-dropdown-content">
          <div class="tools-category">
            <div class="category-items-container">
              <div class="category-items">
                <button class="tool-item" data-route="outfit-generator">AI Outfit Generator</button>
                <button class="tool-item" data-route="sketch-to-image">AI Sketch to Image Converter</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Virtual Try-on 下拉菜单 -->
      <div class="tools-dropdown virtual-tryon-dropdown ${isScrolled ? 'tools-dropdown-scrolled' : ''}">
        <div class="tools-dropdown-content">
          <div class="tools-category">
            <div class="category-items">
              <button class="tool-item" data-route="virtual-try-on">Virtual Try-On</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Magic Kit 下拉菜单 -->
      <div class="tools-dropdown magic-kit-dropdown ${isScrolled ? 'tools-dropdown-scrolled' : ''}">
        <div class="tools-dropdown-content">
          <div class="tools-category">
            <div class="category-items-container">
              <div class="category-items">
                <button class="tool-item" data-route="image-background-remover">Image Background Remover</button>
                <button class="tool-item" data-route="image-background-changer">Image Background Changer</button>
                <button class="tool-item" data-route="image-enhancer">Image Enhancer</button>
                <button class="tool-item" data-route="image-changer">AI Image Changer</button>
                <button class="tool-item" data-route="image-color-changer">Image Color Changer</button>
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
      const dropdownNames = ['fashion-design', 'virtual-tryon', 'magic-kit'];
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
    const toolItems = document.querySelectorAll('.tool-item[data-route]');
    
    const handleToolClick = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLButtonElement;
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
