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
      <div className="hero-background" style={{ top: 0, height: '100%' }}>
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
                height: 85vh !important;
                min-height: 85vh !important;
              }
              .hero-container {
                min-height: 85vh !important;
                height: 85vh !important;
                background-color: #000000 !important;
              }
              .hero-desktop {
                display: none !important;
              }
              .hero-mobile {
                display: block !important;
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
