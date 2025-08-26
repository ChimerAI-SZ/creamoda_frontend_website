'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleNavigation } from '../../utils/navigation';

interface ClientOfferMoreInteractionsProps {
  currentRoute?: string;
}

export default function ClientOfferMoreInteractions({ currentRoute = '' }: ClientOfferMoreInteractionsProps) {
  const router = useRouter();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    const container = document.querySelector('.offer-more-cards') as HTMLElement;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = document.querySelector('.offer-more-cards') as HTMLElement;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  const scrollLeft = () => {
    const container = document.querySelector('.offer-more-cards') as HTMLElement;
    if (container && canScrollLeft) {
      container.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const container = document.querySelector('.offer-more-cards') as HTMLElement;
    if (container && canScrollRight) {
      container.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  };

  // 应用滚动按钮状态和事件
  useEffect(() => {
    const leftButton = document.querySelector('.nav-arrow-left') as HTMLButtonElement;
    const rightButton = document.querySelector('.nav-arrow-right') as HTMLButtonElement;

    if (leftButton) {
      leftButton.classList.toggle('nav-arrow-disabled', !canScrollLeft);
      leftButton.addEventListener('click', scrollLeft);
    }

    if (rightButton) {
      rightButton.classList.toggle('nav-arrow-disabled', !canScrollRight);
      rightButton.addEventListener('click', scrollRight);
    }

    return () => {
      if (leftButton) {
        leftButton.removeEventListener('click', scrollLeft);
      }
      if (rightButton) {
        rightButton.removeEventListener('click', scrollRight);
      }
    };
  }, [canScrollLeft, canScrollRight, scrollLeft, scrollRight]);

  // 处理卡片点击事件（增强原生链接）
  useEffect(() => {
    const cards = document.querySelectorAll('.offer-card[href]');
    
    const handleCardClick = (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href) {
        const route = href.replace('/', '');
        handleNavigation(route, router);
      }
    };

    cards.forEach(card => {
      card.addEventListener('click', handleCardClick);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('click', handleCardClick);
      });
    };
  }, [router]);

  return null; // 这个组件只提供行为，不渲染任何内容
}
