'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/index';
import { isValidImageUrl } from '@/utils/validation';
import { useAlertStore } from '@/stores/useAlertStore';

interface UrlInputProps {
  onImageUrlChange: (url: string) => void;
  disabled?: boolean;
}

// 后端API前缀 - 移除@字符
const apiPrefix = 'https://imgproxy.creamoda.ai/sig';

export function UrlInput({ onImageUrlChange, disabled = false }: UrlInputProps) {
  const { showAlert } = useAlertStore();
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [isLoadingImageUrl, setIsLoadingImageUrl] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImageUrl(e.target.value);
  };

  const handleAddImage = () => {
    if (newImageUrl?.trim()) {
      if (isValidImageUrl(newImageUrl)) {
        try {
          setIsLoadingImageUrl(true);

          // 使用UTF-8编码并转换为Base64
          const encoder = new TextEncoder();
          const bytes = encoder.encode(newImageUrl);

          let binaryString = '';
          bytes.forEach(byte => {
            binaryString += String.fromCharCode(byte);
          });

          const base64Url = btoa(binaryString);
          const processedUrl = `${apiPrefix}/${base64Url}`;
          
          onImageUrlChange(processedUrl);

          // 测试图片是否能正确加载
          const img = new (window.Image as any)();
          img.onload = () => {
            setIsLoadingImageUrl(false);
            setNewImageUrl(''); // 清空输入框
          };
          img.onerror = () => {
            setIsLoadingImageUrl(false);
            showAlert({
              type: 'error',
              content: 'Unable to load the image from this URL. Please try another image URL.'
            });
            onImageUrlChange('');
          };
          img.src = processedUrl;
        } catch (error) {
          console.error('Error converting URL to base64:', error);
          showAlert({
            type: 'error',
            content: 'Failed to process the image URL. Please try a different URL.'
          });
          setIsLoadingImageUrl(false);
          onImageUrlChange('');
        }
      } else {
        showAlert({
          type: 'error',
          content:
            'Please enter a valid image URL (must start with http:// or https:// and end with .jpg, .jpeg, .png, etc.)'
        });
        onImageUrlChange('');
      }
    } else {
      onImageUrlChange('');
    }
  };

  return (
    <div className="w-full">
      <div className="text-black text-[14px] font-medium mb-2">Or upload image from URL</div>
      <div className="flex items-center justify-center gap-4">
        <Input
          type="text"
          placeholder="Or paste image address"
          value={newImageUrl}
          onChange={handleUrlChange}
          disabled={disabled || isLoadingImageUrl}
          className={cn(
            'bg-white w-full h-[36px] px-[12px] text-[14px] font-normal leading-5 placeholder:text-[#d5d5d5] rounded-sm',
            'bottom-[12px]'
          )}
        />
        <Button
          variant="outline"
          type="button"
          disabled={disabled || isLoadingImageUrl}
          onClick={handleAddImage}
          className="h-[36px] px-[12px] text-[14px] font-normal leading-5 rounded-[4px] border-input"
        >
          {isLoadingImageUrl ? 'Loading...' : 'Add'}
        </Button>
      </div>
    </div>
  );
}