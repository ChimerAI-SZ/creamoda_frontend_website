'use client';

import { useEffect } from 'react';
import { useLottie } from 'lottie-react';
import waveJson from '@/public/loading_animation.json';

interface WaveLoaderProps {
  progress: number; // 0–100
  width?: number;
  height?: number;
}

export function WaveLoader({ progress, width = 200, height = 300 }: WaveLoaderProps) {
  // 1. 配置动画
  const options = {
    animationData: waveJson,
    loop: false,
    autoplay: false,
    style: { width, height }
  };

  // 2. 拿到 View（渲染节点）和 animationItem（Lottie 实例）
  const { View, animationItem } = useLottie(options);

  // 3. 根据进度映射到帧
  useEffect(() => {
    if (!animationItem) return;
    const totalFrames = animationItem.getDuration(true);
    animationItem.goToAndStop((progress / 100) * totalFrames, true);
  }, [progress, animationItem]);

  return View;
}
