import { ThemeConfig } from '../../types/theme';
import StaticNavigation from './StaticNavigation';
import StaticHeroMain from './StaticHeroMain';
import ClientHeroInteractions from '../client/ClientHeroInteractions';
import ClientGeneralWorkflowInteractions from '../client/ClientGeneralWorkflowInteractions';

interface StaticHeroProps {
  theme: ThemeConfig;
  saasUrl: string;
  isHomepage?: boolean;
}

export default function StaticHero({ theme, saasUrl, isHomepage = false }: StaticHeroProps) {
  return (
    <section className="hero-container">
      {/* 背景 */}
      <div className="hero-background"></div>
      
      {/* 内容 */}
      <div className="hero-content">
        {/* 静态导航栏 */}
        <StaticNavigation currentSaasUrl={saasUrl} />
        
        {/* 下拉菜单容器 - 由客户端组件管理显示 */}
        <div className="dropdown-container"></div>
        
        {/* 主要内容 */}
        <StaticHeroMain theme={theme} saasUrl={saasUrl} isHomepage={isHomepage} />
        
        {/* 客户端交互增强 */}
        <ClientHeroInteractions currentSaasUrl={saasUrl} />
        <ClientGeneralWorkflowInteractions />
      </div>
    </section>
  );
}
