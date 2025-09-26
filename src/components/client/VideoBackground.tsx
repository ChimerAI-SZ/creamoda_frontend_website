'use client';

import { useEffect, useRef } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoControl = () => {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // 移动端：不循环播放，播放完后暂停
        video.loop = false;
        
        const handleEnded = () => {
          video.pause();
        };
        
        video.addEventListener('ended', handleEnded);
        
        return () => {
          video.removeEventListener('ended', handleEnded);
        };
      } else {
        // 桌面端：循环播放
        video.loop = true;
      }
    };

    // 初始设置
    handleVideoControl();

    // 监听窗口大小变化
    const handleResize = () => {
      handleVideoControl();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <video 
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover z-0"
      autoPlay
      muted
      playsInline
    >
      <source src="/marketing/images/hero/bg.webm" type="video/webm" />
    </video>
  );
}
