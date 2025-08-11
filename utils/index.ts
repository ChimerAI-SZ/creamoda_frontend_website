import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function downloadImage(url: string, filename: string) {
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
    })
    .catch(error => console.error('Error downloading image:', error));
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
export const PROMPT_MAX_LEN = 166;
