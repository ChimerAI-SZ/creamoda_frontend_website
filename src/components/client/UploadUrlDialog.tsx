'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UploadUrlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  saasUrl: string;
  tab?: string;
  variationType?: string;
}

export default function UploadUrlDialog({ isOpen, onClose, saasUrl, tab, variationType }: UploadUrlDialogProps) {
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  const handleCancel = useCallback(() => {
    setImageUrl('');
    onClose();
  }, [onClose]);

  const handleConfirm = () => {
    if (!imageUrl.trim()) return;

    // 构建带参数的 URL
    const params = new URLSearchParams();
    
    if (tab) {
      params.append('tab', tab);
    }
    
    if (variationType) {
      params.append('variationType', variationType);
    }
    
    // 添加图片 URL 参数（URLSearchParams.append 会自动编码，所以不需要手动 encodeURIComponent）
    params.append('imageUrl', imageUrl);
    
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
            <div className="self-stretch text-left text-[#111827] text-lg font-semibold font-['Inter'] leading-7">Url upload</div>
            <div className="self-stretch text-left text-[#6B7280] text-xs font-normal font-['Inter']">Upload a reference image, and AI applies its style to your photo.</div>
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

