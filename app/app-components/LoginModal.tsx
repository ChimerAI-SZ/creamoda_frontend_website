'use client';

import { useState } from 'react';
import Image from 'next/image';
import x from '@/images/login/x.svg';
import { LoginForm } from './Login/LoginForm';
import { SignUpForm } from './Login/SignUpForm';
import { EmailVerification } from './Login/EmailVerification';
import { GoogleLoginButton } from './Login/GoogleLoginButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 定义模态框可能的视图状态
type ModalView = 'login' | 'signup' | 'email-verification';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [currentView, setCurrentView] = useState<ModalView>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [googleLoginError, setGoogleLoginError] = useState('');

  if (!isOpen) return null;

  const handleToggleView = (view: ModalView) => {
    setCurrentView(view);
    // 清除之前的错误
    setGoogleLoginError('');
  };

  const handleSignupSuccess = (email: string) => {
    setVerificationEmail(email);
    setCurrentView('email-verification');
  };

  const handleGoogleLoginSuccess = () => {
    // 登录成功后关闭模态框
    onClose();
    // 可选：重定向到首页或仪表板
    // window.location.href = '/dashboard';
  };

  const handleGoogleLoginError = (error: string) => {
    setGoogleLoginError(error);
  };

  // 根据当前视图状态确定标题
  const getTitle = () => {
    switch (currentView) {
      case 'login':
        return 'Log In';
      case 'signup':
        return 'Sign Up';
      case 'email-verification':
        return 'Check your email';
      default:
        return 'Log In';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]"
      style={{ isolation: 'isolate' }}
    >
      <div className="bg-white rounded-xl p-6 w-[480px] flex flex-col items-start relative z-[100000]">
        <div className="w-full flex justify-center items-center relative mb-6">
          <h1 className="text-2xl font-semibold text-center text-[#121316] font-inter">{getTitle()}</h1>
          <Image
            src={x.src}
            alt="Close"
            width={24}
            height={24}
            className="absolute right-0 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {currentView === 'email-verification' ? (
          <EmailVerification email={verificationEmail} onBackToLogin={() => handleToggleView('login')} />
        ) : (
          <div className="space-y-6 w-full">
            {googleLoginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-[#E50000] text-sm font-inter">{googleLoginError}</p>
              </div>
            )}

            <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#666]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#666] font-inter text-sm font-medium leading-5">OR</span>
              </div>
            </div>

            <div className="space-y-6">
              {currentView === 'login' ? (
                <LoginForm onToggleView={() => handleToggleView('signup')} />
              ) : (
                <SignUpForm onToggleView={() => handleToggleView('login')} onSignupSuccess={handleSignupSuccess} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
