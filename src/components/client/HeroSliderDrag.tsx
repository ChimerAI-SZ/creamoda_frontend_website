'use client';

import { useEffect } from 'react';

interface HeroSliderDragProps {
  selectors?: string[];
}

export default function HeroSliderDrag({ selectors = ['hero-slider', 'feature-overview-track'] }: HeroSliderDragProps) {

  useEffect(() => {
    const setupDragForSlider = (slider: HTMLElement) => {

      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let startY = 0;
      let isHorizontalGesture = false;

      const handleMouseDown = (e: MouseEvent) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        slider.style.userSelect = 'none';
        
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        
        e.preventDefault();
      };

      const handleMouseLeave = () => {
        isDown = false;
        slider.style.cursor = 'grab';
        slider.style.userSelect = 'auto';
      };

      const handleMouseUp = () => {
        isDown = false;
        slider.style.cursor = 'grab';
        slider.style.userSelect = 'auto';
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
      };

      // Touch events for mobile dragging
      const handleTouchStart = (e: TouchEvent) => {
        if (!e.touches || e.touches.length === 0) return;
        const touch = e.touches[0];
        isDown = true;
        isHorizontalGesture = false;
        startX = touch.pageX - slider.offsetLeft;
        startY = touch.pageY;
        scrollLeft = slider.scrollLeft;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDown || !e.touches || e.touches.length === 0) return;
        const touch = e.touches[0];
        const deltaX = touch.pageX - slider.offsetLeft - startX;
        const deltaY = touch.pageY - startY;
        // Detect horizontal intent to avoid blocking vertical page scroll
        if (!isHorizontalGesture) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            isHorizontalGesture = true;
          } else {
            return; // let vertical scrolling happen
          }
        }
        // Prevent vertical scroll when horizontally dragging the slider
        e.preventDefault();
        slider.scrollLeft = scrollLeft - deltaX * 2;
      };

      const handleTouchEnd = () => {
        isDown = false;
      };

      // 设置样式和监听
      slider.style.cursor = 'grab';
      slider.style.setProperty('-webkit-overflow-scrolling', 'touch');
      slider.style.overflowX = 'auto';
      slider.style.setProperty('touch-action', 'pan-x');
      slider.addEventListener('mousedown', handleMouseDown);
      slider.addEventListener('mouseleave', handleMouseLeave);
      slider.addEventListener('mouseup', handleMouseUp);
      slider.addEventListener('mousemove', handleMouseMove);
      slider.addEventListener('touchstart', handleTouchStart, { passive: true } as AddEventListenerOptions);
      slider.addEventListener('touchmove', handleTouchMove, { passive: false } as AddEventListenerOptions);
      slider.addEventListener('touchend', handleTouchEnd);
      slider.addEventListener('touchcancel', handleTouchEnd);

      // 阻止图片拖拽
      const images = slider.querySelectorAll('img');
      images.forEach(img => {
        img.style.pointerEvents = 'none';
        img.style.userSelect = 'none';
        img.draggable = false;
      });

      return () => {
        slider.removeEventListener('mousedown', handleMouseDown);
        slider.removeEventListener('mouseleave', handleMouseLeave);
        slider.removeEventListener('mouseup', handleMouseUp);
        slider.removeEventListener('mousemove', handleMouseMove);
        slider.removeEventListener('touchstart', handleTouchStart as any);
        slider.removeEventListener('touchmove', handleTouchMove as any);
        slider.removeEventListener('touchend', handleTouchEnd as any);
        slider.removeEventListener('touchcancel', handleTouchEnd as any);
        slider.style.cursor = 'auto';
      };
    };

    // 为所有选择器应用拖拽功能
    const cleanupFunctions: (() => void)[] = [];
    
    selectors.forEach(selector => {
      const slider = document.querySelector(`.${selector}`) as HTMLElement;
      if (slider) {
        const cleanup = setupDragForSlider(slider);
        cleanupFunctions.push(cleanup);
      }
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [selectors]);

  return null; // 这个组件只提供行为，不渲染任何内容
}
