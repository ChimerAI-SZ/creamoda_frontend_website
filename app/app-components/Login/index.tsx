'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import x from '@/images/login/x.svg';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';
import { EmailVerification } from './components/EmailVerification';
import { GoogleLoginButton } from './components/GoogleLoginButton';
import { VerificationSuccess } from './components/VerificationSuccess';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

import { eventBus } from '@/utils/events';

// Define possible modal view states
type ModalView = 'login' | 'signup' | 'email-verification' | 'verification-success';

export function LoginModal() {
  const [currentView, setCurrentView] = useState<ModalView>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [googleLoginError, setGoogleLoginError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (modalVisible) {
      setCurrentView('login');
      setGoogleLoginError('');
      setVerificationEmail('');
    }
  }, [modalVisible]);

  // 监听事件
  useEffect(() => {
    const handler = (data: { isOpen?: boolean | undefined }) => {
      if (data.isOpen !== undefined) {
        setModalVisible(data.isOpen);
      }
    };
    eventBus.on('auth:login', handler);

    return () => {
      eventBus.off('auth:login', handler);
    };
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('auth_token') || '';
      if (token) {
        // 用户已登录，关闭模态框
        setModalVisible(false);
      }
    };
    // 初始检查
    checkLoginStatus();
  }, []);

  const handleToggleView = (view: ModalView) => {
    setCurrentView(view);
    // Clear previous errors
    setGoogleLoginError('');
  };

  // 关闭模态框并调用父组件的关闭方法
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSignupSuccess = (email: string) => {
    setVerificationEmail(email);
    setCurrentView('email-verification');
  };

  const handleVerificationComplete = () => {
    // 验证成功时切换到成功视图
    setCurrentView('verification-success');
  };

  const handleLoginSuccess = async () => {
    try {
      // 先关闭模态框，提高用户体验
      handleCloseModal();

      eventBus.emit('imageList:generate-list', { data: {} });
      // 然后再获取用户信息
      await usePersonalInfoStore.getState().fetchUserInfo();

      // Optional: redirect to homepage or dashboard
      // window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error during login process:', error);
      // 错误处理 - 模态框已经关闭，可以考虑添加一个toast通知
    }
  };

  const handleGoogleLoginError = (error: string) => {
    setGoogleLoginError(error);
  };

  // Determine title based on current view
  const getTitle = () => {
    switch (currentView) {
      case 'login':
        return 'Login';
      case 'signup':
        return 'Create an account';
      case 'email-verification':
        return 'Verify your email';
      case 'verification-success':
        return 'Email Verified';
      default:
        return 'Login';
    }
  };

  // Get subtitle based on current view
  const getSubtitle = () => {
    switch (currentView) {
      case 'login':
        return 'Enter your credentials to access your account';
      case 'signup':
        return 'Enter your information to create an account';
      case 'email-verification':
      case 'verification-success':
        return '';
      default:
        return '';
    }
  };

  return (
    modalVisible && (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] overflow-y-auto py-12"
        style={{ isolation: 'isolate' }}
      >
        <div className="bg-white rounded-lg p-6 w-[480px] flex flex-col items-start relative z-[100000] my-auto mx-auto mt-8 md:mt-8 lg:mt-16 xl:mt-24">
          {currentView !== 'email-verification' && currentView !== 'verification-success' && (
            <>
              <div className="w-full flex justify-between items-center relative mb-2">
                <h1 className="text-2xl font-semibold text-[#121316] font-inter">{getTitle()}</h1>
                <Image
                  src={x.src}
                  alt="Close"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>
              {getSubtitle() && (
                <p className="text-[#999] text-sm font-medium font-inter leading-[20px] mb-6">{getSubtitle()}</p>
              )}
            </>
          )}

          {currentView === 'email-verification' ? (
            <div className="w-full">
              <div className="w-full flex justify-between items-center relative mb-2">
                <h1 className="text-2xl font-semibold text-[#121316] font-inter">{getTitle()}</h1>
                <Image
                  src={x.src}
                  alt="Close"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>
              {getSubtitle() && (
                <p className="text-[#999] text-sm font-medium font-inter leading-[20px] mb-6">{getSubtitle()}</p>
              )}
              <EmailVerification
                email={verificationEmail}
                onBackToLogin={() => handleToggleView('login')}
                onVerificationComplete={handleVerificationComplete}
                onClose={handleCloseModal}
              />
            </div>
          ) : currentView === 'verification-success' ? (
            <div className="w-full">
              <VerificationSuccess onBackToLogin={() => handleToggleView('login')} />
            </div>
          ) : (
            <div className="space-y-6 w-full">
              {googleLoginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-[#E50000] text-sm font-inter">{googleLoginError}</p>
                </div>
              )}

              {currentView === 'login' ? (
                <LoginForm onToggleView={() => handleToggleView('signup')} onSuccess={handleLoginSuccess} />
              ) : (
                <SignUpForm onToggleView={() => handleToggleView('login')} onSignupSuccess={handleSignupSuccess} />
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-inter">OR CONTINUE WITH</span>
                </div>
              </div>

              <GoogleLoginButton onSuccess={handleLoginSuccess} onError={handleGoogleLoginError} />

              <div className="text-center">
                {currentView === 'login' ? (
                  <p className="text-sm text-gray-600 mt-[40px]">
                    Don&apos;t have an account?{' '}
                    <span
                      className="text-black font-medium cursor-pointer border-b border-black"
                      onClick={() => handleToggleView('signup')}
                    >
                      Sign up here
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mt-[40px]">
                    Already have an account?{' '}
                    <span
                      className="text-black font-medium cursor-pointer border-b border-black"
                      onClick={() => handleToggleView('login')}
                    >
                      Log in here
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
