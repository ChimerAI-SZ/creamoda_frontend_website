'use client';

import { useEffect, useRef } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 所有设备：不循环播放，播放完后暂停
    video.loop = false;
    
    const handleEnded = () => {
      video.pause();
    };
    
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <video 
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover z-0"
      autoPlay
      muted
      playsInline
      poster="/marketing/images/hero/firstframe.png"
      preload="metadata"
    >
      <source src="/marketing/images/hero/bg.webm" type="video/webm" />
    </video>
  );
}
