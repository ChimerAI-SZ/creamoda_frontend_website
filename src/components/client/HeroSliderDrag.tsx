'use client';

import { useEffect } from 'react';

interface HeroSliderDragProps {
  selectors?: string[];
}

export default function HeroSliderDrag({ selectors = ['hero-slider', 'feature-overview-track'] }: HeroSliderDragProps) {

  useEffect(() => {
    const setupDragForSlider = (slider: HTMLElement) => {

      let isDown = false;
      let startX: number;
      let scrollLeft: number;

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

      // 设置样式和监听
      slider.style.cursor = 'grab';
      slider.addEventListener('mousedown', handleMouseDown);
      slider.addEventListener('mouseleave', handleMouseLeave);
      slider.addEventListener('mouseup', handleMouseUp);
      slider.addEventListener('mousemove', handleMouseMove);

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
