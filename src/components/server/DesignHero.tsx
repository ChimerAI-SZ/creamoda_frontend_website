'use client';

import StaticNavigation from './StaticNavigation';
import ClientHeroInteractions from '../client/ClientHeroInteractions';
import ClientGeneralWorkflowInteractions from '../client/ClientGeneralWorkflowInteractions';

interface DesignHeroProps {
  saasUrl: string;
}

export default function DesignHero({ saasUrl }: DesignHeroProps) {
  return (
    <section 
      className="hero-section relative overflow-hidden bg-no-repeat bg-black"
      style={{
        backgroundImage: 'url(/marketing/images/design/design_bg.png)',
        backgroundSize: 'cover', // 填满容器，无留白
        backgroundPosition: 'center top', // 从顶部开始显示
        width: '100%',
        height: '600px' // 恢复高度设置
      }}
    >
      {/* 移动端背景图片样式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (min-width: 769px) {
            .hero-section .content-container {
              padding-top: 200px !important;
            }
            .hero-section p {
              font-size: clamp(18px, 3vw, 24px) !important;
            }
          }
          @media (max-width: 768px) {
            .hero-section {
              background-color: #000000 !important;
              background-image: url(/marketing/images/design/design_mobile_bgs.png) !important;
              background-size: contain !important;
              background-position: center top !important;
              background-repeat: no-repeat !important;
              height: 450px !important;
            }
            .hero-section h1 {
              font-size: clamp(42px, 8vw, 56px) !important;
            }
            .hero-section .content-container {
              padding-top: 160px !important;
              justify-content: flex-start !important;
              padding-left: 2rem !important;
              padding-right: 2rem !important;
              height: 450px !important;
            }
          }
        `
      }} />
      
      {/* 导航栏 */}
      <StaticNavigation currentSaasUrl={saasUrl} />
      
      {/* 下拉菜单容器 - 由客户端组件管理显示 */}
      <div className="dropdown-container"></div>
      
      {/* 深色遮罩层 */}

      
      {/* 主要内容区域 */}
      <div 
        className="relative z-10 flex flex-col justify-center items-start md:items-center text-left md:text-center px-4 sm:px-6 lg:px-8 content-container"
        style={{
          height: '600px', // 匹配section高度
          paddingTop: '120px' // 为导航栏和额外间距留出空间
        }}
      >
        <div className="max-w-8xl md:mx-auto w-full">
          {/* 标题 */}
          <h1 
            className="text-white mb-4"
            style={{
              fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif",
              fontWeight: '400',
              fontSize: 'clamp(48px, 8vw, 76px)',
              lineHeight: '1.24',
              textAlign: 'inherit', // 继承父元素的对齐方式
              textShadow: '0px 0px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            Discover Design Ideas
          </h1>
          
          {/* 描述文本 */}
          <p 
            className="text-white max-w-6xl md:mx-auto"
            style={{
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              fontWeight: '500',
              fontSize: 'clamp(16px, 3vw, 20px)',
              lineHeight: '1.21',
              textAlign: 'inherit', // 继承父元素的对齐方式
              opacity: '0.7',
              textShadow: '0px 0px 14px rgba(0, 0, 0, 0.55)'
            }}
          >
            Find inspiration for your next collection with AI fashion design ideas, spanning casualwear, couture, and avant-garde styles — explore a wide range of looks to spark creativity and bring bold concepts to life.
          </p>
        </div>
      </div>
      

      
      {/* 客户端交互增强 */}
      <ClientHeroInteractions currentSaasUrl={saasUrl} />
      <ClientGeneralWorkflowInteractions />
    </section>
  );
}
