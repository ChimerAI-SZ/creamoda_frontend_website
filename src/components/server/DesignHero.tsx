'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import StaticNavigation from './StaticNavigation';
import ClientHeroInteractions from '../client/ClientHeroInteractions';
import ClientGeneralWorkflowInteractions from '../client/ClientGeneralWorkflowInteractions';

interface DesignHeroProps {
  saasUrl: string;
}

export default function DesignHero({ saasUrl }: DesignHeroProps) {
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [mobileImageLoaded, setMobileImageLoaded] = useState(false);
  const [secondaryImageLoaded, setSecondaryImageLoaded] = useState(false);
  return (
    <section className="min-h-[600px] relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/marketing/images/background.png)'}}>
      {/* 导航栏 */}
      <StaticNavigation currentSaasUrl={saasUrl} />
      
      {/* 下拉菜单容器 - 由客户端组件管理显示 */}
      <div className="dropdown-container"></div>
      
      {/* 主要内容区域 */}
      <div className="pt-20 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto" style={{ maxWidth: '1600px' }}>
          {/* Hero 卡片容器 */}
          <div 
            className="rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] lg:pl-8 border-2 border-white/20 flex flex-col lg:flex-row lg:items-center lg:justify-between overflow-hidden relative"
            style={{
              backgroundColor: 'transparent',
              minHeight: '300px',
              width: '100%',
              margin: '0 auto'
            }}
          >
            {/* 左侧内容 */}
            <div className="flex-1 lg:max-w-[780px] z-30 relative">
              <div className="pl-0 sm:pl-4 lg:pl-[60px]">
                {/* 标题 */}
                <h1 
                  className="text-white mb-4 sm:mb-6"
                  style={{
                    fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif",
                    fontWeight: '800',
                    fontSize: 'clamp(28px, 5vw, 44px)',
                    lineHeight: '1.32',
                    textAlign: 'left'
                  }}
                >
                  Discover Design Ideas
                </h1>
                
                {/* 描述文本 */}
                <p 
                  className="text-white mb-6 lg:mb-0"
                  style={{
                    fontFamily: "'Neue Machina', system-ui, -apple-system, sans-serif",
                    fontWeight: '400',
                    fontSize: 'clamp(16px, 3vw, 20px)',
                    lineHeight: '1.4',
                    textAlign: 'left',
                    maxWidth: '750px'
                  }}
                >
                  Find inspiration for your next collection with AI fashion design ideas, spanning casualwear, couture, and avant-garde styles — explore a wide range of looks to spark creativity and bring bold concepts to life.
                </p>
              </div>
            </div>
            
            {/* 右侧图片区域 */}
            <div 
              className="relative flex-shrink-0 mt-4 lg:mt-0 w-full lg:w-[600px] h-[250px] sm:h-[300px] lg:h-[350px]"
            >
              {/* 主要图片 - 背景大图 */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                {/* 桌面端主图片骨架屏 */}
                {!mainImageLoaded && (
                  <div className="absolute hidden lg:block">
                    <Skeleton 
                      className="bg-white/10"
                      style={{ 
                        right: '-50px',
                        top: '-160px',
                        width: '1200px',
                        height: '700px',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}
                
                <Image
                  src="/images/design/design-hero-main.png"
                  alt="AI Fashion Design Ideas"
                  width={1200}
                  height={1300}
                  className="absolute hidden lg:block"
                  style={{ 
                    right: '-50px',
                    top: '-160px',
                    width: '1200px',
                    height: '700px',
                    objectFit: 'contain',
                    transform: 'rotate(-15deg)',
                    opacity: mainImageLoaded ? '0.5' : '0',
                    maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,1) 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,1) 100%)',
                    transition: 'opacity 300ms ease'
                  }}
                  onLoad={() => setMainImageLoaded(true)}
                  priority
                />
                
                {/* 移动端背景图片骨架屏 */}
                {!mobileImageLoaded && (
                  <div className="absolute lg:hidden">
                    <Skeleton 
                      className="bg-white/10"
                      style={{ 
                        right: '-100px',
                        top: '-100px',
                        width: '500px',
                        height: '400px',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}
                
                <Image
                  src="/images/design/design-hero-main.png"
                  alt="AI Fashion Design Ideas"
                  width={800}
                  height={800}
                  className="absolute lg:hidden"
                  style={{ 
                    right: '-100px',
                    top: '-100px',
                    width: '500px',
                    height: '400px',
                    objectFit: 'contain',
                    transform: 'rotate(-10deg)',
                    opacity: mobileImageLoaded ? '0.3' : '0',
                    maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,1) 70%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,1) 70%)',
                    transition: 'opacity 300ms ease'
                  }}
                  onLoad={() => setMobileImageLoaded(true)}
                  priority
                />
                
                {/* 左边模糊蒙版 - 仅在桌面端显示 */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-4/5 pointer-events-none z-10 hidden lg:block"
                  style={{
                    background: 'linear-gradient(to right, rgba(44, 20, 151, 0.6) 0%, rgba(44, 20, 151, 0.3) 30%, rgba(20, 5, 78, 0.15) 50%, rgba(48, 21, 159, 0.05) 70%, rgba(48, 21, 159, 0.01) 85%, transparent 100%)',
                    filter: 'blur(120px)'
                  }}
                />
                
                {/* 中间图片 */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  {/* 中间图片骨架屏 */}
                  {!secondaryImageLoaded && (
                    <Skeleton 
                      className="bg-white/10"
                      style={{ 
                        width: 'clamp(200px, 40vw, 300px)',
                        height: 'clamp(240px, 48vw, 360px)',
                        borderRadius: '8px'
                      }}
                    />
                  )}
                  
                  <Image
                    src="/images/design/design-hero-secondary-2d88c0.png"
                    alt="Fashion Design Collection"
                    width={458}
                    height={519}
                    className="object-contain"
                    style={{ 
                      width: 'clamp(200px, 40vw, 300px)',
                      height: 'auto',
                      opacity: secondaryImageLoaded ? 1 : 0,
                      transition: 'opacity 300ms ease'
                    }}
                    onLoad={() => setSecondaryImageLoaded(true)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 额外内容区域 - 可以添加其他设计工具或功能 */}
          <div className="mt-16">
            {/* 这里可以添加设计工具展示区域 */}
          </div>
        </div>
      </div>
      
      {/* 客户端交互增强 */}
      <ClientHeroInteractions currentSaasUrl={saasUrl} />
      <ClientGeneralWorkflowInteractions />
    </section>
  );
}
