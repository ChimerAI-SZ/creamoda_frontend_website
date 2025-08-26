'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  placeholder?: React.ReactNode;
}

export default function LazyLoadWrapper({
  children,
  threshold = 0.1,
  rootMargin = '100px',
  className = '',
  placeholder
}: LazyLoadWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isVisible) {
      // 添加小延迟以确保平滑加载
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div 
      ref={elementRef}
      className={`lazy-load-wrapper ${className}`}
      style={{
        minHeight: isLoaded ? 'auto' : '200px', // 防止布局抖动
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {isLoaded ? (
        <div style={{ opacity: isLoaded ? 1 : 0 }}>
          {children}
        </div>
      ) : (
        placeholder || (
          <div className="lazy-loading-placeholder flex items-center justify-center h-48 bg-gray-100 rounded-lg">
            <div className="animate-pulse flex space-x-4 w-full p-4">
              <div className="rounded-full bg-gray-300 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
