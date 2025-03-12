'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import x from '@/images/login/x.svg';
import { LoginForm } from './Login/LoginForm';
import { SignUpForm } from './Login/SignUpForm';
import { EmailVerification } from './Login/EmailVerification';
import { GoogleLoginButton } from './Login/GoogleLoginButton';
import { VerificationSuccess } from './Login/VerificationSuccess';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';
import { authApi } from '@/lib/login/api';

import { emitter } from '@/utils/events';

// Define possible modal view states
type ModalView = 'login' | 'signup' | 'email-verification' | 'verification-success';

export function LoginModal() {
  const [currentView, setCurrentView] = useState<ModalView>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [googleLoginError, setGoogleLoginError] = useState('');

  const [modalVisible, setModalVisible] = useState(() => {
    // 在客户端环境中检查 localStorage 中的 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') || '';
      // 如果有 token，则用户已登录，不显示模态框
      return token ? false : true;
    }
    return false;
  });

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
    const handler = (data: { isOpen: boolean }) => {
      setModalVisible(data.isOpen);
    };

    emitter.on('login:handleLogin', handler);

    return () => {
      emitter.off('login:handleLogin', handler);
    };
  }, []);

  // 监听 token 变化
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

    // 监听存储变化事件
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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

  const handleGoogleLoginSuccess = async () => {
    try {
      // Fetch user info after successful login using the API service
      const userData = await authApi.getUserInfo();

      // Update user info in the store
      usePersonalInfoStore.getState().updateUserInfo({
        username: userData.username || '',
        email: userData.email || '',
        status: userData.status || '',
        headPic: userData.headPic || '',
        emailVerified: userData.emailVerified || ''
      });

      // Close modal after successful login
      handleCloseModal();
      // Optional: redirect to homepage or dashboard
      // window.location.href = '/dashboard';
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Still close the modal even if fetching user info fails
      handleCloseModal();
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]"
        style={{ isolation: 'isolate' }}
      >
        <div className="bg-white rounded-lg p-6 w-[480px] flex flex-col items-start relative z-[100000]">
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
              {getSubtitle() && <p className="text-gray-500 text-sm mb-6">{getSubtitle()}</p>}
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
              {getSubtitle() && <p className="text-gray-500 text-sm mb-6">{getSubtitle()}</p>}
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
                <LoginForm onToggleView={() => handleToggleView('signup')} onSuccess={handleGoogleLoginSuccess} />
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

              <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />

              <div className="text-center mt-4">
                {currentView === 'login' ? (
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <span
                      className="text-black font-medium cursor-pointer hover:underline"
                      onClick={() => handleToggleView('signup')}
                    >
                      Sign up here
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <span
                      className="text-black font-medium cursor-pointer hover:underline"
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
