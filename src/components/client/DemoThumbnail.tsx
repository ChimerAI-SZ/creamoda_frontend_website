'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface DemoThumbnailProps {
  imageSrc: string;
  index: number;
  title: string;
  saasUrl: string;
  tab?: string;
  variationType?: string;
}

export default function DemoThumbnail({ imageSrc, index, title, saasUrl, tab, variationType }: DemoThumbnailProps) {
  const router = useRouter();

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

  const handleDemoClick = () => {
    // 构建带参数的 URL
    let targetUrl = saasUrl;
    const params = new URLSearchParams();
    
    if (tab) {
      params.append('tab', tab);
    }
    
    if (variationType) {
      params.append('variationType', variationType);
    }
    
    // 添加图片 URL 参数，如果是相对路径则转换为完整 URL
    if (imageSrc) {
      let fullImageUrl = imageSrc;
      
      // 如果是相对路径（以 / 开头），转换为完整 URL
      if (imageSrc.startsWith('/')) {
        const publicDomain = getPublicDomain();
        fullImageUrl = `${publicDomain}${imageSrc}`;
      }
      
      params.append('imageUrl', fullImageUrl);
    }
    
    if (params.toString()) {
      targetUrl = `${saasUrl}?${params.toString()}`;
    }
    
    router.push(targetUrl);
  };

  return (
    <div 
      key={index} 
      className="demo-thumb"
      onClick={handleDemoClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleDemoClick();
        }
      }}
    >
      <Image
        src={imageSrc}
        alt={`Demo image ${index + 1} for ${title}`}
        width={50}
        height={50}
        className="demo-img"
      />
    </div>
  );
}
