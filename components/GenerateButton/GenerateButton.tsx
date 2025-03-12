'use client';

import { useState, useEffect } from 'react';
import { LoginModal } from '@/app/app-components/LoginModal';
import Image from 'next/image';

export type GenerateButtonState = 'disabled' | 'ready' | 'generating';

interface GenerateButtonProps {
  onClick: () => void;
  state?: GenerateButtonState;
  className?: string;
  autoOpenLogin?: boolean;
}

export function GenerateButton({
  onClick,
  state = 'disabled',
  className = '',
  autoOpenLogin = true
}: GenerateButtonProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // 检查用户是否已登录
    const checkLoginStatus = () => {
      const token = localStorage.getItem('auth_token');
      const isAuthenticated = !!token;
      setIsLoggedIn(isAuthenticated);

      // 首次检查完成后，如果启用了自动登录且用户未登录，则显示登录模态框
      if (!initialCheckDone && autoOpenLogin && !isAuthenticated) {
        setShowLoginModal(true);
      }

      setInitialCheckDone(true);
    };

    // 初始检查
    checkLoginStatus();

    // 监听存储变化，以便在其他标签页登录/登出时更新状态
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [autoOpenLogin, initialCheckDone]);

  const handleClick = () => {
    if (isLoggedIn) {
      onClick();
    } else {
      setShowLoginModal(true);
    }
  };

  // Button text based on state
  const buttonText = state === 'generating' ? 'Generating...' : 'Generate';

  // Button styles based on state
  const buttonStyles = {
    disabled: 'bg-[#CECECE] text-white cursor-not-allowed',
    ready: 'bg-[#F97917] text-white hover:bg-[#E86806] cursor-pointer',
    generating: 'bg-[rgba(249,121,23,0.5)] text-white cursor-not-allowed'
  };

  return (
    <>
      <button
        type="submit"
        className={`w-full px-4 py-2.5 flex items-center justify-center gap-1.5 rounded text-sm font-medium font-inter leading-5 ${buttonStyles[state]} ${className}`}
        disabled={state === 'disabled' || state === 'generating'}
        onClick={handleClick}
      >
        <Image src="/images/operation/generate.svg" alt="Generate" width={16} height={16} />
        {buttonText}
      </button>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
