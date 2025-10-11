'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import UploadUrlDialog from './UploadUrlDialog';
import { uploadImage } from '@/lib/api/common';
import { useAlertStore } from '@/stores/useAlertStore';

interface UploadButtonProps {
  uploadText: string;
  saasUrl: string;
  tab?: string;
  variationType?: string;
}

export default function UploadButton({ uploadText, saasUrl, tab, variationType }: UploadButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showAlert } = useAlertStore();

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

    setIsUploading(true);

    try {
      // 上传图片
      const uploadedUrl = await uploadImage(file);

      if (uploadedUrl) {
        // 构建跳转URL
        const params = new URLSearchParams();
        
        if (tab) {
          params.append('tab', tab);
        }
        
        if (variationType) {
          params.append('variationType', variationType);
        }
        
        params.append('imageUrl', uploadedUrl);
        
        const targetUrl = `${saasUrl}?${params.toString()}`;
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
          Or drop a file, paste image or{' '}
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

