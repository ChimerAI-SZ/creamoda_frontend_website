import { ThemeConfig } from '../../types/theme';
import StaticNavigation from './StaticNavigation';
import StaticHeroMains from './StaticHeroMains';
import FeaturePageHero from './FeaturePageHero';
import ClientHeroInteractions from '../client/ClientHeroInteractions';
import ClientGeneralWorkflowInteractions from '../client/ClientGeneralWorkflowInteractions';

interface StaticHeroProps {
  theme: ThemeConfig;
  saasUrl: string;
  isHomepage?: boolean;
  currentRoute?: string;
}

export default function StaticHero({ theme, saasUrl, isHomepage = false, currentRoute }: StaticHeroProps) {
  // 首页使用 StaticHeroMains 的布局
  if (isHomepage) {
    return (
      <section className="hero-container">
        
        {/* StaticHeroMains - 全宽显示，脱离hero-content限制 */}
        <StaticHeroMains className="absolute inset-0 z-0" />
        
        {/* 内容 */}
        <div className="hero-content">
          {/* 静态导航栏 */}
          <StaticNavigation currentSaasUrl={saasUrl} />
          
          {/* 下拉菜单容器 - 由客户端组件管理显示 */}
          <div className="dropdown-container"></div>
          
          {/* 原来的主要内容被StaticHeroMains替代 */}
        
          {/* 客户端交互增强 */}
          <ClientHeroInteractions currentSaasUrl={saasUrl} />
          <ClientGeneralWorkflowInteractions />
        </div>
      </section>
    );
  }

  // 功能页面使用 FeaturePageHero 的布局
  return (
    <section className="hero-container">
      {/* 功能页面背景图片 - 调整高度与容器一致 */}
      <div 
        className="hero-background" 
        style={{ 
          top: 0, 
          height: '100%',
          backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'url(/marketing/images/bgs.png)'
        }}
      >
        {/* 移动端底部蒙版 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10 md:hidden"></div>
        
        {/* 响应式背景样式优化 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 769px) {
              .hero-background {
                height: 100vh !important;
                min-height: 100vh !important;
              }
              .hero-container {
                min-height: 100vh !important;
                height: 100vh !important;
                overflow: hidden !important;
              }
              .hero-desktop {
                display: flex !important;
              }
              .hero-mobile {
                display: none !important;
              }
            }
            @media (max-width: 768px) {
              .hero-background {
                background-color: #000000 !important;
                background-size: cover !important;
                background-position: center center !important;
                background-repeat: no-repeat !important;
                height: 80vh !important;
                min-height: 80vh !important;
                top: 0px !important;
              }
              .hero-container {
                min-height: 80vh !important;
                height: 80vh !important;
                max-height: 80vh !important;
                background-color: #000000 !important;
                overflow: hidden !important;
              }
              .hero-desktop {
                display: none !important;
              }
              .hero-mobile {
                display: block !important;
              }
              
              /* 确保 FeaturePageHero 的移动端布局适应容器高度 */
              .hero-mobile {
                height: 100% !important;
                max-height: 100% !important;
                min-height: auto !important;
                padding-top: calc(var(--hero-nav-height, 75px) + 10px) !important;
                padding-bottom: 10px !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
              }
              
              /* 移动端图片容器缩放 */
              .hero-mobile > div:first-child {
                width: 100% !important;
                
                aspect-ratio: 3/4 !important;
                margin: 10px auto 0 auto !important;
                flex-shrink: 1 !important;
                min-height: 0 !important;
              }
              
              /* 移动端内容区域缩放 */
              .hero-mobile > div:last-child {
                padding: 15px 20px !important;
                flex-shrink: 1 !important;
                min-height: 0 !important;
              }
              
              /* 移动端标题字体缩放 */
              .hero-mobile h2 {
                font-size: clamp(24px, 5vw, 36px) !important;
                line-height: 1.1 !important;
                margin: 0 0 8px 0 !important;
              }
              
              /* 移动端描述文字缩放 */
              .hero-mobile p {
                font-size: clamp(12px, 2.5vw, 14px) !important;
                line-height: 1.3 !important;
                margin: 0 !important;
              }
              
              /* 移动端按钮缩放 */
              .hero-mobile a {
                padding: 12px 20px !important;
                font-size: 16px !important;
              }
              
              /* 移动端演示图片缩放 */
              .hero-mobile .demo-thumbnails > div {
                width: 50px !important;
                height: 50px !important;
              }
            }
            
            /* 小屏幕设备进一步优化 */
            @media (max-width: 480px) {
              .hero-background {
                height: 80vh !important;
                min-height: 80vh !important;
                top: 0px !important;
              }
              .hero-container {
                height: 80vh !important;
                max-height: 80vh !important;
              }
              
              .hero-mobile {
                padding-top: calc(var(--hero-nav-height, 75px) + 5px) !important;
                padding-bottom: 5px !important;
              }
              
              .hero-mobile > div:first-child {
              
                margin: 5px auto 0 auto !important;
              }
              
              .hero-mobile > div:last-child {
                padding: 10px 15px !important;
              }
            }
          `
        }} />
      </div>
      
      {/* 导航和其他内容在hero-content容器内 */}
      <div className="hero-content">
        {/* 静态导航栏 */}
        <StaticNavigation currentSaasUrl={saasUrl} />
        
        {/* 下拉菜单容器 - 由客户端组件管理显示 */}
        <div className="dropdown-container"></div>
      
        {/* 客户端交互增强 */}
        <ClientHeroInteractions currentSaasUrl={saasUrl} />
        <ClientGeneralWorkflowInteractions />
      </div>
      
      {/* 功能页面的 hero 内容 - 突破hero-content限制，全宽显示 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <FeaturePageHero theme={theme} saasUrl={saasUrl} currentRoute={currentRoute} />
      </div>
    </section>
  );
}
