'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getFrontendImageDetail } from '@/lib/api/common';
import { FrontendImageItem, SimilarImageItem } from '@/types/frontendImages';

// 定义样式和动画（与 DesignFilterSection 保持一致）
const componentStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 字体加载优化 - 防止字体切换时的抖动 */
  .font-stable {
    font-display: swap;
    font-synthesis: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 标题字体稳定性 */
  .title-stable {
    font-family: 'Neue Machina Ultrabold', 'Neue Machina', system-ui, -apple-system, sans-serif;
    font-weight: 900;
    font-display: swap;
    font-synthesis: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    /* 防止字体切换时的布局抖动 */
    contain: layout style;
    will-change: auto;
    /* 确保字体渲染一致性 */
    font-kerning: normal;
    font-variant-ligatures: normal;
    font-feature-settings: "kern" 1, "liga" 1;
  }

  /* InstrumentSans字体样式 */
  @font-face {
    font-family: 'InstrumentSans';
    src: url('/marketing/fonts/InstrumentSans-Italic-Variable.ttf') format('truetype');
    font-display: swap;
  }

  .instrument-sans {
    font-family: 'InstrumentSans', system-ui, sans-serif;
    font-display: swap;
    font-synthesis: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Neue Machina 字体样式 */
  .neue-machina {
    font-family: 'Neue Machina', system-ui, sans-serif;
    font-display: swap;
    font-synthesis: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 图片容器稳定性 */
  .image-container-stable {
    contain: layout;
    will-change: auto;
  }
`;

// 修改设计功能卡片组件（与 DesignFilterSection 保持一致）
const ModifyDesignCard = React.memo(function ModifyDesignCard({
  icon,
  title,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-row items-center justify-start gap-2 px-2 py-0.5 rounded-sm cursor-pointer transition-all duration-200 hover:bg-white/25 flex-shrink-0 min-w-0"
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        border: '0.5px solid rgba(255, 255, 255, 0.4)',
        width: 'calc(25% - 6px)',
        minHeight: '40px'
      }}
    >
      <div className="w-5 h-5 flex-shrink-0">
        {icon}
      </div>
      <span className="text-white text-xs font-medium leading-tight break-words text-left">
        {title}
      </span>
    </button>
  );
});

interface DesignImageDetailPageProps {
  image: FrontendImageItem;
  similarImages?: SimilarImageItem[];
}

// 优化图片组件，使用memo防止重渲染
const MemoizedImageWithSkeleton = React.memo(function ImageWithSkeleton({ 
  src, 
  alt = '', 
  href,
  onClick 
}: { 
  src: string; 
  alt?: string; 
  href?: string;
  onClick?: () => void 
}) {
  const [loaded, setLoaded] = useState(false);

  const content = (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover block"
        onLoad={() => setLoaded(true)}
        loading="lazy"
        quality={85}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 200ms ease' }}
      />
      {!loaded && (
        <div className="absolute inset-0 z-20">
          <Skeleton className="w-full h-full bg-white/10 animate-pulse rounded-md" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
        <div className="flex justify-center pointer-events-auto">
          <Button
            variant="ghost"
            className="w-full bg-gray-800/70 hover:bg-gray-800/80 text-white rounded-md py-3 backdrop-blur-sm"
            onClick={e => {
              e.stopPropagation();
              onClick && onClick();
            }}
          >
            View Detail
          </Button>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group relative w-full overflow-hidden rounded-md cursor-pointer block"
        style={{ aspectRatio: '3 / 4' }}
        onClick={e => {
          e.preventDefault();
          onClick && onClick();
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className="group relative w-full overflow-hidden rounded-md cursor-pointer"
      style={{ aspectRatio: '3 / 4' }}
      onClick={onClick}
    >
      {content}
    </div>
  );
});

export default function DesignImageDetailPage({ image, similarImages = [] }: DesignImageDetailPageProps) {
  const router = useRouter();
  const [relatedImages, setRelatedImages] = useState<SimilarImageItem[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(true); // 默认设为 true，让图片直接显示
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // 字体加载状态管理（与 DesignFilterSection 保持一致）
  useEffect(() => {
    const checkFontsLoaded = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          setFontsLoaded(true);
        });
      } else {
        // 降级处理：延迟设置字体已加载状态
        setTimeout(() => setFontsLoaded(true), 1000);
      }
    };

    checkFontsLoaded();
  }, []);

  // 加载相关图片（优先使用服务端传入的数据，否则客户端异步加载）
  useEffect(() => {
    if (similarImages.length > 0) {
      // 如果服务端已经传入了相似图片数据，直接使用
      setRelatedImages(similarImages);
      setIsLoadingRelated(false);
    } else {
      // 否则客户端异步加载
    const loadRelatedImages = async () => {
      try {
        const response = await getFrontendImageDetail({
          slug: image.slug
        });
        
        if (response.code === 0 && response.data) {
          // 直接使用后端返回的相似图片列表
          setRelatedImages(response.data.similar_images || []);
        }
      } catch (error) {
        console.error('Failed to load related images:', error);
        // 如果新接口失败，可以回退到旧的逻辑
        setRelatedImages([]);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    loadRelatedImages();
    }
  }, [image.slug, similarImages]);

  return (
    <div className="relative w-full min-h-screen">
      {/* 桌面端背景图片 - 上半部分全宽 */}
      <div 
        className="hidden lg:block fixed top-0 left-0 w-full h-[70vh] z-0"
        style={{
          backgroundImage: `url(${image.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 渐变遮罩 - 新的渐变和模糊效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black backdrop-blur-[200px]"></div>
      </div>

      {/* 桌面端主要内容区域 */}
      <div className="hidden lg:block relative z-5 w-full max-w-6xl mx-auto px-4 py-8 pt-20">
        {/* 注入组件样式 */}
        <style dangerouslySetInnerHTML={{ __html: componentStyles }} />
        
        {/* 主要内容区域 */}
        <div className="grid h-full grid-rows-[1.6fr_1fr] overflow-hidden">
        {/* 上半部分：图片 + 右侧内容 */}
        <div className="flex flex-col gap-6 p-6 overflow-visible">
          {/* 返回按钮 - 在顶部居左 */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => router.push('/designs')}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path 
                  d="M10 12L6 8L10 4" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium">Back to list</span>
            </button>
          </div>
          
          {/* 图片和右侧内容区域 */}
          <div className="grid grid-cols-[1fr_2fr] gap-6 flex-1 overflow-visible">
            {/* 左侧图片 */}
            <div className="w-full h-full rounded-xl overflow-hidden bg-black flex items-center justify-center relative">
            {/* 图片骨架屏 */}
            {!imageLoaded && (
              <div className="absolute inset-0 z-10">
                <Skeleton className="w-full h-full bg-white/10 animate-pulse rounded-xl" />
              </div>
            )}
            
            <Image
              src={image.image_url}
              alt={image.clothing_description || ''}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 300ms ease',
                transform: 'translateZ(0)'
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', image.image_url);
                setImageLoaded(true);
              }}
              onError={(e) => {
                console.error('Failed to load image:', image.image_url, e);
                setImageLoaded(true); // 即使加载失败也隐藏骨架屏
              }}
              priority
            />
            </div>
          
          {/* 右侧内容 */}
          <div className="w-full h-full text-white overflow-visible">
            {/* 圆角容器，白色10%背景 - 与图片同高度 */}
            <div className="bg-white/10 rounded-lg p-6 h-full flex flex-col">
              {/* 容器top - 标题和标签组，上下居中 */}
              <div className="flex-1 flex flex-col justify-center">
                {/* 标题 */}
                <div 
                  className={`text-white text-[24px] leading-[1.5]  mb-1 instrument-sans transition-opacity duration-300 ${
                    fontsLoaded ? 'opacity-100' : 'opacity-90'
                  }`}
                >
                  {image.clothing_description || 'Fashion Design'}
                </div>
                
                {/* 标签组 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center gap-1 px-0 py-[11px] h-7 bg-transparent">
                    <span className="text-[#ffffff] text-sm font-medium">#</span>
                    <span 
                      className="text-white text-xs font-medium leading-[1.833] text-center instrument-sans"
                    >
                      {image.type || 'Fashion'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 px-0 py-[11px] h-7 bg-transparent">
                    <span className="text-[#ffffff] text-sm font-medium">#</span>
                    <span 
                      className="text-white text-xs font-medium leading-[1.833] text-center instrument-sans"
                    >
                      {image.gender || 'Unisex'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 px-0 py-[11px] h-7 bg-transparent">
                    <span className="text-[#ffffff] text-sm font-medium">#</span>
                    <span 
                      className="text-white text-xs font-normal leading-[1.833] text-center instrument-sans"
                    >
                      {image.feature || 'AI Generated'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 容器bottom - 按钮和功能卡片，置底 */}
              <div className="flex flex-col justify-end">
                {/* 按钮组 */}
                <div className="flex flex-col items-stretch gap-3">
                  {/* Generate Similar Designs 按钮 */}
                  <div className="flex flex-col">
                  <button 
                      className="flex items-center justify-center gap-2.5 px-3 py-[14px] w-full h-[50px] rounded-[4px] text-black text-[17px] font-bold leading-[1.1] text-center cursor-pointer hover:bg-gray-100 transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none active:outline-none"
                    style={{ 
                        backgroundColor: '#FFFFFF',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button clicked!');
                      // 跳转到 fashion-design/create 页面，并传递 complete_prompt 参数
                      const encodedPrompt = encodeURIComponent(image.complete_prompt || '');
                      const targetUrl = `/fashion-design/create?prompt=${encodedPrompt}&tab=text-to-image`;
                      console.log('跳转到:', targetUrl);
                      console.log('原始提示词:', image.complete_prompt);
                      router.push(targetUrl);
                    }}
                  >
                      Generate Similar Designs
                    </button>
                    {/* 下划线 */}
                    <div className="w-full h-px bg-white/15 mt-4"></div>
                  </div>
                  
                  {/* Or modify the design 文字 */}
                  <div className="mt-2 mb-3 flex items-center justify-start">
                    <span className="text-white/80 text-sm">Or modify the design</span>
                      </div>
                  
                  {/* 修改设计功能卡片 */}
                  <div className="flex gap-2 overflow-x-auto">
                    <ModifyDesignCard
                      icon={
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M17.0664 2.59985H3.73307C2.8126 2.59985 2.06641 3.34605 2.06641 4.26652V17.5999C2.06641 18.5203 2.8126 19.2665 3.73307 19.2665H17.0664C17.9869 19.2665 18.7331 18.5203 18.7331 17.5999V4.26652C18.7331 3.34605 17.9869 2.59985 17.0664 2.59985Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.40039 5.93311V9.26644" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.0664 12.5999V15.9332" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.73438 5.93311V9.26644" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.0664 5.93311H15.3997" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.40039 12.5999H8.73372" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.0664 9.26636H15.3997" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.40039 15.9331H8.73372" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15.4004 12.5999V15.9332" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      }
                      title="Change Fabric"
                            onClick={() => {
                              const encodedImageUrl = encodeURIComponent(image.image_url || '');
                        const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=8`;
                              router.push(targetUrl);
                            }}
                    />
                    <ModifyDesignCard
                      icon={
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M15.8164 8.01652V16.3499M15.8164 16.3499V19.2665H4.98307V16.3499M15.8164 16.3499H18.7331V8.01652C18.7331 6.76652 17.8997 5.30819 16.6497 4.26652C15.3997 3.22485 12.8997 2.59985 12.8997 2.59985H7.89974C7.89974 2.59985 5.39974 3.22485 4.14974 4.26652C2.89974 5.30819 2.06641 6.76652 2.06641 8.01652V16.3499H4.98307M4.98307 16.3499V8.01652" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.9004 2.59985C12.9004 3.98057 11.7811 5.09985 10.4004 5.09985C9.01968 5.09985 7.90039 3.98057 7.90039 2.59985" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      }
                      title="Change Style"
                            onClick={() => {
                              const encodedImageUrl = encodeURIComponent(image.image_url || '');
                        const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=11`;
                              router.push(targetUrl);
                            }}
                    />
                    <ModifyDesignCard
                      icon={
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M6.87109 18.3499L17.9822 7.23949L14.1717 3.34985L7.56549 9.95605" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.1504 13.4331H18.7341V19.2664H4.65039" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1.73438 2.93311H7.56771V16.2664C7.56771 17.8773 6.26187 19.1831 4.65104 19.1831C3.04021 19.1831 1.73438 17.8773 1.73438 16.2664V2.93311Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      }
                      title="Change Color"
                            onClick={() => {
                              const encodedImageUrl = encodeURIComponent(image.image_url || '');
                        const targetUrl = `/magic-kit/create?imageUrl=${encodedImageUrl}&variationType=1`;
                              router.push(targetUrl);
                            }}
                    />
                    <ModifyDesignCard
                      icon={
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <g clipPath="url(#clip0_177_3516)">
                            <path d="M18.7331 2.59988C18.7331 2.59988 14.3955 1.8503 12.8997 4.26655C11.7863 6.06515 13.3164 8.01656 13.3164 8.01656M18.7331 2.59988L13.3164 8.01656M18.7331 2.59988C18.7331 2.59988 19.4827 6.93744 17.0664 8.43323C15.2678 9.54665 13.3164 8.01656 13.3164 8.01656M13.3164 8.01656L12.0664 9.26656" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.3164 13.8499L12.0664 12.5999M13.3164 13.8499C13.3164 13.8499 11.7863 15.8013 12.8997 17.5999C14.3955 20.0161 18.7331 19.2665 18.7331 19.2665M13.3164 13.8499L18.7331 19.2665M13.3164 13.8499C13.3164 13.8499 15.2678 12.3198 17.0664 13.4332C19.4827 14.929 18.7331 19.2665 18.7331 19.2665" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.59299 8.01656L8.84299 9.26656M7.59299 8.01656C7.59299 8.01656 9.12307 6.06515 8.00966 4.26655C6.51386 1.8503 2.1763 2.59988 2.1763 2.59988M7.59299 8.01656L2.1763 2.59988M7.59299 8.01656C7.59299 8.01656 5.64157 9.54665 3.84296 8.43323C1.42672 6.93744 2.1763 2.59988 2.1763 2.59988" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.59299 13.8499L8.84299 12.5999M7.59299 13.8499C7.59299 13.8499 9.12307 15.8013 8.00966 17.5999C6.51386 20.0161 2.1763 19.2665 2.1763 19.2665M7.59299 13.8499L2.1763 19.2665M7.59299 13.8499C7.59299 13.8499 5.64157 12.3198 3.84296 13.4332C1.42672 14.929 2.1763 19.2665 2.1763 19.2665" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_177_3516">
                              <rect width="20" height="20" fill="white" transform="translate(0.400391 0.933105)"/>
                            </clipPath>
                          </defs>
                        </svg>
                      }
                      title="Change Printing"
                            onClick={() => {
                              const encodedImageUrl = encodeURIComponent(image.image_url || '');
                        const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=9`;
                              router.push(targetUrl);
                            }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* 下半部分：标题 + 5 张相关图片 */}
        <div className="px-6 pb-4 pt-2 flex flex-col">
          <div className="flex items-center justify-center mb-3 mt-6">
            <div className="flex-1 h-px bg-gray-600"></div>
          <div 
              className="text-white text-base sm:text-lg font-medium mx-4"
          >
              More Like This
            </div>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>
          <div className="flex-1 grid grid-cols-5 gap-3 min-h-0">
            {isLoadingRelated ? (
              // 加载骨架屏
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={`loading-${idx}`} className="w-full overflow-hidden rounded-md" style={{ aspectRatio: '3 / 4' }}>
                  <Skeleton className="w-full h-full bg-white/10" />
                </div>
              ))
            ) : (
              relatedImages.map((img, idx) => (
                <div
                  key={`related-${img.id}-${idx}`}
                  className="w-full overflow-hidden rounded-md cursor-pointer relative group"
                  style={{ aspectRatio: '3 / 4' }}
                  onClick={() => {
                    // 跳转到对应的图片页面
                    window.location.href = `/designs/${img.slug}`;
                  }}
                >
                  <MemoizedImageWithSkeleton
                    src={img.image_url}
                    alt={img.clothing_description || ''}
                    href={`/designs/${img.slug}`}
                    onClick={() => {
                      window.location.href = `/designs/${img.slug}`;
                    }}
                  />

                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>

      {/* 移动端布局 */}
      <div className="lg:hidden w-full px-4 py-8 pt-20">
        {/* 注入组件样式 */}
        <style dangerouslySetInnerHTML={{ __html: componentStyles }} />
        
        {/* 返回按钮 - 在顶部居左 */}
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => router.push('/designs')}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M10 12L6 8L10 4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* 上半部分：图片 + 蒙版内容 */}
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-black mb-6">
          <Image
            src={image.image_url}
            alt={image.clothing_description || ''}
            fill
            sizes="100vw"
            className="object-cover"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 300ms ease',
              transform: 'translateZ(0)'
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', image.image_url);
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.error('Failed to load image:', image.image_url, e);
              setImageLoaded(true); // 即使加载失败也隐藏骨架屏
            }}
            priority
          />
          
          {/* 图片骨架屏 */}
          {!imageLoaded && (
            <div className="absolute inset-0 z-10">
              <Skeleton className="w-full h-full bg-white/10 animate-pulse rounded-xl" />
            </div>
          )}

          {/* 底部蒙版和标题标签 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 z-10">
            {/* 标题 */}
            <h2 
              className={`text-white text-lg leading-[1.4] mb-3 instrument-sans transition-opacity duration-300 ${
                fontsLoaded ? 'opacity-100' : 'opacity-90'
              }`}
            >
              {image.clothing_description || 'Fashion Design'}
            </h2>
            
            {/* 标签组 */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-medium">#</span>
                <span className="text-white text-xs font-medium instrument-sans">
                  {image.type || 'Fashion'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-medium">#</span>
                <span className="text-white text-xs font-medium instrument-sans">
                  {image.gender || 'Unisex'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-medium">#</span>
                <span className="text-white text-xs font-normal instrument-sans">
                  {image.feature || 'AI Generated'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 下半部分：按钮和功能卡片 */}
        <div className="w-full">
          {/* Generate Similar Designs 按钮 */}
          <button 
            className="w-full bg-white text-black py-3 rounded-md text-sm font-medium mb-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const encodedPrompt = encodeURIComponent(image.complete_prompt || '');
              const targetUrl = `/fashion-design/create?prompt=${encodedPrompt}&tab=text-to-image`;
              router.push(targetUrl);
            }}
          >
            Generate Similar Designs
          </button>

          {/* Or modify the design 文字 - 左对齐 */}
          <div className="mb-4 text-left">
            <span className="text-white/80 text-sm">Or modify the design</span>
          </div>

          {/* 修改设计功能卡片 - 2x2 网格布局 */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={() => {
                const encodedImageUrl = encodeURIComponent(image.image_url || '');
                const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=8`;
                router.push(targetUrl);
              }}
              className="flex items-center gap-2 p-3 rounded-md bg-white/20 backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
                <path d="M17.0664 2.59985H3.73307C2.8126 2.59985 2.06641 3.34605 2.06641 4.26652V17.5999C2.06641 18.5203 2.8126 19.2665 3.73307 19.2665H17.0664C17.9869 19.2665 18.7331 18.5203 18.7331 17.5999V4.26652C18.7331 3.34605 17.9869 2.59985 17.0664 2.59985Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.40039 5.93311V9.26644" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.0664 12.5999V15.9332" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.73438 5.93311V9.26644" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.0664 5.93311H15.3997" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.40039 12.5999H8.73372" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.0664 9.26636H15.3997" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.40039 15.9331H8.73372" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.4004 12.5999V15.9332" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-white text-xs font-medium">Change Fabric</span>
            </button>

            <button
              onClick={() => {
                const encodedImageUrl = encodeURIComponent(image.image_url || '');
                const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=11`;
                router.push(targetUrl);
              }}
              className="flex items-center gap-2 p-3 rounded-md bg-white/20 backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
                <path d="M15.8164 8.01652V16.3499M15.8164 16.3499V19.2665H4.98307V16.3499M15.8164 16.3499H18.7331V8.01652C18.7331 6.76652 17.8997 5.30819 16.6497 4.26652C15.3997 3.22485 12.8997 2.59985 12.8997 2.59985H7.89974C7.89974 2.59985 5.39974 3.22485 4.14974 4.26652C2.89974 5.30819 2.06641 6.76652 2.06641 8.01652V16.3499H4.98307M4.98307 16.3499V8.01652" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.9004 2.59985C12.9004 3.98057 11.7811 5.09985 10.4004 5.09985C9.01968 5.09985 7.90039 3.98057 7.90039 2.59985" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-white text-xs font-medium">Change Style</span>
            </button>

            <button
              onClick={() => {
                const encodedImageUrl = encodeURIComponent(image.image_url || '');
                const targetUrl = `/magic-kit/create?imageUrl=${encodedImageUrl}&variationType=1`;
                router.push(targetUrl);
              }}
              className="flex items-center gap-2 p-3 rounded-md bg-white/20 backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
                <path d="M6.87109 18.3499L17.9822 7.23949L14.1717 3.34985L7.56549 9.95605" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.1504 13.4331H18.7341V19.2664H4.65039" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.73438 2.93311H7.56771V16.2664C7.56771 17.8773 6.26187 19.1831 4.65104 19.1831C3.04021 19.1831 1.73438 17.8773 1.73438 16.2664V2.93311Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-white text-xs font-medium">Change Color</span>
            </button>

            <button
              onClick={() => {
                const encodedImageUrl = encodeURIComponent(image.image_url || '');
                const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=9`;
                router.push(targetUrl);
              }}
              className="flex items-center gap-2 p-3 rounded-md bg-white/20 backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
                <g clipPath="url(#clip0_177_3516)">
                  <path d="M18.7331 2.59988C18.7331 2.59988 14.3955 1.8503 12.8997 4.26655C11.7863 6.06515 13.3164 8.01656 13.3164 8.01656M18.7331 2.59988L13.3164 8.01656M18.7331 2.59988C18.7331 2.59988 19.4827 6.93744 17.0664 8.43323C15.2678 9.54665 13.3164 8.01656 13.3164 8.01656M13.3164 8.01656L12.0664 9.26656" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.3164 13.8499L12.0664 12.5999M13.3164 13.8499C13.3164 13.8499 11.7863 15.8013 12.8997 17.5999C14.3955 20.0161 18.7331 19.2665 18.7331 19.2665M13.3164 13.8499L18.7331 19.2665M13.3164 13.8499C13.3164 13.8499 15.2678 12.3198 17.0664 13.4332C19.4827 14.929 18.7331 19.2665 18.7331 19.2665" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.59299 8.01656L8.84299 9.26656M7.59299 8.01656C7.59299 8.01656 9.12307 6.06515 8.00966 4.26655C6.51386 1.8503 2.1763 2.59988 2.1763 2.59988M7.59299 8.01656L2.1763 2.59988M7.59299 8.01656C7.59299 8.01656 5.64157 9.54665 3.84296 8.43323C1.42672 6.93744 2.1763 2.59988 2.1763 2.59988" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.59299 13.8499L8.84299 12.5999M7.59299 13.8499C7.59299 13.8499 9.12307 15.8013 8.00966 17.5999C6.51386 20.0161 2.1763 19.2665 2.1763 19.2665M7.59299 13.8499L2.1763 19.2665M7.59299 13.8499C7.59299 13.8499 5.64157 12.3198 3.84296 13.4332C1.42672 14.929 2.1763 19.2665 2.1763 19.2665" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_177_3516">
                    <rect width="20" height="20" fill="white" transform="translate(0.400391 0.933105)"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-white text-xs font-medium">Change Printing</span>
            </button>
          </div>

          {/* More like this 标题 - 左对齐 */}
          <div className="mb-4 text-left">
            <span className="text-white text-base font-medium">More like this</span>
          </div>

          {/* 相似图片 - 两行两张 */}
          <div className="grid grid-cols-2 gap-3">
            {isLoadingRelated ? (
              // 加载骨架屏
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={`loading-${idx}`} className="w-full overflow-hidden rounded-md" style={{ aspectRatio: '3 / 4' }}>
                  <Skeleton className="w-full h-full bg-white/10" />
                </div>
              ))
            ) : (
              relatedImages.slice(0, 4).map((img, idx) => (
                <div
                  key={`mobile-related-${img.id}-${idx}`}
                  className="w-full overflow-hidden rounded-md cursor-pointer relative group"
                  style={{ aspectRatio: '3 / 4' }}
                  onClick={() => {
                    window.location.href = `/designs/${img.slug}`;
                  }}
                >
                  <MemoizedImageWithSkeleton
                    src={img.image_url}
                    alt={img.clothing_description || ''}
                    href={`/designs/${img.slug}`}
                    onClick={() => {
                      window.location.href = `/designs/${img.slug}`;
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
