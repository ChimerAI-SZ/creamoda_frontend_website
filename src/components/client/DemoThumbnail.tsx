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
        // 在客户端获取当前域名
        if (typeof window !== 'undefined') {
          fullImageUrl = `${window.location.protocol}//${window.location.host}${imageSrc}`;
        } else {
          // 服务端渲染时使用默认域名
          fullImageUrl = `https://creamoda.ai${imageSrc}`;
        }
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
