'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { eventBus } from '@/utils/events';
import { isAuthenticated } from '@/lib/api/token';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

export default function MobileMenuToggle() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesignSlugPage, setIsDesignSlugPage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 使用Zustand store获取用户信息
  const { username, email, headPic, fetchUserInfo } = usePersonalInfoStore();

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      setIsAnimating(true);
      // 添加模糊效果的CSS类到body
      document.body.classList.add('mobile-menu-open');
      // 延迟一帧确保DOM更新后再开始动画
      requestAnimationFrame(() => {
        setIsAnimating(false);
      });
    } else {
      setIsAnimating(true);
      // 延迟关闭，让动画完成
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsAnimating(false);
        document.body.classList.remove('mobile-menu-open');
      }, 300);
    }
  };

  const closeMenu = () => {
    setIsAnimating(true);
    // 延迟关闭，让动画完成
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsAnimating(false);
      document.body.classList.remove('mobile-menu-open');
    }, 300);
  };

  // 检查当前路径是否为 /designs/slug
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesignSlugPage(window.location.pathname.startsWith('/designs/') && window.location.pathname !== '/designs');
    }
  }, []);

  // 检查初始登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isAuthenticated();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        // 如果已登录，获取用户信息
        fetchUserInfo();
      }
    };

    checkLoginStatus();
  }, [fetchUserInfo]);

  // 监听登录成功事件
  useEffect(() => {
    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
      // 重新获取用户信息
      fetchUserInfo();
    };

    eventBus.on('auth:login-success', handleLoginSuccess);

    return () => {
      eventBus.off('auth:login-success', handleLoginSuccess);
    };
  }, [fetchUserInfo]);

  // 组件卸载时清理CSS类
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  // 监听滚动状态，与导航栏同步
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
        
        setIsScrolled(window.scrollY > threshold);
      }
    };
    
    onScroll(); // 初始检查
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesignSlugPage]);

  return (
    <div className="relative">
      {/* 菜单切换按钮 */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center p-2 rounded-lg transition-colors duration-200"
        aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
      >
        {isMenuOpen ? (
          // 关闭图标
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        ) : (
          // 汉堡菜单图标
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        )}
      </button>

      {/* 下拉菜单 */}
      {isMenuOpen && (
        <>
          {/* 背景遮罩 - 点击关闭菜单 */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={closeMenu}
          />
          
          {/* 下拉菜单内容 - 占据整个视口高度 */}
          <div 
            className="fixed left-0 right-0 z-40 border-t border-white/10 transition-all duration-300 ease-out"
            style={{ 
              top: 'var(--hero-nav-height, 75px)',
              height: isAnimating ? '0' : 'calc(100vh - var(--hero-nav-height, 75px))',
              background: isScrolled 
                ? 'rgba(0, 0, 0, 0.88)' 
                : 'linear-gradient(to right, rgb(34, 34, 34), rgb(56, 57, 58), rgb(28, 28, 28))',
              backdropFilter: isScrolled 
                ? 'blur(10px) saturate(100%) brightness(100%)'
                : 'blur(80px) saturate(120%) brightness(95%)',
              WebkitBackdropFilter: isScrolled 
                ? 'blur(10px) saturate(100%) brightness(100%)'
                : 'blur(80px) saturate(120%) brightness(95%)',
              boxShadow: isScrolled 
                ? '0 1px 0 rgba(255, 255, 255, 0.08)'
                : '0 1px 0 rgba(255, 255, 255, 0.1)',
              transform: isAnimating ? 'translateY(-10px)' : 'translateY(0)',
              opacity: isAnimating ? 0 : 1,
              overflow: 'hidden'
            }}
          >
            <div 
              className="px-6 py-6 h-full flex flex-col justify-between transition-opacity duration-300 ease-out"
              style={{
                opacity: isAnimating ? 0 : 1,
                transitionDelay: isAnimating ? '0ms' : '150ms'
              }}
            >
              <div className="flex-1 overflow-y-auto">
                {/* Fashion Design 分类 */}
                <div 
                  className="mb-6 transition-opacity duration-300 ease-out"
                  style={{
                    opacity: isAnimating ? 0 : 1,
                    transitionDelay: isAnimating ? '0ms' : '200ms'
                  }}
                >
                  <h4 className="text-white text-lg font-semibold mb-3 pb-2 ">
                    Fashion Design
                  </h4>
                  <div className="space-y-2">
                    <Link
                      href="/sketch-to-image"
                      onClick={closeMenu}
                      className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      Al Sketch to Image Converter
                    </Link>
                    <Link
                      href="/outfit-generator"
                      onClick={closeMenu}
                      className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      AI outfit generator
                    </Link>
                  </div>
                </div>

                {/* Virtual Try-on 独立项 */}
                <div 
                  className="mb-6 transition-opacity duration-300 ease-out"
                  style={{
                    opacity: isAnimating ? 0 : 1,
                    transitionDelay: isAnimating ? '0ms' : '250ms'
                  }}
                >
                  <Link
                    href="/virtual-try-on"
                    onClick={closeMenu}
                    className="text-white text-lg font-semibold mb-3 pb-2"
                  >
                    Virtual Try-on
                  </Link>
                </div>

                {/* Magic Kit 分类 */}
                <div 
                  className="mb-6 transition-opacity duration-300 ease-out"
                  style={{
                    opacity: isAnimating ? 0 : 1,
                    transitionDelay: isAnimating ? '0ms' : '300ms'
                  }}
                >
                  <h4 className="text-white text-lg font-semibold mb-3 pb-2">
                    Magic Kit
                  </h4>
                  <div className="space-y-2">
                    <Link
                      href="/image-background-remover"
                      onClick={closeMenu}
                      className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      Image Background Remover
                    </Link>
                    <Link
                      href="/image-background-changer"
                      onClick={closeMenu}
                      className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      Image Background Changer
                    </Link>
                    <Link
                      href="/image-enhancer"
                      onClick={closeMenu}
                      className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      Image Enhancer
                    </Link>
                    <Link
                      href="/image-changer"
                      onClick={closeMenu}
                      className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      AI Image Changer
                    </Link>
                    <Link
                      href="/image-color-changer"
                      onClick={closeMenu}
                      className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      Image Color Changer
                    </Link>
                  </div>
                </div>

                {/* Fashion Agent 分类 */}
                {/* <div 
                  className="mb-6 transition-opacity duration-300 ease-out"
                  style={{
                    opacity: isAnimating ? 0 : 1,
                    transitionDelay: isAnimating ? '0ms' : '350ms'
                  }}
                >
                  <Link
                    href="/fashion-agent"
                    onClick={closeMenu}
                    className="block text-white text-lg font-semibold mb-3 pb-2 hover:text-white/80 transition-colors duration-200"
                  >
                    Fashion Agent
                  </Link>
                </div> */}

                {/* Design Ideas 分类 */}
                <div 
                  className="mb-6 transition-opacity duration-300 ease-out"
                  style={{
                    opacity: isAnimating ? 0 : 1,
                    transitionDelay: isAnimating ? '0ms' : '400ms'
                  }}
                >
                  <Link
                    href="/designs"
                    onClick={closeMenu}
                    className="block text-white text-lg font-semibold mb-3 pb-2 hover:text-white/80 transition-colors duration-200"
                  >
                    Design Ideas
                  </Link>
                </div>

                {/* Pricing 分类 */}
                {/* <div className="mb-6">
                  <h3 className="text-white text-lg font-semibold mb-3 pb-2 border-b border-gray-400/30">
                    Pricing
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/pricing"
                      onClick={closeMenu}
                      className="block text-white/80 hover:text-white text-base transition-colors duration-200"
                    >
                      View Plans
                    </Link>
                  </div>
                </div> */}
              </div>
              
              {/* 底部登录/用户信息 - 固定在底部 */}
              <div 
                className="pt-4 mt-auto transition-opacity duration-300 ease-out"
                style={{
                  opacity: isAnimating ? 0 : 1,
                  transitionDelay: isAnimating ? '0ms' : '500ms'
                }}
              >
                {isLoggedIn ? (
                  // 已登录：显示用户信息，点击可跳转
                  <div 
                    onClick={() => {
                      closeMenu();
                      // 跳转到功能页面
                      if (typeof window !== 'undefined') {
                        window.location.href = '/fashion-design/create';
                      }
                    }}
                    className="w-full bg-white/10 text-white py-4 px-6 rounded-lg cursor-pointer hover:bg-white/20 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {headPic ? (
                        <img
                          src={headPic}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {username?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm">
                          {username || email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-xs text-white/70">
                          Tap to enter app
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 未登录：显示登录按钮
                  <button 
                    onClick={() => {
                      closeMenu();
                      // 触发登录模态框
                      eventBus.emit('auth:login', { isOpen: true });
                    }}
                    className="w-full bg-white text-black font-semibold py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Log in / Sign up
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
