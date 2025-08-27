'use client';

import { useEffect, useState } from 'react';

export default function ClientGeneralWorkflowInteractions() {
  const [activeDot, setActiveDot] = useState(1);

  useEffect(() => {
    // 获取圆点元素和内容区域
    const dots = document.querySelectorAll('.circle-dot');
    const contentTitle = document.querySelector('.circle-content-title');
    const contentDesc = document.querySelector('.circle-content-desc');

    // 步骤内容数据
    const stepContent = [
      {
        title: 'Input Design Idea or Reference Image',
        desc: 'Share your concept or upload a reference picture to get started.'
      },
      {
        title: 'Generate Design Images in Multiple Styles',
        desc: 'Instantly receive AI-generated fashion designs in various styles.'
      },
      {
        title: 'Bring Designs to Market',
        desc: 'Contact our professional team to turn your finalized design into production, and launch your fashion pieces in the market.'
      }
    ];

    // 更新内容的函数
    const updateContent = (stepIndex: number) => {
      if (contentTitle && contentDesc) {
        const step = stepContent[stepIndex - 1];
        contentTitle.textContent = step.title;
        contentDesc.textContent = step.desc;
      }
    };

    // 更新圆点状态的函数
    const updateDotState = (activeIndex: number) => {
      dots.forEach((dot, index) => {
        if (index + 1 === activeIndex) {
          dot.classList.add('active-dot');
        } else {
          dot.classList.remove('active-dot');
        }
      });
    };

    // 处理圆点点击事件
    const handleDotClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const label = target.getAttribute('data-label');
      if (label) {
        const stepIndex = parseInt(label);
        setActiveDot(stepIndex);
        updateContent(stepIndex);
        updateDotState(stepIndex);
      }
    };

    // 为每个圆点添加点击事件监听器
    dots.forEach(dot => {
      dot.addEventListener('click', handleDotClick);
    });

    // 清理函数
    return () => {
      dots.forEach(dot => {
        dot.removeEventListener('click', handleDotClick);
      });
    };
  }, []);

  return null; // 这个组件只提供行为，不渲染任何内容
}
