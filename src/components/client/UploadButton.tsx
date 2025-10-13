'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import UploadUrlDialog from './UploadUrlDialog';
import { uploadImage } from '@/lib/api/common';
import { useAlertStore } from '@/stores/useAlertStore';
import { usePendingUploadStore } from '@/stores/usePendingUploadStore';
import { eventBus } from '@/utils/events';

interface UploadButtonProps {
  uploadText: string;
  saasUrl: string;
  tab?: string;
  variationType?: string;
}

export default function UploadButton({ uploadText, saasUrl, tab, variationType }: UploadButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showAlert } = useAlertStore();
  const { setPendingUpload } = usePendingUploadStore();

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

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showAlert({
        type: 'error',
        content: 'Please upload an image file'
      });
      return;
    }

    // 检查用户是否登录（使用状态而不是函数调用）
    if (!isLoggedIn) {
      // 保存待上传的图片信息
      setPendingUpload({
        file,
        saasUrl,
        tab,
        variationType
      });
      
      // 先显示友好提示
      showAlert({
        type: 'warning',
        content: 'Please login first to upload images'
      });
      
      // 延迟弹出登录窗口，让用户有时间看到提示
      setTimeout(() => {
        eventBus.emit('auth:login', { isOpen: true });
      }, 800);
      
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsUploading(true);

    try {
      // 上传图片
      const uploadedUrl = await uploadImage(file);

      if (uploadedUrl) {
        // 构建跳转URL
        // 确保使用相对路径，避免跨域 localStorage 问题
        let targetPath = saasUrl;
        try {
          const url = new URL(saasUrl);
          targetPath = url.pathname;
        } catch {
          // 如果 saasUrl 已经是路径，直接使用
          targetPath = saasUrl;
        }
        
        const params = new URLSearchParams();
        
        if (tab) {
          params.append('tab', tab);
        }
        
        if (variationType) {
          params.append('variationType', variationType);
        }
        
        params.append('imageUrl', uploadedUrl);
        
        const targetUrl = `${targetPath}?${params.toString()}`;
        
        console.log('[UploadButton] Navigating to:', targetUrl);
        console.log('[UploadButton] Current origin:', window.location.origin);
        
        router.push(targetUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      showAlert({
        type: 'error',
        content: 'Image upload failed, please try again'
      });
    } finally {
      setIsUploading(false);
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 点击按钮触发文件选择
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="w-full flex flex-col items-center gap-3">
        <button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="upload-demo-btn w-full mt-8 md:mt-[-15px]"
          style={{
            padding: '18px 32px',
            fontSize: '20px',
            fontWeight: '600',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            minWidth: '200px',
            border: 'none',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            width: '100%',
            opacity: isUploading ? 0.7 : 1
          }}
        >
          {isUploading ? (
            <>
              <div 
                className="w-7 h-7 rounded-full animate-spin"
                style={{
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: 'white'
                }}
              />
              Uploading...
            </>
          ) : (
            <>
              <Image
                src="/marketing/images/upload.svg"
                alt="Upload icon"
                width={28}
                height={28}
                className="upload-icon"
              />
              {uploadText}
            </>
          )}
        </button>
        
        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <p 
          className="text-center text-sm hidden md:block"
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            fontWeight: '400',
            margin: '0'
          }}
        >
          Or drop a image to this page,or paste{' '}
          <span
            onClick={() => setIsDialogOpen(true)}
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.8)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            URL
          </span>
        </p>
      </div>

      <UploadUrlDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        saasUrl={saasUrl}
        tab={tab}
        variationType={variationType}
      />
    </>
  );
}

