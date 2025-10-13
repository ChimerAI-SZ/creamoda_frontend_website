'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { uploadImage } from '@/lib/api/common';
import { useAlertStore } from '@/stores/useAlertStore';
import { usePendingUploadStore } from '@/stores/usePendingUploadStore';
import { eventBus } from '@/utils/events';

interface DragDropOverlayProps {
  /**
   * 是否在当前页面启用拖拽上传
   * 默认为 true
   */
  enabled?: boolean;
}

export default function DragDropOverlay({ enabled = true }: DragDropOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { showAlert } = useAlertStore();
  const { setPendingUpload } = usePendingUploadStore();
  
  // 用于跟踪拖拽进入的元素数量，避免在子元素间移动时频繁切换状态
  const dragCounterRef = useRef(0);
  
  // 检查当前是否在落地页（marketing pages）
  const isMarketingPage = useCallback(() => {
    // 首页不显示拖拽上传
    if (pathname === '/') {
      return false;
    }
    
    // SaaS 页面不显示拖拽上传
    if (pathname.includes('/fashion-design/create') || 
        pathname.includes('/magic-kit/create') ||
        pathname.includes('/virtual-try-on/create')) {
      return false;
    }
    
    return true;
  }, [pathname]);

  // 检查文件是否为图片
  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  // 根据当前路由获取跳转参数
  const getRouteParams = () => {
    let targetUrl = '/fashion-design/create';
    let tab: string | undefined;
    let variationType: string | undefined;

    // Magic Kit 相关页面
    if (pathname.includes('image-background-remover')) {
      targetUrl = '/magic-kit/create';
      variationType = '3'; // Remove Background
    } else if (pathname.includes('image-background-changer')) {
      targetUrl = '/magic-kit/create';
      variationType = '2'; // Change Background
    } else if (pathname.includes('image-enhancer')) {
      targetUrl = '/magic-kit/create';
      variationType = '5'; // Upscale
    } else if (pathname.includes('image-changer')) {
      targetUrl = '/magic-kit/create';
      variationType = '4'; // Partial Modification
    } else if (pathname.includes('image-color-changer')) {
      targetUrl = '/magic-kit/create';
      variationType = '1'; // Change Color
    }
    // Fashion Design 相关页面
    else if (pathname.includes('sketch-to-image')) {
      targetUrl = '/fashion-design/create';
      tab = 'image-to-image';
      variationType = '4'; // Sketch to Design
    } else if (pathname.includes('outfit-generator')) {
      targetUrl = '/fashion-design/create';
      tab = 'text-to-image';
    }
    // Virtual Try-On 相关页面
    else if (pathname.includes('virtual-try-on')) {
      targetUrl = '/virtual-try-on/create';
    }

    return { targetUrl, tab, variationType };
  };

  // 检查用户是否已登录
  const isUserLoggedIn = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return !!token;
    }
    return false;
  };

  // 上传图片并跳转到 SaaS 页面
  const handleImageUpload = async (file: File) => {
    if (!isImageFile(file)) {
      showAlert({
        type: 'error',
        content: 'Please upload an image file'
      });
      return;
    }

    // 获取跳转参数
    const { targetUrl, tab, variationType } = getRouteParams();

    // 检查用户是否登录
    if (!isUserLoggedIn()) {
      // 保存待上传的图片信息
      setPendingUpload({
        file,
        saasUrl: targetUrl,
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
      
      // 重置拖拽状态
      setIsDragging(false);
      dragCounterRef.current = 0;
      return;
    }

    setIsUploading(true);

    try {
      // 上传图片
      const uploadedUrl = await uploadImage(file);

      if (uploadedUrl) {
        // 构建URL参数
        const params = new URLSearchParams();
        
        if (tab) {
          params.append('tab', tab);
        }
        
        if (variationType) {
          params.append('variationType', variationType);
        }
        
        params.append('imageUrl', uploadedUrl);
        
        const finalUrl = `${targetUrl}?${params.toString()}`;
        router.push(finalUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      showAlert({
        type: 'error',
        content: 'Image upload failed, please try again'
      });
    } finally {
      setIsUploading(false);
      setIsDragging(false);
      dragCounterRef.current = 0;
    }
  };

  // 处理拖拽进入
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled || !isMarketingPage()) return;
    
    dragCounterRef.current += 1;
    
    // 检查是否包含文件（优先检查图片类型）
    if (e.dataTransfer?.types) {
      const hasFiles = e.dataTransfer.types.includes('Files');
      const hasImages = Array.from(e.dataTransfer.items || []).some(
        item => item.type.startsWith('image/')
      );
      
      if (hasFiles || hasImages) {
        setIsDragging(true);
      }
    }
  }, [enabled, isMarketingPage]);

  // 处理拖拽经过
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled || !isMarketingPage()) return;
    
    // 设置拖拽效果
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, [enabled, isMarketingPage]);

  // 处理拖拽离开
  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled || !isMarketingPage()) return;
    
    dragCounterRef.current -= 1;
    
    // 只有当所有拖拽都离开时才隐藏覆盖层
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, [enabled, isMarketingPage]);

  // 处理放下文件
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled || !isMarketingPage()) return;
    
    dragCounterRef.current = 0;
    setIsDragging(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleImageUpload(file);
    }
  }, [enabled, isMarketingPage]);

  // 设置全局拖拽事件监听
  useEffect(() => {
    if (!enabled || !isMarketingPage()) return;

    const handleDragEnterGlobal = (e: DragEvent) => handleDragEnter(e);
    const handleDragOverGlobal = (e: DragEvent) => handleDragOver(e);
    const handleDragLeaveGlobal = (e: DragEvent) => handleDragLeave(e);
    const handleDropGlobal = (e: DragEvent) => handleDrop(e);

    document.addEventListener('dragenter', handleDragEnterGlobal);
    document.addEventListener('dragover', handleDragOverGlobal);
    document.addEventListener('dragleave', handleDragLeaveGlobal);
    document.addEventListener('drop', handleDropGlobal);

    return () => {
      document.removeEventListener('dragenter', handleDragEnterGlobal);
      document.removeEventListener('dragover', handleDragOverGlobal);
      document.removeEventListener('dragleave', handleDragLeaveGlobal);
      document.removeEventListener('drop', handleDropGlobal);
    };
  }, [enabled, isMarketingPage, handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

  // 如果不在落地页或未启用，则不渲染
  if (!enabled || !isMarketingPage()) {
    return null;
  }

  // 如果没有拖拽，则不显示覆盖层
  if (!isDragging && !isUploading) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)', // 黑色半透明蒙版
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      {/* 四角边框装饰 - 使用圆角矩形 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 左上角 */}
        <div
          className="absolute left-12 top-12"
          style={{
            width: '120px',
            height: '120px',
            borderLeft: '6px solid white',
            borderTop: '6px solid white',
            borderTopLeftRadius: '32px'
          }}
        />
        {/* 右上角 */}
        <div
          className="absolute right-12 top-12"
          style={{
            width: '120px',
            height: '120px',
            borderRight: '6px solid white',
            borderTop: '6px solid white',
            borderTopRightRadius: '32px'
          }}
        />
        {/* 左下角 */}
        <div
          className="absolute left-12 bottom-12"
          style={{
            width: '120px',
            height: '120px',
            borderLeft: '6px solid white',
            borderBottom: '6px solid white',
            borderBottomLeftRadius: '32px'
          }}
        />
        {/* 右下角 */}
        <div
          className="absolute right-12 bottom-12"
          style={{
            width: '120px',
            height: '120px',
            borderRight: '6px solid white',
            borderBottom: '6px solid white',
            borderBottomRightRadius: '32px'
          }}
        />
      </div>

      {/* 中心内容 */}
      <div className="flex flex-col items-center justify-center gap-10 z-10 px-8">
        {/* 文字提示 */}
        <div className="text-center max-w-2xl">
          {isUploading ? (
            <>
              <h2 className="text-white text-5xl font-bold mb-4 drop-shadow-lg">
                Uploading...
              </h2>
              <p className="text-white/90 text-xl">
                Please wait while we process your image
              </p>
            </>
          ) : (
            <>
              <h2 className="text-white text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
                Drag and drop images from anywhere
              </h2>
              <p className="text-white/90 text-xl">
                Release to upload and start editing
              </p>
            </>
          )}
        </div>

        {/* 加载动画 */}
        {isUploading && (
          <div className="flex items-center justify-center mt-4">
            <div 
              className="w-16 h-16 rounded-full animate-spin"
              style={{
                border: '5px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white'
              }}
            />
          </div>
        )}
      </div>

      {/* 响应式样式 */}
      <style jsx>{`
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem !important;
          }
          p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

