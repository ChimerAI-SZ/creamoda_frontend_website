import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authApi, saveAuthToken } from '@/app/services/api';
import google from '@/images/login/google.svg';

interface GoogleLoginButtonProps {
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export const GoogleLoginButton = ({ onError, onSuccess }: GoogleLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // 从后端获取 Google 授权 URL
      const googleAuthUrl = await authApi.getGoogleAuthUrl();
      console.log('Opening Google login with URL:', googleAuthUrl);

      // 打开新窗口进行 Google 登录
      const googleLoginWindow = window.open(googleAuthUrl, 'Google Login', 'width=500,height=600,left=0,top=0');

      if (!googleLoginWindow) {
        throw new Error('Failed to open Google login window. Please check your popup blocker settings.');
      }

      // 监听消息，接收 Google 登录成功后的消息
      const messageHandler = async (event: MessageEvent) => {
        // 确保消息来源是可信的
        if (event.origin !== window.location.origin) return;

        if (event.data && event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
          // 移除事件监听器，避免内存泄漏
          window.removeEventListener('message', messageHandler);

          // 关闭 Google 登录窗口
          if (googleLoginWindow) googleLoginWindow.close();

          // 登录成功处理
          console.log('Google login successful');

          // 如果后端已经在回调中处理了登录并设置了 cookie，
          // 这里可能不需要额外的 API 调用，直接调用成功回调
          if (onSuccess) onSuccess();
          setIsLoading(false);
        } else if (event.data && event.data.type === 'GOOGLE_LOGIN_ERROR') {
          // 移除事件监听器
          window.removeEventListener('message', messageHandler);

          // 处理错误
          const errorMsg = event.data.error || 'Google login was cancelled or failed';
          console.error('Google login error:', errorMsg);
          if (onError) onError(errorMsg);
          setIsLoading(false);
        }
      };

      window.addEventListener('message', messageHandler);

      // 设置超时，以防用户不完成登录流程
      setTimeout(() => {
        // 检查窗口是否仍然打开
        if (googleLoginWindow && !googleLoginWindow.closed) {
          // 移除事件监听器
          window.removeEventListener('message', messageHandler);
          setIsLoading(false);
          if (onError) onError('Login timeout. Please try again.');
        }
      }, 120000); // 2分钟超时
    } catch (error) {
      console.error('Google login error:', error);
      if (error instanceof Error) {
        // 显示更详细的错误信息
        const errorMessage = `Google login failed: ${error.message}`;
        console.error(errorMessage);
        if (onError) onError(errorMessage);
      } else {
        if (onError) onError('Failed to initiate Google login');
      }
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="h-[52px] w-full py-[10px] px-4 flex items-center justify-center gap-[6px] rounded-[4px] border border-[rgba(249,121,23,0.3)] bg-white hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-[#F97917] rounded-full animate-spin" />
      ) : (
        <Image src={google.src} alt="Google Logo" width={20} height={20} className="cursor-pointer" />
      )}
      <span className="text-sm font-medium text-[#121316] font-inter">
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </span>
    </button>
  );
};
