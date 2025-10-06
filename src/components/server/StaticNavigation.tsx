'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DynamicCreateButton from '../client/DynamicCreateButton';
import MobileMenuToggle from '../client/MobileMenuToggle';
import { eventBus } from '../../../utils/events';
import { isAuthenticated } from '../../../lib/api/token';
import { usePersonalInfoStore } from '../../../stores/usePersonalInfoStore';


interface StaticNavigationProps {
  currentSaasUrl?: string;
}

export default function StaticNavigation({ currentSaasUrl }: StaticNavigationProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 使用Zustand store获取用户信息
  const { username, email, headPic, fetchUserInfo } = usePersonalInfoStore();

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

  // 处理登录按钮点击
  const handleLoginClick = () => {
    eventBus.emit('auth:login', { isOpen: true });
  };

  // 处理头像点击，不再跳转，只是一个占位函数
  const handleAvatarClick = () => {
    // 用户头像点击不再跳转，保持在当前页面
    console.log('Avatar clicked - staying on current page');
  };

  // 从完整URL中提取路径部分
  const extractPathFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      // 如果URL格式不正确，返回默认路径
      return '/fashion-design/create';
    }
  };

  return (
    <>
      <nav className="hero-nav">
        {/* Desktop Navigation */}
        <div className="hidden md:contents">
          <Link href="/" className="hero-logo">
            <Image
              src="/marketing/images/logo/Creamoda.svg"
              alt="CREAMODA"
              width={140}
              height={45}
              className="logo-image logo-default"
            />
            <Image
              src="/marketing/images/logo/Creamoda.svg"
              alt="CREAMODA"
              width={140}
              height={45}
              className="logo-image logo-light"
            />
          </Link>
          
          <div className="hero-nav-links">
            {/* Design Tools 静态导航 */}
            <div className="nav-dropdown">
              <button className="nav-link tools-link" style={{ color: 'white' }}>
                Design Tools
                <svg 
                  className="dropdown-arrow"
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none"
                  style={{ color: 'white' }}
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Fashion Agent 静态导航 - 直接跳转 */}
            {/* <Link href="/fashion-agent" className="nav-link" style={{ color: 'white' }}>
              Fashion Agent
            </Link> */}

            {/* Design Ideas 静态导航 */}
            <Link href="/designs" className="nav-link" style={{ color: 'white' }}>
              Design Ideas
            </Link>

            {/* Pricing 静态导航 - 直接跳转 */}
            {/* <Link href="/pricing" className="nav-link" style={{ color: 'white' }}>
              Pricing
            </Link> */}
          </div>
          
          {/* 根据登录状态和传入URL显示不同的UI */}
          {isLoggedIn ? (
            // 已登录：显示用户头像和 Get started 按钮
            <div className="flex items-center gap-3">
              <div 
                onClick={handleAvatarClick}
                className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                {headPic ? (
                  <Image
                    src={headPic}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {username?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-white text-sm font-medium hidden sm:block">
                  {username || email?.split('@')[0] || 'User'}
                </span>
              </div>
              <Link 
                href={currentSaasUrl ? extractPathFromUrl(currentSaasUrl) : '/fashion-design/create'}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                Get started
              </Link>
            </div>
          ) : (
            // 未登录：根据是否有传入URL显示不同按钮
            currentSaasUrl ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-md hover:bg-white/30 transition-all duration-200"
                >
                  Log in / Sign up
                </button>
                <Link 
                  href={currentSaasUrl ? extractPathFromUrl(currentSaasUrl) : '/fashion-design/create'}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  Get started
                </Link>
              </div>
            ) : (
              <DynamicCreateButton />
            )
          )}
        </div>

        {/* Mobile Navigation */}

        <div className="md:hidden flex items-center justify-between w-full px-4">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/marketing/images/logo/Creamoda.svg"
              alt="CHIMERI AI"
              width={50}
              height={16}
              className="h-4 w-auto"
            />
          </Link>
          
          {/* Mobile Menu Toggle */}
          <MobileMenuToggle />
        </div>
      </nav>

      {/* Static Mobile Menu Content for SEO */}
      <div className="md:hidden hidden">
        <div className="mobile-menu-content">
          <h3>Design Tools</h3>
          <Link href="#">AI Sketch to Image Converter</Link>
          <Link href="#">AI outfit generator</Link>
          <Link href="#">Virtual Try-on</Link>
          <Link href="#">Image Background Remover</Link>
          <Link href="#">Image Background Changer</Link>
          <Link href="#">Image Enhancer</Link>
          <Link href="#">AI Image Changer</Link>
          <Link href="#">Image Color Changer</Link>
          
          {/* <Link href="/fashion-agent">Fashion Agent</Link> */}
          
          <Link href="/designs">Design Ideas</Link>
          
          {/* <h3>Pricing</h3>
          <Link href="/pricing">View Plans</Link> */}
        </div>
      </div>
    </>
  );
}

