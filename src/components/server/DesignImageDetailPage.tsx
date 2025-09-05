'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getFrontendImageDetail } from '@/lib/api/common';
import { FrontendImageItem, SimilarImageItem } from '@/types/frontendImages';

interface DesignImageDetailPageProps {
  image: FrontendImageItem;
}

// 优化图片组件，使用memo防止重渲染
const MemoizedImageWithSkeleton = React.memo(function ImageWithSkeleton({ 
  src, 
  alt = '', 
  onClick 
}: { 
  src: string; 
  alt?: string; 
  onClick?: () => void 
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group relative w-full overflow-hidden rounded-md cursor-pointer"
      style={{ aspectRatio: '3 / 4' }}
      onClick={onClick}
    >
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
    </div>
  );
});

export default function DesignImageDetailPage({ image }: DesignImageDetailPageProps) {
  const router = useRouter();
  const [relatedImages, setRelatedImages] = useState<SimilarImageItem[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(true); // 默认设为 true，让图片直接显示
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 加载相关图片（使用新的相似度推荐接口）
  useEffect(() => {
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
  }, [image.slug]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* 主要内容区域 */}
      <div className="grid h-full grid-rows-[1.6fr_1fr] overflow-hidden">
        {/* 上半部分：左右 2:3 */}
        <div className="grid grid-cols-[1fr_2fr] gap-6 p-6 overflow-visible">
          {/* 左侧图片（圆角） */}
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
          <div className="w-full h-full bg-[#0b0b0c]/60 rounded-xl text-white overflow-visible">
            {/* 右侧内容分为上下两部分 */}
            <div className="h-full flex flex-col overflow-visible">
              {/* 上半部分 */}
              <div className="flex-1 px-8 py-6 flex flex-col overflow-visible">
                {/* 标题 */}
                <h1 
                  className="text-white text-[32px] leading-[1.025] max-w-[498px] mb-6"
                  style={{ fontFamily: "'Neue Machina Ultrabold', system-ui, sans-serif", fontWeight: 900 }}
                >
                  {image.clothing_description || 'Fashion Design'}
                </h1>
                
                {/* 标签组 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center gap-0.5 px-0 py-[11px] h-7 bg-transparent">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#704DFF]"></div>
                    <span 
                      className="text-white text-xs font-medium leading-[1.833] text-center ml-1"
                      style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                    >
                      {image.type || 'Fashion'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-0.5 px-0 py-[11px] h-7 bg-transparent">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#704DFF]"></div>
                    <span 
                      className="text-white text-xs font-medium leading-[1.833] text-center ml-1"
                      style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                    >
                      {image.gender || 'Unisex'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-0.5 px-0 py-[11px] h-7 bg-transparent">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#704DFF]"></div>
                    <span 
                      className="text-white text-xs font-normal leading-[1.833] text-center ml-1"
                      style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                    >
                      {image.feature || 'AI Generated'}
                    </span>
                  </div>
                </div>
                
                {/* Generated by 文字紧跟标签组 */}
                <div className="mt-6">
                  <p 
                    className="text-white text-[10px] font-bold leading-[2.2] w-full"
                    style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                  >
                    Created by Creamoda
                  </p>
                </div>
                
                {/* 按钮组 */}
                <div className="flex items-center gap-3 mt-6 relative z-10">
                  {/* Generate Similar Designs 按钮 */}
                  <button 
                    className="flex items-center justify-center gap-2.5 px-3 py-[11px] w-[406px] h-[42px] rounded-[4px] text-white text-[20px] font-bold leading-[1.1] text-center cursor-pointer hover:bg-opacity-80 transition-all duration-200 relative z-20 outline-none focus:outline-none focus-visible:outline-none active:outline-none"
                    style={{ 
                      backgroundColor: 'rgba(112, 77, 255, 0.37)',
                      fontFamily: "Manrope, system-ui, sans-serif",
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button clicked!');
                      // 跳转到 fashion-design/create 页面，并传递 clothing_description 参数
                      const encodedDescription = encodeURIComponent(image.clothing_description || '');
                      const targetUrl = `/fashion-design/create?prompt=${encodedDescription}&tab=text-to-image`;
                      console.log('跳转到:', targetUrl);
                      console.log('原始描述:', image.clothing_description);
                      router.push(targetUrl);
                    }}
                  >
                    Generate Similar Designs
                  </button>
                  
                  {/* 三个点按钮 */}
                  <div className="relative">
                    <button 
                      className="flex items-center justify-center gap-2.5 px-3 py-[11px] w-[79px] h-[42px] rounded-[4px]"
                      style={{ backgroundColor: 'rgba(112, 77, 255, 0.37)' }}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-[6px] h-[6px] rounded-full bg-[#D9D9D9]"></div>
                        <div className="w-[6px] h-[6px] rounded-full bg-[#D9D9D9]"></div>
                        <div className="w-[6px] h-[6px] rounded-full bg-[#D9D9D9]"></div>
                      </div>
                    </button>
                    
                    {/* 下拉菜单 */}
                    {dropdownOpen && (
                      <div 
                        className="absolute top-full right-0 mt-2 w-[160px] rounded-[8px] backdrop-blur-md border border-white/20 z-[9999] overflow-hidden"
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          transform: 'translateZ(0)',
                          willChange: 'auto'
                        }}
                      >
                        <div className="py-2">
                          {/* Change Style */}
                          <button 
                            className="w-full px-4 py-3 text-white text-sm font-medium text-left hover:bg-white/10 transition-colors relative"
                            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                            onClick={() => {
                              setDropdownOpen(false);
                              // 跳转到 fashion-design/create 页面，并传递图片URL和设置 Vary style
                              const encodedImageUrl = encodeURIComponent(image.image_url || '');
                              const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=11`;
                              console.log('跳转到 Change Style:', targetUrl);
                              router.push(targetUrl);
                            }}
                          >
                            Change Style
                            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          </button>
                          
                          {/* Change Printing */}
                          <button 
                            className="w-full px-4 py-3 text-white text-sm font-medium text-left hover:bg-white/10 transition-colors relative"
                            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                            onClick={() => {
                              setDropdownOpen(false);
                              // 跳转到 fashion-design/create 页面，并传递图片URL和设置 Change Printing
                              const encodedImageUrl = encodeURIComponent(image.image_url || '');
                              const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=9`;
                              console.log('跳转到 Change Printing:', targetUrl);
                              router.push(targetUrl);
                            }}
                          >
                            Change Printing
                            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          </button>
                          
                          {/* Change Fabric */}
                          <button 
                            className="w-full px-4 py-3 text-white text-sm font-medium text-left hover:bg-white/10 transition-colors relative"
                            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                            onClick={() => {
                              setDropdownOpen(false);
                              // 跳转到 fashion-design/create 页面，并传递图片URL和设置 Change Fabric
                              const encodedImageUrl = encodeURIComponent(image.image_url || '');
                              const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=8`;
                              console.log('跳转到 Change Fabric:', targetUrl);
                              router.push(targetUrl);
                            }}
                          >
                            Change Fabric
                            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          </button>
                          
                          {/* Change Color */}
                          <button 
                            className="w-full px-4 py-3 text-white text-sm font-medium text-left hover:bg-white/10 transition-colors"
                            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                            onClick={() => {
                              setDropdownOpen(false);
                              // 跳转到 magic-kit/create 页面，并传递图片URL和设置 Change Color
                              const encodedImageUrl = encodeURIComponent(image.image_url || '');
                              const targetUrl = `/magic-kit/create?imageUrl=${encodedImageUrl}&variationType=1`;
                              console.log('跳转到 Change Color:', targetUrl);
                              router.push(targetUrl);
                            }}
                          >
                            Change Color
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 下半部分 - 预留给后续内容 */}
              <div className="px-8 pb-6">
                {/* 下半部分内容稍后补充 */}
              </div>
            </div>
          </div>
        </div>

        {/* 下半部分：标题 + 5 张相关图片 */}
        <div className="px-6 pb-4 pt-2 flex flex-col">
          <div 
            className="text-white text-base font-medium mb-3"
            style={{ fontFamily: "'Neue Machina Regular', system-ui, sans-serif" }}
          >
            More like this
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
