'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getFrontendImages, getFrontendImageDetail } from '@/lib/api/common';
import { FrontendImageItem, SimilarImageItem } from '@/types/frontendImages';

// 定义样式和动画（移除重复的字体定义）
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

  .image-grid-container {
    min-height: 400px; /* 防止高度跳动 */
  }

  /* 自定义滚动条样式 */
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  /* 隐藏弹窗滚动条 */
  .dialog-content-stable .dialog-scroll-hidden {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .dialog-content-stable .dialog-scroll-hidden::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  /* 下拉菜单动画优化 */
  .dropdown-menu {
    transform: translateZ(0);
    will-change: auto;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  /* 弹窗内容稳定性优化 */
  .dialog-content-stable {
    contain: layout style;
    will-change: auto;
  }

  /* 响应式弹窗优化 */
  @media (max-width: 640px) {
    .dialog-content-stable {
      width: 95vw !important;
      max-width: 95vw !important;
      margin: 0 !important;
      max-height: 95vh !important;
    }
  }

  @media (max-width: 768px) {
    .dialog-content-stable {
      width: 90vw !important;
      max-width: 90vw !important;
    }
  }

  @media (max-width: 1024px) {
    .dialog-content-stable {
      width: 85vw !important;
      max-width: 85vw !important;
    }
  }

  /* 图片容器稳定性 */
  .image-container-stable {
    contain: layout;
    will-change: auto;
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
`;

interface DesignFilterSectionProps {
  className?: string;
  initialSelectedImage?: FrontendImageItem;
}

// 优化图片组件，使用memo防止重渲染
const MemoizedImageWithSkeleton = memo(function ImageWithSkeleton({ 
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
        className="object-cover block transition-all duration-500 ease-in-out"
        onLoad={() => setLoaded(true)}
        loading="lazy"
        quality={85}
        style={{ 
          opacity: loaded ? 1 : 0, 
          transition: 'opacity 500ms ease-in-out, transform 300ms ease-in-out',
          transform: loaded ? 'scale(1)' : 'scale(1.05)'
        }}
      />
      {!loaded && (
        <div className="absolute inset-0 z-20">
          <Skeleton className="w-full h-full bg-white/10 animate-pulse rounded-md" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
        <div className="flex justify-center pointer-events-auto">
          <Button
            variant="ghost"
            className="w-full bg-white hover:bg-white/90 text-black rounded-md py-3 backdrop-blur-sm transition-all duration-200"
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
        className="group relative w-full overflow-hidden rounded-md cursor-pointer transition-all duration-300 ease-in-out block"
        style={{ aspectRatio: '3 / 4' }}
        onClick={(e) => {
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
      className="group relative w-full overflow-hidden rounded-md cursor-pointer transition-all duration-300 ease-in-out"
      style={{ aspectRatio: '3 / 4' }}
      onClick={onClick}
    >
      {content}
    </div>
  );
});

// 检查是否为移动端的工具函数
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024; // lg断点
};

// 优化图片网格组件
const MemoizedImageGrid = memo(function ImageGridSection({
  isInitialLoading,
  allImages,
  pendingAddCount,
  openDetailAt
}: {
  isInitialLoading: boolean;
  allImages: any[];
  pendingAddCount: number;
  openDetailAt: (idx: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 transition-all duration-300 ease-in-out">
      {isInitialLoading
        ? Array.from({ length: 20 }).map((_, idx) => (
            <div 
              key={idx} 
              className="group relative w-full overflow-hidden rounded-md cursor-pointer transition-all duration-300 ease-in-out" 
              style={{ aspectRatio: '3 / 4' }}
            >
              <Skeleton className="w-full h-full bg-white/10 animate-pulse rounded-md" />
            </div>
          ))
        : allImages.map((img, idx) => (
            <div
              key={img.id}
              className="transform transition-all duration-300 ease-in-out hover:scale-105"
              style={{ 
                animationDelay: `${idx * 50}ms`,
                animation: 'fadeInUp 0.3s ease-out forwards'
              }}
            >
              <MemoizedImageWithSkeleton
                src={img.image_url}
                alt={img.clothing_description || ''}
                href={isMobile() ? `/designs/${img.slug}` : undefined}
                onClick={() => openDetailAt(idx)}
              />
            </div>
          ))}
      {!isInitialLoading && pendingAddCount > 0 &&
        Array.from({ length: pendingAddCount }).map((_, idx) => (
          <div 
            key={`pending-${idx}`} 
            className="group relative w-full overflow-hidden rounded-md cursor-pointer transition-all duration-300 ease-in-out" 
            style={{ aspectRatio: '3 / 4' }}
          >
            <Skeleton className="w-full h-full bg-white/10 animate-pulse rounded-md" />
          </div>
        ))}
    </div>
  );
});

// 相似图片推荐组件
const SimilarImagesSection = memo(function SimilarImagesSection({
  selectedItem,
  openDetailAt,
  allImages
}: {
  selectedItem: FrontendImageItem;
  openDetailAt: (idx: number) => void;
  allImages: FrontendImageItem[];
}) {
  const [similarImages, setSimilarImages] = useState<SimilarImageItem[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);

  useEffect(() => {
    const loadSimilarImages = async () => {
      try {
        const response = await getFrontendImageDetail({
          slug: selectedItem.slug
        });
        
        if (response.code === 0 && response.data) {
          setSimilarImages(response.data.similar_images || []);
        }
      } catch (error) {
        console.error('Failed to load similar images:', error);
        // 回退到简单筛选逻辑
        const fallbackImages = allImages
          .filter(img => img.id !== selectedItem.id && img.type === selectedItem.type && img.gender === selectedItem.gender)
          .slice(0, 5);
        setSimilarImages(fallbackImages.map(img => ({ ...img, similarity_score: 0 })));
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    loadSimilarImages();
  }, [selectedItem.slug, selectedItem.id, selectedItem.type, selectedItem.gender, allImages]);

  if (isLoadingSimilar) {
    return Array.from({ length: 5 }).map((_, idx) => (
      <div key={`loading-similar-${idx}`} className="w-full overflow-hidden rounded-md" style={{ aspectRatio: '3 / 4' }}>
        <Skeleton className="w-full h-full bg-white/10" />
      </div>
    ));
  }

  return similarImages.map((img, idx) => {
    const originalIndex = allImages.findIndex(item => item.id === img.id);
    return (
      <div
        key={`similar-${img.id}-${idx}`}
        className="w-full overflow-hidden rounded-md cursor-pointer relative group"
        style={{ aspectRatio: '3 / 4' }}
        onClick={() => {
          if (originalIndex >= 0) openDetailAt(originalIndex);
        }}
      >
        <MemoizedImageWithSkeleton
          src={img.image_url}
          alt={img.clothing_description || ''}
          href={isMobile() ? (img.slug ? `/designs/${img.slug}` : undefined) : undefined}
          onClick={() => {
            if (originalIndex >= 0) openDetailAt(originalIndex);
          }}
        />

      </div>
    );
  });
});

// 修改设计功能卡片组件
const ModifyDesignCard = memo(function ModifyDesignCard({
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
      className="flex items-center gap-2 p-2 rounded-sm cursor-pointer transition-all duration-200 hover:bg-white/25 flex-shrink-0 min-w-0"
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        border: '0.4px solid rgba(255, 255, 255, 0.4)',
        width: 'calc(25% - 6px)'
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

export default function DesignFilterSection({ className = '', initialSelectedImage }: DesignFilterSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(['All']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // 图片数据与懒加载
  const [allImages, setAllImages] = useState<FrontendImageItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingMoreRef = useRef(false);
  const [pendingAddCount, setPendingAddCount] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dialogImageLoaded, setDialogImageLoaded] = useState(false);

  const categories = [
    { id: 'Evening Wear', label: 'Evening Wear' },
    { id: 'Casual', label: 'Casual' },
    { id: 'Professional', label: 'Professional' },
    { id: 'Sportswear', label: 'Sportswear' },
    { id: 'Kidswear', label: 'Kidswear' }
  ];

  const genderOptions = [
    { id: 'All', label: 'All' },
    { id: 'Female', label: 'Female' },
    { id: 'Male', label: 'Male' }
  ];

  // 字体加载状态管理
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

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGenderSelect = (genderId: string) => {
    // 改为单选模式
    setSelectedGenders([genderId]);
    setIsFiltering(true); // 设置筛选状态
    
    // 自动收缩列表
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleCategorySelect = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
    setIsFiltering(true); // 设置筛选状态
  };

  const getSelectedGenderLabels = () => {
    if (selectedGenders.length === 0) return 'All';
    return selectedGenders.map(id => 
      genderOptions.find(option => option.id === id)?.label
    ).join(', ');
  };

  // 加载图片数据的函数
  const loadImages = async (page: number, reset = false) => {
    try {
      setLastError(null); // 清除之前的错误
      
      const params: any = {
        page,
        page_size: 20
      };

      // 添加筛选条件
      if (selectedCategories.length > 0) {
        params.type = selectedCategories.join(',');
      }
      if (selectedGenders.length > 0 && !selectedGenders.includes('All')) {
        params.gender = selectedGenders.join(',');
      }

      const response = await getFrontendImages(params);
      
      console.log('API Response:', {
        code: response.code,
        page: response.data?.page,
        page_size: response.data?.page_size,
        total: response.data?.total,
        has_more: response.data?.has_more,
        listLength: response.data?.list?.length
      });
      
      // 检查API是否返回错误
      if (response.code !== 0) {
        console.error('API returned error:', response.msg);
        setLastError(response.msg || 'API error occurred');
        if (reset) {
          setAllImages([]);
          setHasMore(false);
          setCurrentPage(1);
        }
        return;
      }
      
      // 调试信息：计算预期的has_more值
      const expectedHasMore = (response.data?.page * response.data?.page_size) < response.data?.total;
      console.log('Debug - Expected has_more:', expectedHasMore, 'Actual has_more:', response.data?.has_more);
      
      if (response.data) {
        const newImages = response.data.list || [];
        if (reset) {
          setAllImages(newImages);
          setCurrentPage(1);
        } else {
          setAllImages(prev => [...prev, ...newImages]);
          setCurrentPage(page);
        }
        // 使用我们自己的逻辑来计算has_more，而不完全依赖后端
        const calculatedHasMore = (page * 20) < response.data.total;
        console.log('Setting hasMore to:', calculatedHasMore, 'based on page:', page, 'total:', response.data.total);
        setHasMore(calculatedHasMore);
        
        // 成功加载后重置重试计数
        setRetryCount(0);
      }
    } catch (error: any) {
      console.error('Failed to load images:', error);
      
      // 设置错误信息
      let errorMessage = 'Network connection failed';
      if (error?.message?.includes('ECONNRESET') || error?.cause?.code === 'ECONNRESET') {
        errorMessage = 'Connection interrupted, please try again';
      } else if (error?.status === 404) {
        errorMessage = 'API endpoint not found (404)';
      } else if (error?.status === 500) {
        errorMessage = 'Server internal error (500), please try again';
      } else if (error?.status >= 500) {
        errorMessage = `Server error (${error.status}), please try again later`;
      } else if (error?.message?.includes('HTTP error')) {
        errorMessage = error.message;
      }
      
      console.error('📍 Detailed error info:', {
        message: error?.message,
        status: error?.status,
        cause: error?.cause,
        name: error?.name
      });
      
      setLastError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      // 如果API调用失败，显示空状态
      if (reset) {
        setAllImages([]);
        setHasMore(false);
        setCurrentPage(1);
      }
    } finally {
      // 重置筛选状态
      setIsFiltering(false);
      if (reset) {
        setIsInitialLoading(false);
      } else {
        setIsLoadingMore(false);
        isLoadingMoreRef.current = false;
      }
    }
  };

  // 手动重试函数
  const handleRetry = () => {
    setRetryCount(0);
    setLastError(null);
    loadImages(1, true);
  };

  // 初始加载和筛选变化时重新加载（优化防抖）
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const loadInitial = async () => {
      if (!isMounted) return;
      setIsInitialLoading(true);
      await loadImages(1, true);
      if (isMounted) {
        setIsInitialLoading(false);
      }
    };
    
    // 减少防抖延迟到150ms以减少闪烁
    timeoutId = setTimeout(loadInitial, 150);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedCategories.join(','), selectedGenders.join(',')]);

  // 触底加载：当哨兵元素接近视口时，加载下一页
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        console.log('Sentinel visibility:', {
          isIntersecting: entry.isIntersecting,
          isLoadingMore: isLoadingMore,
          hasMore: hasMore,
          currentPage: currentPage,
          allImagesCount: allImages.length
        });
        
        if (
          entry.isIntersecting &&
          !isLoadingMoreRef.current &&
          hasMore &&
          !isLoadingMore
        ) {
          console.log('Triggering next page load...');
          isLoadingMoreRef.current = true;
          setIsLoadingMore(true);
          setPendingAddCount(20);
          
          // 加载下一页
          loadImages(currentPage + 1, false).finally(() => {
            setPendingAddCount(0);
            setIsLoadingMore(false);
            isLoadingMoreRef.current = false;
          });
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );
    observerRef.current.observe(sentinelRef.current);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, currentPage, isLoadingMore, selectedCategories.join(','), selectedGenders.join(',')]);

  console.log('Component state:', { hasMore, currentPage, isLoadingMore, allImagesCount: allImages.length });


  // 使用useCallback优化openDetailAt函数
  const openDetailAt = useCallback(async (idx: number) => {
    const image = allImages[idx];
    if (!image) return;

    // 移动端直接跳转到详情页
    if (isMobile()) {
      router.push(`/designs/${image.slug}`);
      return;
    }

    // 桌面端显示弹窗
    // 先重置状态，防止布局抖动
    setDialogImageLoaded(false);
    setSelectedIndex(idx);
    
    // 确保字体已加载后再打开弹窗
    if (!fontsLoaded) {
      // 如果字体未加载完成，等待一小段时间
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setDetailOpen(true);
    
      // 使用浏览器历史记录API更新URL，不进行页面跳转
      const newUrl = `/designs/${image.slug}`;
      window.history.pushState({}, '', newUrl);
      
      try {
        const detailResponse = await getFrontendImageDetail({ record_id: image.record_id });
        if (detailResponse.code === 0) {
          console.log('Image detail loaded:', detailResponse.data);
        }
      } catch (error) {
        console.error('Failed to load image detail:', error);
      }
  }, [allImages, fontsLoaded, router]);

  const selectedItem = selectedIndex != null ? allImages[selectedIndex] : null;

  // 处理弹窗关闭
  const handleDialogClose = useCallback((open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      // 关闭弹窗时，如果当前在 /designs/slug 页面，则回到 /designs
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/designs/') && currentPath !== '/designs') {
        window.history.pushState({}, '', '/designs');
      }
    }
  }, []);

  // 处理初始选中图片
  useEffect(() => {
    if (initialSelectedImage && allImages.length > 0) {
      const imageIndex = allImages.findIndex(img => img.slug === initialSelectedImage.slug);
      if (imageIndex >= 0) {
        setSelectedIndex(imageIndex);
        setDetailOpen(true);
        setDialogImageLoaded(false);
      }
    }
  }, [initialSelectedImage, allImages]);

  // 监听浏览器前进/后退按钮
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/designs') {
        // 如果回到 /designs，关闭弹窗
        setDetailOpen(false);
        setSelectedIndex(null);
      } else if (currentPath.startsWith('/designs/') && currentPath !== '/designs') {
        // 如果跳转到 /designs/slug，打开对应的弹窗
        const slug = currentPath.replace('/designs/', '');
        const imageIndex = allImages.findIndex(img => img.slug === slug);
        if (imageIndex >= 0) {
          setSelectedIndex(imageIndex);
          setDetailOpen(true);
          setDialogImageLoaded(false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allImages]);

  return (
    <section
      className={`relative py-12 px-4 ${className}`}
      style={{
        backgroundImage: 'url(/images/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* 注入组件样式 */}
      <style dangerouslySetInnerHTML={{ __html: componentStyles }} />
      <div className="absolute inset-0 bg-black" aria-hidden />
      <div className="relative mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="flex flex-col gap-6">
          {/* 移动端: Sort by 标题行 */}
          <div className="flex items-center justify-between lg:hidden">
            <span 
              className="text-base"
              style={{
                fontWeight: '400',
                fontSize: '16px',
                lineHeight: '1.375',
                color: '#cdccd3'
              }}
            >
              Sort by: 
            </span>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setIsFiltering(true);
              }}
              className="text-white/80 hover:text-white text-sm underline transition-colors cursor-pointer"
              style={{
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '1.375'
              }}
            >
              Clear all
            </button>
          </div>

          {/* 移动端: 选择按钮行 */}
          <div className="flex flex-wrap gap-3 lg:hidden">
            {/* Sort by 下拉框 */}
            <div className="relative">
              <div 
                className="flex items-center justify-between px-2 sm:px-4 h-8 sm:h-10 cursor-pointer backdrop-blur-lg rounded-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  minWidth: '100px',
                  width: 'auto'
                }}
                onClick={handleDropdownToggle}
              >
                  <span 
                  className="text-base whitespace-nowrap"
                    style={{
                    fontWeight: '400',
                    fontSize: '16px',
                    lineHeight: '1.375',
                    color: '#FFFFFF'
                  }}
                >
                  {getSelectedGenderLabels()}
                </span>
                <div className="w-3 h-3 flex items-center justify-center ml-2 flex-shrink-0">
                  <svg 
                    width="12" 
                    height="7" 
                    viewBox="0 0 12 7" 
                    fill="none"
                    className={`text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path 
                      d="M1 1L6 6L11 1" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* 下拉列表 */}
              {isDropdownOpen && (
                <div 
                  className="absolute top-12 left-0 z-50 backdrop-blur-xl border border-white/20 rounded-md shadow-lg"
                  style={{ 
                    width: '180px',
                    transform: 'translateZ(0)',
                    willChange: 'auto',
                    background: 'rgba(255, 255, 255, 0.18)'
                  }}
                >
                  {genderOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-center px-3 h-10 hover:bg-white/10 cursor-pointer transition-colors"
                      style={{
                        borderBottom: index < genderOptions.length - 1 ? '0.50px rgba(255, 255, 255, 0.40) solid' : 'none'
                      }}
                      onClick={() => handleGenderSelect(option.id)}
                    >
                      <div className="flex-1 flex items-center justify-between">
                        <span 
                          className="text-white text-base"
                          style={{
                            fontWeight: '400',
                            fontSize: '16px',
                            lineHeight: '1.375'
                          }}
                        >
                          {option.label}
                        </span>
                        {selectedGenders.includes(option.id) && (
                          <div className="w-4 h-4 flex items-center justify-center">
                            <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
                              <path 
                                d="M1.5 4.5L5 7.5L11.5 1" 
                                stroke="#FFFFFF" 
                                strokeWidth="0.4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 类别标签 */}
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  className={`px-2 sm:px-3 h-8 sm:h-10 rounded-md flex items-center gap-2 sm:gap-3 cursor-pointer transition-all duration-200 backdrop-blur-xl ${
                    isSelected 
                      ? 'text-black' 
                      : 'text-white hover:bg-white/10'
                  }`}
                  style={{
                    background: isSelected 
                      ? '#FFFFFF' 
                      : 'rgba(255, 255, 255, 0.18)',
                    border: isSelected 
                      ? '1px solid transparent'
                      : '0.4px solid rgba(255, 255, 255, 0.4)',
                    backgroundImage: isSelected
                      ? 'linear-gradient(#FFFFFF, #FFFFFF)'
                      : 'none',
                    backgroundOrigin: isSelected ? 'border-box' : 'padding-box',
                    backgroundClip: isSelected ? 'padding-box, border-box' : 'padding-box'
                  }}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <span 
                    className="text-sm sm:text-base"
                    style={{
                      fontWeight: '500',
                      lineHeight: '1.375'
                    }}
                  >
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 桌面端: Sort by 和类别标签在同一水平线 */}
          <div className="hidden lg:flex flex-row items-center justify-between gap-6">
            {/* Sort by 下拉框 */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <span 
                  className="text-base"
                  style={{
                      fontWeight: '400',
                      fontSize: '16px',
                      lineHeight: '1.375',
                      color: '#cdccd3'
                    }}
                  >
                    Sort by: 
                  </span>
                <div 
                  className="flex items-center justify-between px-4 h-10 cursor-pointer backdrop-blur-lg rounded-md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.18)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    minWidth: '100px',
                    width: 'auto'
                  }}
                  onClick={handleDropdownToggle}
                >
                  <span 
                    className="text-base whitespace-nowrap"
                    style={{
                      fontWeight: '400',
                      fontSize: '16px',
                      lineHeight: '1.375',
                      color: '#FFFFFF'
                    }}
                  >
                    {getSelectedGenderLabels()}
                  </span>
                  <div className="w-3 h-3 flex items-center justify-center ml-2 flex-shrink-0">
                  <svg 
                    width="12" 
                    height="7" 
                    viewBox="0 0 12 7" 
                    fill="none"
                    className={`text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path 
                      d="M1 1L6 6L11 1" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  </div>
                </div>
              </div>

              {/* 下拉列表 */}
              {isDropdownOpen && (
                <div 
                  className="absolute top-12 left-[65px] z-50 backdrop-blur-xl border border-white/20 rounded-md shadow-lg"
                  style={{ 
                    width: '180px',
                    transform: 'translateZ(0)',
                    willChange: 'auto',
                    background: 'rgba(255, 255, 255, 0.18)'
                  }}
                >
                  {genderOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-center px-3 h-10 hover:bg-white/10 cursor-pointer transition-colors"
                      style={{
                        borderBottom: index < genderOptions.length - 1 ? '0.50px rgba(255, 255, 255, 0.40) solid' : 'none'
                      }}
                      onClick={() => handleGenderSelect(option.id)}
                    >
                      <div className="flex-1 flex items-center justify-between">
                        <span 
                          className="text-white text-base"
                          style={{
                            fontWeight: '400',
                            fontSize: '16px',
                            lineHeight: '1.375'
                          }}
                        >
                          {option.label}
                        </span>
                        {selectedGenders.includes(option.id) && (
                          <div className="w-4 h-4 flex items-center justify-center">
                            <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
                              <path 
                                d="M1.5 4.5L5 7.5L11.5 1" 
                                stroke="#FFFFFF" 
                                strokeWidth="0.4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 右侧类别标签 */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    className={`px-2 sm:px-3 h-8 sm:h-10 rounded-md flex items-center gap-2 sm:gap-3 cursor-pointer transition-all duration-200 backdrop-blur-xl ${
                      isSelected 
                        ? 'text-black' 
                        : 'text-white hover:bg-white/10'
                    }`}
                    style={{
                      background: isSelected 
                        ? '#FFFFFF' 
                        : 'rgba(255, 255, 255, 0.18)',
                      border: isSelected 
                        ? '1px solid transparent'
                        : '0.4px solid rgba(255, 255, 255, 0.4)'
                    }}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <span 
                      className="text-sm sm:text-base"
                      style={{
                        fontWeight: '500',
                        lineHeight: '1.375'
                      }}
                    >
                      {category.label}
                    </span>
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={isSelected 
                          ? '/marketing/images/design/bingos.svg' 
                          : '/marketing/images/design/add.svg'
                        }
                        alt={isSelected ? 'Selected' : 'Add'}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 桌面端: Clear all */}
          <div className="hidden lg:flex justify-end">
            <button
              onClick={() => {
                setSelectedCategories([]);
                setIsFiltering(true);
              }}
              className="text-white/80 hover:text-white text-sm underline transition-colors cursor-pointer"
              style={{
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '1.375'
              }}
            >
              Clear all
            </button>
          </div>


        </div>
        {/* 图片网格：4列，分页懒加载 */}
        <div className="mt-10 image-grid-container">
          {/* 筛选状态指示器 */}
          {isFiltering && (
            <div className="mb-4 flex items-center justify-center">
              {/* <div className="flex items-center gap-2 text-white/60 text-sm">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>筛选中...</span>
              </div> */}
            </div>
          )}
          
          {/* 空状态显示 */}
          {!isInitialLoading && !isFiltering && allImages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-white/60">
              <div className="w-16 h-16 mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </div>
              {lastError ? (
                <>
                  <h3 className="text-lg font-medium mb-2 text-red-400">Connection Error</h3>
                  <p className="text-sm text-center max-w-md mb-4">
                    {lastError}
                  </p>
                  {/* <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm transition-colors"
                  >
                    Retry {retryCount > 0 && `(${retryCount})`}
                  </button> */}
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-2">No designs available</h3>
                  <p className="text-sm text-center max-w-md">
                    Unable to load designs at the moment. Please check your connection and try again later.
                  </p>
                </>
              )}
            </div>
          )}
          
          <MemoizedImageGrid
            isInitialLoading={isInitialLoading || isFiltering}
            allImages={allImages}
            pendingAddCount={pendingAddCount}
            openDetailAt={openDetailAt}
          />
          {/* 触发加载的哨兵元素和手动加载按钮 */}
          <div ref={sentinelRef} className="h-20 flex flex-col items-center justify-center text-white/60 text-sm gap-2">
            {hasMore ? (
              <>
                {/* <div>Page {currentPage} - Scroll to load more...</div> */}
                <button
                  onClick={() => {
                    if (!isLoadingMore && hasMore) {
                      setIsLoadingMore(true);
                      setPendingAddCount(20);
                      loadImages(currentPage + 1, false).finally(() => {
                        setPendingAddCount(0);
                        setIsLoadingMore(false);
                      });
                    }
                  }}
                  disabled={isLoadingMore}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white text-sm transition-colors disabled:opacity-50"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
              </>
            ) : (
              <div>End of design list</div>
            )}
          </div>
        </div>
      </div>
       {/* 详情弹窗 - 仅桌面端显示 */}
       {detailOpen && !isMobile() && (
        <Dialog open={detailOpen} onOpenChange={handleDialogClose}>
          <DialogContent
            closeBtnUnvisible={true}
            overlayVisible={true}
            className="w-[95vw] max-w-4xl max-h-[95vh] bg-black/90 border border-white/10 rounded-2xl overflow-hidden dialog-content-stable mx-auto"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999
            }}
          >
          <DialogTitle className="sr-only">Image Detail</DialogTitle>
          {/* 可滚动的弹窗内容 */}
          <div className="max-h-[calc(95vh-2rem)] overflow-y-auto dialog-scroll-hidden">
            {/* 响应式布局 */}
            <div className="flex flex-col min-h-full gap-4 p-0.5 sm:p-1">
            {/* 上半部分：响应式布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 overflow-visible">
              {/* 左侧图片（无圆角） - 响应式尺寸 */}
              <div className="w-full aspect-[3/4] bg-black flex items-center justify-center relative image-container-stable">
                {/* 弹窗图片骨架屏 */}
                {!dialogImageLoaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <Skeleton className="w-full h-full bg-white/10 animate-pulse" />
                  </div>
                )}
                
                {selectedItem ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.clothing_description || ''}
                    className="w-full h-full object-cover"
                    style={{
                      opacity: dialogImageLoaded ? 1 : 0,
                      transition: 'opacity 300ms ease',
                      transform: 'translateZ(0)',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                    onLoad={() => setDialogImageLoaded(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="w-[90%] h-[90%] bg-white/10 animate-pulse" />
                  </div>
                )}
              </div>
              {/* 右侧内容 - 响应式高度 */}
              <div className="w-full aspect-[3/4] text-white overflow-visible relative"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                {/* 关闭按钮 */}
                <button
                  onClick={() => handleDialogClose(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* 右侧内容分为上下两部分 */}
                <div className="h-full flex flex-col justify-between overflow-visible">
                  {/* 上半部分 - 标题和标签 */}
                  <div className="flex-1 px-2 sm:px-3 lg:px-4 py-4 sm:py-6 flex flex-col justify-center overflow-visible">
                    {/* 标题 */}
                    <h2 
                      className={`text-white text-lg sm:text-xl lg:text-2xl leading-[1.2] max-w-full lg:max-w-[498px] mb-4 sm:mb-6 instrument-sans transition-opacity duration-300 ${
                        fontsLoaded ? 'opacity-100' : 'opacity-90'
                      }`}
                    >
                      {selectedItem?.clothing_description || 'Fashion Design'}
                    </h2>
                    
                    {/* 标签组 */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center gap-1 px-0 py-[11px] h-7 bg-transparent">
                        <span className="text-[#ffffff] text-sm font-medium">#</span>
                        <span 
                          className="text-white text-xs font-medium leading-[1.833] text-center instrument-sans"
                        >
                          {selectedItem?.type || 'Fashion'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1 px-0 py-[11px] h-7 bg-transparent">
                        <span className="text-[#ffffff] text-sm font-medium">#</span>
                        <span 
                          className="text-white text-xs font-medium leading-[1.833] text-center instrument-sans"
                        >
                          {selectedItem?.gender || 'Unisex'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1 px-0 py-[11px] h-7 bg-transparent">
                        <span className="text-[#ffffff] text-sm font-medium">#</span>
                        <span 
                          className="text-white text-xs font-normal leading-[1.833] text-center instrument-sans"
                        >
                          {selectedItem?.feature || 'AI Generated'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Generated by 文字紧跟标签组 */}
                  
                  </div>
                  
                  {/* 下半部分 - 按钮组 */}
                  <div className="px-2 sm:px-3 lg:px-4 pb-6 flex flex-col">
                    {/* 按钮组 - 响应式布局 */}
                    <div className="flex flex-col items-stretch gap-3">
                      {/* Generate Similar Designs 按钮 */}
                      <div className="flex flex-col">
                        <button 
                          className="flex items-center justify-center gap-2.5 px-3 py-[11px] w-full h-[42px] rounded-[4px] text-black text-sm font-medium leading-[1.1] text-center cursor-pointer hover:bg-gray-100 transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none active:outline-none"
                          style={{ 
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Generate Similar Designs clicked!');
                            if (selectedItem) {
                              // 跳转到 fashion-design/create 页面，并传递 complete_prompt 参数
                              const encodedPrompt = encodeURIComponent(selectedItem.complete_prompt || '');
                              const targetUrl = `/fashion-design/create?prompt=${encodedPrompt}&tab=text-to-image`;
                              console.log('跳转到:', targetUrl);
                              console.log('原始提示词:', selectedItem.complete_prompt);
                              router.push(targetUrl);
                            }
                          }}
                        >
                          Generate Similar Designs
                        </button>
                        {/* 下划线 */}
                        <div className="w-full h-px bg-white/15 mt-4"></div>
                      </div>
                      
                      {/* Or modify the design 文字 */}
                      <div className="mt-2 mb-3">
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
                            if (selectedItem) {
                              const encodedImageUrl = encodeURIComponent(selectedItem.image_url || '');
                              const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=8`;
                              router.push(targetUrl);
                            }
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
                            if (selectedItem) {
                              const encodedImageUrl = encodeURIComponent(selectedItem.image_url || '');
                              const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=11`;
                              router.push(targetUrl);
                            }
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
                            if (selectedItem) {
                              const encodedImageUrl = encodeURIComponent(selectedItem.image_url || '');
                              const targetUrl = `/magic-kit/create?imageUrl=${encodedImageUrl}&variationType=1`;
                              router.push(targetUrl);
                            }
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
                            if (selectedItem) {
                              const encodedImageUrl = encodeURIComponent(selectedItem.image_url || '');
                              const targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=9`;
                              router.push(targetUrl);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 下半部分：标题 + 相关图片 - 响应式布局 */}
            <div className="px-1 sm:px-2 pb-4 sm:pb-6 flex flex-col flex-shrink-0">
              <div className="flex items-center justify-center mb-3 mt-6">
                <div className="flex-1 h-px bg-gray-600"></div>
                <div 
                  className="text-white text-base sm:text-lg font-medium mx-4"
                >
                  More Like This
                </div>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                {(() => {
                  // 使用新的相似度推荐逻辑
                  if (selectedItem) {
                    // 如果有选中的图片，显示基于相似度的推荐
                    return (
                      <SimilarImagesSection 
                        selectedItem={selectedItem} 
                        openDetailAt={openDetailAt}
                        allImages={allImages}
                      />
                    );
                  } else {
                    // 如果没有选中图片，显示前5张图片
                    const relatedImages = allImages.slice(0, 5);
                    return relatedImages.map((img, idx) => {
                      const originalIndex = allImages.findIndex(item => item.id === img.id);
                      return (
                        <div
                          key={`related-${img.id}-${idx}`}
                          className="w-full overflow-hidden rounded-md cursor-pointer relative"
                          style={{ aspectRatio: '3 / 4' }}
                          onClick={() => {
                            if (originalIndex >= 0) openDetailAt(originalIndex);
                          }}
                        >
                          <MemoizedImageWithSkeleton
                            src={img.image_url}
                            alt={img.clothing_description || ''}
                            href={isMobile() ? `/designs/${img.slug}` : undefined}
                            onClick={() => {
                              if (originalIndex >= 0) openDetailAt(originalIndex);
                            }}
                          />
                        </div>
                      );
                    });
                  }
                })()}
              </div>
            </div>
            </div>
          </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
