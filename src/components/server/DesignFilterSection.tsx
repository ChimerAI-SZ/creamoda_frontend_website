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
`;

interface DesignFilterSectionProps {
  className?: string;
  initialSelectedImage?: FrontendImageItem;
}

// 优化图片组件，使用memo防止重渲染
const MemoizedImageWithSkeleton = memo(function ImageWithSkeleton({ 
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
      className="group relative w-full overflow-hidden rounded-md cursor-pointer transition-all duration-300 ease-in-out"
      style={{ aspectRatio: '3 / 4' }}
      onClick={onClick}
    >
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
          <Skeleton className="w-full h-full bg-white/10 animate-pulse" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
        <div className="flex justify-center pointer-events-auto">
          <Button
            variant="ghost"
            className="w-full bg-gray-800/70 hover:bg-gray-800/80 text-white rounded-md py-3 backdrop-blur-sm transition-all duration-200"
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
    <div className="grid grid-cols-4 gap-4 transition-all duration-300 ease-in-out">
      {isInitialLoading
        ? Array.from({ length: 20 }).map((_, idx) => (
            <div 
              key={idx} 
              className="w-full overflow-hidden rounded-md animate-pulse" 
              style={{ aspectRatio: '3 / 4' }}
            >
              <Skeleton className="w-full h-full bg-white/10" />
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
                onClick={() => openDetailAt(idx)}
              />
            </div>
          ))}
      {!isInitialLoading && pendingAddCount > 0 &&
        Array.from({ length: pendingAddCount }).map((_, idx) => (
          <div 
            key={`pending-${idx}`} 
            className="w-full overflow-hidden rounded-md animate-pulse" 
            style={{ aspectRatio: '3 / 4' }}
          >
            <Skeleton className="w-full h-full bg-white/10" />
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
          onClick={() => {
            if (originalIndex >= 0) openDetailAt(originalIndex);
          }}
        />

      </div>
    );
  });
});

// 下拉菜单组件 - 独立出来避免影响弹窗重新渲染
const DropdownMenu = memo(function DropdownMenu({
  isOpen,
  onClose,
  selectedItem,
  router
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: FrontendImageItem | null;
  router: any;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMenuAction = useCallback((action: string) => {
    onClose();
    if (selectedItem) {
      const encodedImageUrl = encodeURIComponent(selectedItem.image_url || '');
      let targetUrl = '';
      
      switch (action) {
        case 'style':
          targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=11`;
          break;
        case 'printing':
          targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=9`;
          break;
        case 'fabric':
          targetUrl = `/fashion-design/create?imageUrl=${encodedImageUrl}&tab=image-to-image&variationType=8`;
          break;
        case 'color':
          targetUrl = `/magic-kit/create?imageUrl=${encodedImageUrl}&variationType=1`;
          break;
      }
      
      if (targetUrl) {
        console.log(`跳转到 ${action}:`, targetUrl);
        router.push(targetUrl);
      }
    }
  }, [selectedItem, router, onClose]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[160px] rounded-[8px] backdrop-blur-md border border-white/20 z-[9999] overflow-hidden dropdown-menu"
      style={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="py-2">
        <button 
          className="w-full px-4 py-3 text-white text-sm font-medium text-left hover:bg-white/10 transition-colors relative"
          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          onClick={() => handleMenuAction('style')}
        >
          Change Style
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </button>
        
        <button 
          className="w-full px-4 py-3 text-white text-sm font-medium text-left hover:bg-white/10 transition-colors relative"
          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          onClick={() => handleMenuAction('printing')}
        >
          Change Printing
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </button>
        
        <button 
          className="w-full px-4 py-3 text-white text-sm font-medium text-left hover:bg-white/10 transition-colors relative"
          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          onClick={() => handleMenuAction('fabric')}
        >
          Change Fabric
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </button>
        
        <button 
          className="w-full px-4 py-3 text-white text-sm font-medium text-left hover:bg-white/10 transition-colors"
          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          onClick={() => handleMenuAction('color')}
        >
          Change Color
        </button>
      </div>
    </div>
  );
});

export default function DesignFilterSection({ className = '', initialSelectedImage }: DesignFilterSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(['Female']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // 图片数据与懒加载
  const [allImages, setAllImages] = useState<FrontendImageItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingMoreRef = useRef(false);
  const [pendingAddCount, setPendingAddCount] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogImageLoaded, setDialogImageLoaded] = useState(false);

  const categories = [
    { id: 'Evening Wear', label: 'Evening Wear' },
    { id: 'Casual', label: 'Casual' },
    { id: 'Professional', label: 'Professional' },
    { id: 'Sportswear', label: 'Sportswear' },
    { id: 'Kidswear', label: 'Kidswear' }
  ];

  const genderOptions = [
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
    const newSelectedGenders = selectedGenders.includes(genderId)
      ? selectedGenders.filter(id => id !== genderId)
      : [...selectedGenders, genderId];
    
    setSelectedGenders(newSelectedGenders);
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
    if (selectedGenders.length === 0) return '';
    if (selectedGenders.length === genderOptions.length) return 'All';
    return selectedGenders.map(id => 
      genderOptions.find(option => option.id === id)?.label
    ).join(', ');
  };

  // 加载图片数据的函数
  const loadImages = async (page: number, reset = false) => {
    try {
      const params: any = {
        page,
        page_size: 20
      };

      // 添加筛选条件
      if (selectedCategories.length > 0) {
        params.type = selectedCategories.join(',');
      }
      if (selectedGenders.length > 0) {
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
      }
    } catch (error) {
      console.error('Failed to load images:', error);
      // 如果API调用失败，显示空状态
      if (reset) {
        setAllImages([]);
        setHasMore(false);
        setCurrentPage(1);
      }
    } finally {
      // 重置筛选状态
      setIsFiltering(false);
    }
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
    // 先重置状态，防止布局抖动
    setDialogImageLoaded(false);
    setSelectedIndex(idx);
    
    // 确保字体已加载后再打开弹窗
    if (!fontsLoaded) {
      // 如果字体未加载完成，等待一小段时间
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setDetailOpen(true);
    
    const image = allImages[idx];
    if (image) {
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
    }
  }, [allImages, fontsLoaded]);

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
          {/* 第一行: Sort by 和类别标签在同一水平线 */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Sort by 下拉框 */}
            <div className="relative">
              <div 
                className="flex items-center justify-between px-3 h-10 bg-transparent cursor-pointer backdrop-blur-lg"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
                onClick={handleDropdownToggle}
              >
                <span className="text-base">
                  <span 
                    style={{
                      fontFamily: "'Neue Machina', system-ui, sans-serif",
                      fontWeight: '400',
                      fontSize: '16px',
                      lineHeight: '1.375',
                      color: '#cdccd3'
                    }}
                  >
                    Sort by: 
                  </span>
                  <span 
                    style={{
                      fontFamily: "'Neue Machina', system-ui, sans-serif",
                      fontWeight: '400',
                      fontSize: '16px',
                      lineHeight: '1.375',
                      color: '#FFFFFF',
                      marginLeft: '8px'
                    }}
                  >
                    {getSelectedGenderLabels()}
                  </span>
                </span>
                <div className="w-3 h-3 flex items-center justify-center ml-16">
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
                  className="absolute top-12 left-0 z-50 backdrop-blur-xl bg-black/40 border border-white/20 rounded-md shadow-lg"
                  style={{ 
                    width: '207px',
                    transform: 'translateZ(0)',
                    willChange: 'auto'
                  }}
                >
                  {genderOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center px-3 h-10 hover:bg-white/10 cursor-pointer transition-colors"
                      onClick={() => handleGenderSelect(option.id)}
                    >
                      <div className="flex-1 flex items-center justify-between">
                        <span 
                          className="text-white text-base"
                          style={{
                            fontFamily: "'Neue Machina', system-ui, sans-serif",
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
                    className={`px-3 h-10 rounded-md border flex items-center gap-3 cursor-pointer transition-all duration-200 backdrop-blur-xl ${
                      isSelected 
                        ? 'border-white/20 text-black' 
                        : 'border-white/20 text-white hover:bg-white/5'
                    }`}
                    style={{
                      background: isSelected 
                        ? '#BFB6FF' 
                        : 'rgba(36, 28, 70, 0.6)'
                    }}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <span 
                      style={{
                        fontFamily: "'Neue Machina', system-ui, sans-serif",
                        fontWeight: '400',
                        fontSize: '16px',
                        lineHeight: '1.375'
                      }}
                    >
                      {category.label}
                    </span>
                    <div className="w-3 h-3 flex items-center justify-center">
                      {isSelected ? (
                        // 勾号图标
                        <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
                          <path 
                            d="M1.5 4.5L5 7.5L11.5 1" 
                            stroke="#000000" 
                            strokeWidth="0.4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        // 加号图标
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path 
                            d="M6 1V11M1 6H11" 
                            stroke="#FFFFFF" 
                            strokeWidth="1" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
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
              <h3 className="text-lg font-medium mb-2">No designs available</h3>
              <p className="text-sm text-center max-w-md">
                Unable to load designs at the moment. Please check your connection and try again later.
              </p>
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
      {/* 详情弹窗 - 响应式优化 */}
      {detailOpen && (
        <Dialog open={detailOpen} onOpenChange={handleDialogClose}>
          <DialogContent
            closeBtnUnvisible={false}
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
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* 响应式布局 */}
            <div className="flex flex-col min-h-full gap-4 p-4 sm:p-6">
            {/* 上半部分：响应式布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 overflow-visible">
              {/* 左侧图片（圆角） - 响应式尺寸 */}
              <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px] rounded-xl overflow-hidden bg-black flex items-center justify-center relative image-container-stable">
                {/* 弹窗图片骨架屏 */}
                {!dialogImageLoaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <Skeleton className="w-full h-full bg-white/10" />
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
                    <Skeleton className="w-[90%] h-[90%] bg-white/10" />
                  </div>
                )}
              </div>
              {/* 右侧内容 - 响应式高度 */}
              <div className="w-full h-auto min-h-[250px] sm:min-h-[300px] lg:min-h-[350px] bg-[#0b0b0c]/60 rounded-xl text-white overflow-visible">
                {/* 右侧内容分为上下两部分 */}
                <div className="h-full flex flex-col overflow-visible">
                  {/* 上半部分 */}
                  <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col overflow-visible">
                    {/* 标题 */}
                    <h2 
                      className={`text-white text-xl sm:text-2xl lg:text-[32px] leading-[1.025] max-w-full lg:max-w-[498px] mb-4 sm:mb-6 title-stable transition-opacity duration-300 ${
                        fontsLoaded ? 'opacity-100' : 'opacity-90'
                      }`}
                    >
                      {selectedItem?.clothing_description || 'Fashion Design'}
                    </h2>
                    
                    {/* 标签组 */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center gap-0.5 px-0 py-[11px] h-7 bg-transparent">
                        <div className="w-[5px] h-[5px] rounded-full bg-[#704DFF]"></div>
                        <span 
                          className="text-white text-xs font-medium leading-[1.833] text-center ml-1"
                          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                        >
                          {selectedItem?.type || 'Fashion'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-0.5 px-0 py-[11px] h-7 bg-transparent">
                        <div className="w-[5px] h-[5px] rounded-full bg-[#704DFF]"></div>
                        <span 
                          className="text-white text-xs font-medium leading-[1.833] text-center ml-1"
                          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                        >
                          {selectedItem?.gender || 'Unisex'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-0.5 px-0 py-[11px] h-7 bg-transparent">
                        <div className="w-[5px] h-[5px] rounded-full bg-[#704DFF]"></div>
                        <span 
                          className="text-white text-xs font-normal leading-[1.833] text-center ml-1"
                          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                        >
                          {selectedItem?.feature || 'AI Generated'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Generated by 文字紧跟标签组 */}
                    <div className="mt-6">
                      <p 
                        className="text-white text-[10px] font-bold leading-[2.2] w-full"
                        style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                      >
                        Generated by Creamoda
                      </p>
                    </div>
                    
                    {/* 按钮组 - 响应式布局 */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 sm:mt-6 relative">
                      {/* Generate Similar Designs 按钮 */}
                      <button 
                        className="flex items-center justify-center gap-2.5 px-3 py-[11px] w-full sm:w-auto sm:flex-1 lg:w-[406px] h-[42px] rounded-[4px] text-white text-sm sm:text-base lg:text-[20px] font-bold leading-[1.1] text-center cursor-pointer hover:bg-opacity-80 transition-all duration-200"
                        style={{ 
                          backgroundColor: 'rgba(112, 77, 255, 0.37)',
                          fontFamily: "Manrope, system-ui, sans-serif"
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Generate Similar Designs clicked!');
                          if (selectedItem) {
                            // 跳转到 fashion-design/create 页面，并传递 clothing_description 参数
                            const encodedDescription = encodeURIComponent(selectedItem.clothing_description || '');
                            const targetUrl = `/fashion-design/create?prompt=${encodedDescription}&tab=text-to-image`;
                            console.log('跳转到:', targetUrl);
                            console.log('原始描述:', selectedItem.clothing_description);
                            router.push(targetUrl);
                          }
                        }}
                      >
                        <span className="hidden sm:inline">Generate Similar Designs</span>
                        <span className="sm:hidden">Generate Similar</span>
                      </button>
                      
                      {/* 三个点按钮 */}
                      <div className="relative">
                        <button 
                          className="flex items-center justify-center gap-2.5 px-3 py-[11px] w-full sm:w-[79px] h-[42px] rounded-[4px]"
                          style={{ backgroundColor: 'rgba(112, 77, 255, 0.37)' }}
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          <div className="flex items-center gap-1">
                            <div className="w-[6px] h-[6px] rounded-full bg-[#D9D9D9]"></div>
                            <div className="w-[6px] h-[6px] rounded-full bg-[#D9D9D9]"></div>
                            <div className="w-[6px] h-[6px] rounded-full bg-[#D9D9D9]"></div>
                          </div>
                        </button>
                        
                        {/* 下拉菜单 - 使用独立组件 */}
                        <DropdownMenu
                          isOpen={dropdownOpen}
                          onClose={() => setDropdownOpen(false)}
                          selectedItem={selectedItem}
                          router={router}
                        />
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

            {/* 下半部分：标题 + 相关图片 - 响应式布局 */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col">
              <div 
                className="text-white text-sm sm:text-base font-medium mb-3"
                style={{ fontFamily: "'Neue Machina Regular', system-ui, sans-serif" }}
              >
                More like this
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
