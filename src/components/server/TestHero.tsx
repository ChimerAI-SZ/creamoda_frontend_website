import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoBackground from '@/src/components/client/VideoBackground';

// Font definitions
const fontStyles = `
  @font-face {
    font-family: 'InstrumentSans';
    src: url('/marketing/fonts/InstrumentSans-VariableFont_wdth,wght.ttf') format('truetype');
    font-weight: 100 900;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'InstrumentSansItalic';
    src: url('/marketing/fonts/InstrumentSans-Italic-Variable.ttf') format('truetype');
    font-style: italic;
    font-weight: 100 900;
    font-display: swap;
  }
`;

interface TestHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const TestHero: React.FC<TestHeroProps> = ({ 
  title = "From Idea to Bestseller in 24 Hours", 
  subtitle = "Reimagine Fashion with All-in-One AI-powered Solution",
  className = ""
}) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
      
      {/* 响应式底部图片样式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 1200px) {
            .bottom-images-gallery {
              margin-bottom: clamp(-25vh, -30vh, -20vh) !important;
            }
          }
          @media (max-width: 1024px) {
            .bottom-images-gallery {
              margin-bottom: clamp(-20vh, -25vh, -15vh) !important;
            }
          }
          @media (max-width: 900px) {
            .bottom-images-gallery {
              margin-bottom: clamp(-15vh, -20vh, -10vh) !important;
            }
          }
          @media (max-width: 768px) {
            .bottom-images-gallery {
              margin-bottom: clamp(-10vh, -15vh, -5vh) !important;
            }
          }
        `
      }} />
      <div className={`relative text-white min-h-[75vh] md:min-h-screen md:h-auto flex flex-col overflow-hidden ${className}`} style={{ zIndex: 0 }}>
        {/* Video Background */}
      {/* 使用客户端组件控制视频播放 */}
      <VideoBackground />
      
      {/* 蒙版层 - 在视频之上，但层级很低 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* 上半部分渐变蒙版 */}
        <div 
          className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.30) 60%, rgba(0, 0, 0, 0) 100%)'
          }}
        ></div>
        
        {/* 底部蒙版 */}
        <div className="absolute bottom-0 left-0 right-0 h-64"
             style={{
               background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
             }}>
        </div>
        
        {/* 左侧蒙版 */}
        <div className="absolute left-0 top-0 bottom-0 w-32"
             style={{
               background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
             }}>
        </div>
        
        {/* 右侧蒙版 */}
        <div className="absolute right-0 top-0 bottom-0 w-32"
             style={{
               background: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
             }}>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex  iiems-end md:items-center mt-20">
        <div className="max-w-5xl mx-auto text-center mt-8 md:mt-0 px-4">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight md:leading-normal" 
            style={{ 
              fontFamily: 'InstrumentSans, system-ui, -apple-system, sans-serif',
              fontFeatureSettings: '"wght" 600',
              wordSpacing: '0.1em'
            }}
          >
            <span className="md:hidden">
              From Idea to<br />
              <span 
                style={{ 
                  fontFamily: 'InstrumentSansItalic, system-ui, -apple-system, sans-serif',
                  fontStyle: 'italic'
                }}
              >
                Bestseller
              </span> in 24<br />
              Hours
            </span>
            <span className="hidden md:inline">
              From Idea to{' '}
              <span 
                style={{ 
                  fontFamily: 'InstrumentSansItalic, system-ui, -apple-system, sans-serif',
                  fontStyle: 'italic'
                }}
              >
                Bestseller
              </span>
              <br />
              in 24 Hours
            </span>
          </h1>
          <p 
            className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-gray-100 max-w-sm md:max-w-none mx-auto" 
            style={{ 
              fontFamily: 'InstrumentSans, system-ui, -apple-system, sans-serif'
            }}
          >
            {subtitle}
          </p>
          {/* 单个操作按钮 - 居中显示 */}
          <div className="flex justify-center items-center">
            {/* Chat With Fashion Agent 按钮 - 半透明样式 */}
            {/* <Link
              href="/fashion-agent/create"
              className="flex items-center justify-start gap-2 md:px-4 lg:px-5 px-4 md:py-2.5 lg:py-3 py-2.5 rounded-lg transition-all duration-200 group"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.10)',
                backdropFilter: 'blur(27px)'
              }}
            >
              <span className="text-white text-sm md:text-base lg:text-lg font-semibold text-left">Chat With Fashion Agent</span>
              <div className="w-6 h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 flex items-center justify-center">
                <Image
                  src="/marketing/images/msg.svg"
                  alt="Message"
                  width={24}
                  height={24}
                  className="w-[18px] h-[18px] md:w-[22px] lg:w-[24px] md:h-[22px] lg:h-[24px]"
                />
              </div>
            </Link> */}

            {/* Start With Creative Tools 按钮 - 白底黑字样式 */}
            <Link
              href="/fashion-design/create"
              className="flex items-center justify-start gap-2 md:px-4 lg:px-5 px-4 md:py-2.5 lg:py-3 py-2.5 bg-white rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200 group"
            >
              <span className="text-black text-sm md:text-base lg:text-lg font-semibold text-left">Start With Creative Tools</span>
              <div className="w-6 h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 flex items-center justify-center">
                <Image
                  src="/marketing/images/hero/narrow.svg"
                  alt="Arrow"
                  width={20}
                  height={19}
                  className="w-[16px] h-[15px] md:w-[18px] lg:w-[20px] md:h-[17px] lg:h-[19px] group-hover:translate-x-1 transition-transform duration-200"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Images Gallery - 桌面端 */}
      <div className="relative w-full justify-center items-end gap-2 hidden md:flex overflow-hidden bottom-images-gallery" style={{ 
        zIndex: 5,
        marginBottom: 'clamp(-35vh, -40vh, -30vh)' // 恢复大屏幕的截断效果
      }}>
        {/* Column 1 */}
        <div className="flex flex-col justify-start items-start gap-4" style={{ width: '15vw' }}>
          <img 
            src="/marketing/images/main/hero/one.png" 
            alt="Fashion design 1"
            className="w-full opacity-50 rounded-lg object-cover"
            style={{ height: '32vw' }}
          />
        </div>
        
        {/* Column 2 */}
        <div className="flex flex-col justify-start items-start gap-4" style={{ width: '15vw' }}>
          <img 
            src="/marketing/images/main/hero/two.png" 
            alt="Fashion design 2"
            className="w-full opacity-70 rounded-lg object-cover"
            style={{ height: '30vw' }}
          />
          <div 
            className="w-full rounded-lg bg-white/20 backdrop-blur-sm border border-white/30"
            style={{ height: '8vw' }}
          />
        </div>
        
        {/* Column 3 */}
        <div className="flex flex-col justify-start items-start gap-4" style={{ width: '15vw' }}>
          <img 
            src="/marketing/images/main/hero/three.png" 
            alt="Fashion design 4"
            className="w-full rounded-lg object-cover"
            style={{ height: '35vw' }}
          />
        </div>
        
        {/* Column 4 */}
        <div className="flex flex-col justify-start items-start gap-4" style={{ width: '15vw' }}>
          <img 
            src="/marketing/images/main/hero/four.png" 
            alt="Fashion design 5"
            className="w-full rounded-lg object-cover"
            style={{ height: '30vw' }}
          />
          <div 
            className="w-full rounded-lg bg-white/20 backdrop-blur-sm border border-white/30"
            style={{ height: '11vw' }}
          />
        </div>
        
        {/* Column 5 */}
        <div className="flex flex-col justify-start items-start gap-4" style={{ width: '15vw' }}>
          <img 
            src="/marketing/images/main/hero/five.png" 
            alt="Fashion design 7"
            className="w-full opacity-70 rounded-lg object-cover"
            style={{ height: '28vw' }}
          />
          <div 
            className="w-full rounded-lg bg-white/20 backdrop-blur-sm border border-white/30"
            style={{ height: '10vw' }}
          />
        </div>
        
        {/* Column 6 */}
        <div className="flex flex-col justify-start items-start gap-4" style={{ width: '15vw' }}>
          <img 
            src="/marketing/images/main/hero/six.png" 
            alt="Fashion design 9"
            className="w-full opacity-70 rounded-lg object-cover"
            style={{ height: '35vw' }}
          />
        </div>
        
        {/* Column 7 */}
        <div className="flex flex-col justify-start items-start gap-4" style={{ width: '15vw' }}>
          <img 
            src="/marketing/images/main/hero/seven.png" 
            alt="Fashion design 10"
            className="w-full opacity-40 rounded-lg object-cover"
            style={{ height: '38vw' }}
          />
        </div>
      </div>
      
      {/* 桌面端图片画廊蒙版层 - 独立层级 */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none hidden md:block" style={{ zIndex: 10, height: '50vh' }}>
        {/* 底部蒙版 */}
        <div className="absolute bottom-0 left-0 right-0 h-64"
             style={{
               background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
             }}>
        </div>
        
        {/* 左侧蒙版 */}
        <div className="absolute left-0 top-0 bottom-0 w-32"
             style={{
               background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
             }}>
        </div>
        
        {/* 右侧蒙版 */}
        <div className="absolute right-0 top-0 bottom-0 w-32"
             style={{
               background: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
             }}>
        </div>
      </div>

      {/* Bottom Images Gallery - 移动端，相对定位避免重叠 */}
      <div className="relative md:hidden flex items-end justify-center z-10 mt-8 mb-4" style={{
       
      }}>
        <div className="relative flex items-end justify-center gap-1" style={{
          transform: 'scale(1)', 
          transformOrigin: 'center bottom',
          maxHeight: '200px',
          overflow: 'hidden'
        }}>
          {/* 第一列 - 展示一张 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[82px] h-[135px] rounded overflow-hidden opacity-50">
              <Image
                src="/marketing/images/main/hero/one.png"
                alt="Fashion design 1"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* 第二列 - 展示一张 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[90px] h-[155px] rounded overflow-hidden">
              <Image
                src="/marketing/images/main/hero/two.png"
                alt="Fashion design 2"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* 第三列 - 展示两张图片 */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-[88px] h-[128px] rounded overflow-hidden opacity-70">
              <Image
                src="/marketing/images/main/hero/three.png"
                alt="Fashion design 3"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="relative w-[88px] h-[50px] rounded overflow-hidden opacity-70">
              <Image
                src="/marketing/images/main/hero/four.png"
                alt="Fashion design 4"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* 第四列 - 展示两张图片 */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-[88px] h-[125px] rounded overflow-hidden">
              <Image
                src="/marketing/images/main/hero/five.png"
                alt="Fashion design 5"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="relative w-[88px] h-[40px] rounded overflow-hidden">
              <Image
                src="/marketing/images/main/hero/six.png"
                alt="Fashion design 6"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* 第五列 - 展示一张 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[88px] h-[150px] rounded overflow-hidden opacity-40">
              <Image
                src="/marketing/images/main/hero/seven.png"
                alt="Fashion design 7"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* 移动端蒙版层 - 放在图片后面，确保在上层显示 */}
          {/* 底部蒙版 */}
          <div className="absolute left-0 right-0 h-32 pointer-events-none z-20"
               style={{
                 bottom: '-30px',
                 background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0) 100%)'
               }}>
          </div>
          
          {/* 左侧蒙版 */}
          <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-20"
               style={{
                 background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)'
               }}>
          </div>
          
          {/* 右侧蒙版 */}
          <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-20"
               style={{
                 background: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)'
               }}>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TestHero;
