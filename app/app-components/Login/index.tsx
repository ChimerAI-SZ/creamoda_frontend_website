'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';
import { EmailVerification } from './components/EmailVerification';
import { GoogleLoginButton } from './components/GoogleLoginButton';
import { VerificationSuccess } from './components/VerificationSuccess';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';
import { AuthService } from '@/services/authService';
import { usePendingUploadStore } from '@/stores/usePendingUploadStore';
import { uploadImage } from '@/lib/api/common';
import { useAlertStore } from '@/stores/useAlertStore';
import { useRouter } from 'next/navigation';

import { eventBus } from '@/utils/events';

// Define possible modal view states
type ModalView = 'login' | 'signup' | 'email-verification' | 'verification-success';

export function LoginModal() {
  const [currentView, setCurrentView] = useState<ModalView>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [googleLoginError, setGoogleLoginError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  
  const router = useRouter();
  const { showAlert } = useAlertStore();
  const { getPendingUpload, clearPendingUpload } = usePendingUploadStore();

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

  // 不要在页面加载时自动弹出登录弹窗，只有点击按钮时才弹出
  // useEffect(() => {
  //   const checkLoginStatus = () => {
  //     const token = localStorage.getItem('auth_token') || '';
  //     // 用户已登录，关闭模态框
  //     setModalVisible(!token);
  //   };
  //   // 初始检查
  //   checkLoginStatus();
  // }, []);

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
    // 检查是否有待上传的图片
    const pendingUpload = getPendingUpload();
    
    if (pendingUpload) {
      // 关闭登录窗口
      handleCloseModal();
      
      try {
        // 上传图片
        const uploadedUrl = await uploadImage(pendingUpload.file);
        
        if (uploadedUrl) {
          // 从 saasUrl 中提取路径，避免跨域 localStorage 问题
          let targetPath = pendingUpload.saasUrl;
          try {
            const url = new URL(pendingUpload.saasUrl);
            targetPath = url.pathname;
          } catch {
            // 如果 saasUrl 已经是路径，直接使用
            targetPath = pendingUpload.saasUrl;
          }
          
          // 构建URL参数
          const params = new URLSearchParams();
          
          if (pendingUpload.tab) {
            params.append('tab', pendingUpload.tab);
          }
          
          if (pendingUpload.variationType) {
            params.append('variationType', pendingUpload.variationType);
          }
          
          params.append('imageUrl', uploadedUrl);
          
          const targetUrl = `${targetPath}?${params.toString()}`;
          
          console.log('[LoginModal] Pending upload - Navigating to:', targetUrl);
          console.log('[LoginModal] Current origin:', window.location.origin);
          
          // 清除待上传的图片
          clearPendingUpload();
          
          // 跳转到目标页面（相对路径，保持同域）
          router.push(targetUrl);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        showAlert({
          type: 'error',
          content: 'Image upload failed, please try again'
        });
        clearPendingUpload();
      }
    } else {
      // 没有待上传的图片，执行常规登录成功逻辑
      await AuthService.handlePostLoginActions({
        closeModal: handleCloseModal,
        skipRedirect: true,  // 停留在当前页面，不跳转到 /fashion-design/create
        onError: error => {
          console.error('Login post-actions failed:', error);
          // 可以在这里添加特定的错误处理逻辑
        },
        onSuccess: () => {
          console.log('Login post-actions completed successfully');
          // 可以在这里添加成功后的特定逻辑
        }
      });
    }
  };

  // Google 登录成功处理 - 不跳转到 /fashion-design/create
  const handleGoogleLoginSuccess = async () => {
    // 检查是否有待上传的图片
    const pendingUpload = getPendingUpload();
    
    if (pendingUpload) {
      // 关闭登录窗口
      handleCloseModal();
      
      try {
        // 上传图片
        const uploadedUrl = await uploadImage(pendingUpload.file);
        
        if (uploadedUrl) {
          // 从 saasUrl 中提取路径，避免跨域 localStorage 问题
          let targetPath = pendingUpload.saasUrl;
          try {
            const url = new URL(pendingUpload.saasUrl);
            targetPath = url.pathname;
          } catch {
            // 如果 saasUrl 已经是路径，直接使用
            targetPath = pendingUpload.saasUrl;
          }
          
          // 构建URL参数
          const params = new URLSearchParams();
          
          if (pendingUpload.tab) {
            params.append('tab', pendingUpload.tab);
          }
          
          if (pendingUpload.variationType) {
            params.append('variationType', pendingUpload.variationType);
          }
          
          params.append('imageUrl', uploadedUrl);
          
          const targetUrl = `${targetPath}?${params.toString()}`;
          
          console.log('[LoginModal] Google login pending upload - Navigating to:', targetUrl);
          console.log('[LoginModal] Current origin:', window.location.origin);
          
          // 清除待上传的图片
          clearPendingUpload();
          
          // 跳转到目标页面（相对路径，保持同域）
          router.push(targetUrl);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        showAlert({
          type: 'error',
          content: 'Image upload failed, please try again'
        });
        clearPendingUpload();
      }
    } else {
      // 没有待上传的图片，执行常规登录成功逻辑
      await AuthService.handlePostLoginActions({
        closeModal: handleCloseModal,
        skipRedirect: true,  // 跳过重定向，停留在当前页面
        onError: error => {
          console.error('Google login post-actions failed:', error);
        },
        onSuccess: () => {
          console.log('Google login post-actions completed successfully');
        }
      });
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] overflow-y-auto"
        style={{ isolation: 'isolate' }}
      >
        <div className="bg-white rounded-[16px] w-[936px] h-[714px] flex items-start justify-center relative z-10">
          <div
            className="absolute top-0 right-[-95px] w-[50px] h-[50px] flex items-center justify-center bg-white rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleCloseModal}
          >
            <X className="w-6 h-6 text-gray-700" />
          </div>
          <div className="w-[504px] h-[714px] flex-1 relative overflow-hidden rounded-tl-[16px] rounded-bl-[16px]">
            <Image
              src="/images/login/bg_black.png"
              alt="背景图片"
              layout="fill" // 填充整个父容器
              objectFit="cover" // 保持比例填充容器，可能会裁剪
              objectPosition="right top" // 对齐右上角
              className="absolute" // 确保绝对定位
              unoptimized
            />
            <Image
              src="/images/logo_primary.svg"
              alt="logo"
              width={278}
              height={55}
              className="absolute left-1/2 bottom-[98px] -translate-x-1/2"
            />
          </div>

          <div className="h-full flex-1 p-6 flex flex-col justify-start gap-8">
            {currentView !== 'email-verification' && currentView !== 'verification-success' && (
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-[#0A1532] font-inter">{getTitle()}</h1>
                {getSubtitle() && (
                  <p className="text-[rgba(10,21,50,.60)] text-base font-normal font-inter ">{getSubtitle()}</p>
                )}
              </div>
            )}

            {currentView === 'email-verification' ? (
              <div className="w-full">
                <div className="w-full flex justify-between items-center relative mb-2">
                  <h1 className="text-2xl font-semibold text-[#121316] font-inter">{getTitle()}</h1>
                  <X className="w-6 h-6" />
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
              <>
                <div className="space-y-4 w-full">
                  {googleLoginError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-error text-sm font-inter">{googleLoginError}</p>
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
                      <span className="px-2 bg-white text-[rgba(10,21,50,.40)] text-sm font-normal font-inter">OR</span>
                    </div>
                  </div>

                  <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
                </div>
                <div className="text-center">
                  {currentView === 'login' ? (
                    <p className="text-sm text-gray-600 text-inter font-normal">
                      <span>Don&apos;t have an account? </span>
                      <span
                        className="text-primary font-bold text-sm cursor-pointer"
                        onClick={() => handleToggleView('signup')}
                      >
                        Sign up here
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 text-inter font-normal">
                      <span>Already have an account? </span>
                      <span
                        className="text-primary font-bold text-sm cursor-pointer"
                        onClick={() => handleToggleView('login')}
                      >
                        Log in here
                      </span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
}
