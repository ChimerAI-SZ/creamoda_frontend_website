'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useExternalImageHandler } from '@/hooks/useExternalImageHandler';

interface SearchParamsHandlerProps {
  onImageUrl?: (url: string) => void;
  onVariationType?: (type: string) => void;
  onTab?: (tab: string) => void;
  onPrompt?: (prompt: string) => void;
  showProcessingIndicator?: boolean;
}

/**
 * 内部组件：处理URL参数
 */
function SearchParamsHandlerInner({ 
  onImageUrl, 
  onVariationType, 
  onTab,
  onPrompt,
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
      const prompt = searchParams.get('prompt');

      // 处理variationType参数
      if (variationType && onVariationType) {
        onVariationType(variationType);
      }

      // 处理tab参数  
      if (tab && onTab) {
        onTab(tab);
      }

      // 处理prompt参数
      if (prompt && onPrompt) {
        const decodedPrompt = decodeURIComponent(prompt);
        console.log('接收到prompt参数:', decodedPrompt);
        onPrompt(decodedPrompt);
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
  }, [searchParams, onImageUrl, onVariationType, onTab, onPrompt, processImageUrl]);

  // 显示处理状态
  if (isProcessingImage && showProcessingIndicator) {
    return (
      <div className="fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        {/* <span>正在处理外部图片...</span> */}
      </div>
    );
  }

  return null; // 这个组件只处理副作用，不渲染任何内容
}

/**
 * 导出包裹了Suspense的组件
 * 支持处理imageUrl、variationType、tab等参数
 * 自动检测并处理外部图片URL
 */
export function SearchParamsHandler(props: SearchParamsHandlerProps) {
  return (
    <Suspense fallback={null}>
      <SearchParamsHandlerInner {...props} />
    </Suspense>
  );
}