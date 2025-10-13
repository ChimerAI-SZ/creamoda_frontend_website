'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAlertStore } from '@/stores/useAlertStore';
import { eventBus } from '@/utils/events';

interface UploadUrlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  saasUrl: string;
  tab?: string;
  variationType?: string;
}

export default function UploadUrlDialog({ isOpen, onClose, saasUrl, tab, variationType }: UploadUrlDialogProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlertStore();

  // 检查用户是否已登录
  const checkLoginStatus = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return !!token;
    }
    return false;
  };

  // 初始化登录状态并监听登录事件
  useEffect(() => {
    // 初始检查登录状态
    setIsLoggedIn(checkLoginStatus());

    // 监听登录成功事件
    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
    };

    // 监听登出事件
    const handleLogout = () => {
      setIsLoggedIn(false);
    };

    eventBus.on('auth:login-success', handleLoginSuccess);
    eventBus.on('auth:logout', handleLogout);

    return () => {
      eventBus.off('auth:login-success', handleLoginSuccess);
      eventBus.off('auth:logout', handleLogout);
    };
  }, []);

  // 获取正确的公开可访问域名
  const getPublicDomain = (): string => {
    if (typeof window === 'undefined') {
      return 'https://creamoda.ai';
    }

    const hostname = window.location.hostname;
    
    // 本地开发环境 - 使用测试域名（后端可以访问）
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'https://test-official.creamoda.ai';
    }
    
    // 测试环境
    if (hostname.includes('test-official.creamoda.ai')) {
      return 'https://test-official.creamoda.ai';
    }
    
    if (hostname.includes('test-mvp.creamoda.ai')) {
      return 'https://test-mvp.creamoda.ai';
    }
    
    // Vercel 预览环境 - 使用生产域名
    if (hostname.includes('vercel.app')) {
      return 'https://creamoda.ai';
    }
    
    // 生产环境
    if (hostname.includes('creamoda.ai') && !hostname.includes('test')) {
      return 'https://creamoda.ai';
    }
    
    // 默认使用生产域名
    return 'https://creamoda.ai';
  };

  const handleCancel = useCallback(() => {
    setImageUrl('');
    onClose();
  }, [onClose]);

  const handleConfirm = () => {
    if (!imageUrl.trim()) return;

    // 检查用户是否登录
    if (!isLoggedIn) {
      // 先关闭对话框
      handleCancel();
      
      // 显示提示
      showAlert({
        type: 'warning',
        content: 'Please login first to upload images'
      });
      
      // 延迟弹出登录窗口
      setTimeout(() => {
        eventBus.emit('auth:login', { isOpen: true });
      }, 800);
      
      return;
    }

    // 构建带参数的 URL
    const params = new URLSearchParams();
    
    if (tab) {
      params.append('tab', tab);
    }
    
    if (variationType) {
      params.append('variationType', variationType);
    }
    
    // 处理图片 URL，如果是相对路径则转换为完整 URL
    let fullImageUrl = imageUrl.trim();
    
    // 如果是相对路径（以 / 开头），转换为完整 URL
    if (fullImageUrl.startsWith('/')) {
      const publicDomain = getPublicDomain();
      fullImageUrl = `${publicDomain}${fullImageUrl}`;
    }
    
    params.append('imageUrl', fullImageUrl);
    
    const targetUrl = `${saasUrl}?${params.toString()}`;
    router.push(targetUrl);
  };

  // 监听导航栏下拉菜单的打开，如果下拉菜单打开则关闭弹窗
  useEffect(() => {
    if (!isOpen) return;

    const checkDropdownActive = () => {
      if (document.body.classList.contains('dropdown-active')) {
        handleCancel();
      }
    };

    // 使用 MutationObserver 监听 body 的 class 变化
    const observer = new MutationObserver(checkDropdownActive);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
    };
  }, [isOpen, handleCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleCancel}
      />
      
      {/* 对话框 */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="w-[480px] p-6 bg-white rounded-xl shadow-[0px_4px_48px_0px_rgba(0,0,0,0.08)] inline-flex flex-col justify-start items-end gap-4 overflow-hidden">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-left text-[#111827] text-lg font-semibold font-['Inter'] leading-7">Upload Image</div>
            <div className="self-stretch text-left text-[#6B7280] text-xs font-normal font-['Inter']">Type or paste an image URL to upload image and start editing.</div>
          </div>
          
          <div className="self-stretch p-3 bg-[#F9FAFB] rounded-md outline outline-1 outline-offset-[-0.50px] outline-[#E5E7EB] inline-flex justify-start items-center gap-3 overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
              <Image
                src="/images/upload.svg"
                alt="Upload icon"
                width={24}
                height={24}
              />
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Type or paste image URL"
              className="flex-1 bg-transparent outline-none text-sm font-normal font-['Inter'] leading-tight text-[#111827] placeholder:text-[#D1D5DB]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
            />
          </div>
          
          <div className="inline-flex justify-end items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-2 bg-[#F9FAFB] rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] outline-[#E5E7EB] flex justify-center items-center gap-2 hover:bg-[#F3F4F6] transition-colors"
            >
              <div className="justify-start text-[#374151] text-sm font-semibold font-['Inter'] leading-tight">Cancel</div>
            </button>
            <button
              onClick={handleConfirm}
              disabled={!imageUrl.trim()}
              className="h-9 px-3 py-2 bg-violet-600 rounded-lg flex justify-end items-center gap-2 overflow-hidden hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="justify-start text-white text-sm font-semibold font-['Inter'] leading-tight">Confirm</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

