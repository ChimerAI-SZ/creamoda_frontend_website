import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Analytics } from '@/lib/analytics';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

export function downloadImage(url: string, filename: string) {
  // 获取用户信息和当前功能名称
  const userInfo = usePersonalInfoStore.getState();
  const userId = userInfo.email || 'anonymous';
  const featureName = Analytics.getCurrentFeatureName();
  
  console.log('[downloadImage] Starting download:', { 
    url, 
    filename, 
    userId, 
    featureName 
  });

  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      const blobUrl = URL.createObjectURL(blob);
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      // 📊 埋点：下载成功
      Analytics.trackDownloadImage(
        userId,
        featureName,
        {
          fileType: Analytics.getFileExtension(filename),
          fileSize: blob.size,
        }
      );
      
      console.log('[downloadImage] Download successful');
    })
    .catch(error => {
      console.error('Error downloading image:', error);
      
      // 📊 埋点：下载失败（可选）
      // 注意：trackDownloadImage 目前没有 status 参数，所以失败时不记录
      // 如果需要记录失败，可以扩展 Analytics.trackDownloadImage 的定义
    });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 定义一个自定义日志函数
export function log(message: string, ...optionalParams: any[]) {
  const isClient = typeof window !== 'undefined';

  const logging = isClient ? localStorage.getItem('LOGGING') === 'true' : process.env.NEXT_PUBLIC_LOGGING === 'true';

  if (logging) {
    console.log(message, ...optionalParams);
  }
}

// 文生图提示词后端长度限制（参考 BE: img.py 校验）
export const PROMPT_MAX_LEN = 2048;
