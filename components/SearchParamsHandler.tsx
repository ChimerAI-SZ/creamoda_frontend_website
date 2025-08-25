'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useExternalImageHandler } from '@/hooks/useExternalImageHandler';

interface SearchParamsHandlerProps {
  onImageUrl?: (url: string) => void;
  onVariationType?: (type: string) => void;
  onTab?: (tab: string) => void;
  showProcessingIndicator?: boolean;
}

/**
 * 通用的URL参数处理组件
 * 支持处理imageUrl、variationType、tab等参数
 * 自动检测并处理外部图片URL
 */
export function SearchParamsHandler({ 
  onImageUrl, 
  onVariationType, 
  onTab,
  showProcessingIndicator = true 
}: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();
  const { isProcessingImage, processImageUrl } = useExternalImageHandler();

  useEffect(() => {
    const handleParams = async () => {
      // 获取URL参数
      const imageUrl = searchParams.get('imageUrl');
      const variationType = searchParams.get('variationType');
      const tab = searchParams.get('tab');

      // 处理variationType参数
      if (variationType && onVariationType) {
        onVariationType(variationType);
      }

      // 处理tab参数  
      if (tab && onTab) {
        onTab(tab);
      }

      // 处理imageUrl参数
      if (imageUrl && onImageUrl) {
        const decodedUrl = decodeURIComponent(imageUrl);
        console.log('接收到图片URL:', decodedUrl);
        
        // 处理外部URL（如果需要重新上传）
        const processedUrl = await processImageUrl(decodedUrl);
        onImageUrl(processedUrl);
      }
    };

    handleParams();
  }, [searchParams, onImageUrl, onVariationType, onTab, processImageUrl]);

  // 显示处理状态
  if (isProcessingImage && showProcessingIndicator) {
    return (
      <div className="fixed top-4 right-4  px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        {/* <span>正在处理外部图片...</span> */}
      </div>
    );
  }

  return null; // 这个组件只处理副作用，不渲染任何内容
}