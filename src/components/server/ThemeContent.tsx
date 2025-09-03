import { ThemeConfig } from '../../types/theme';
import StaticFusionGuide from './StaticFusionGuide';
import StaticWhyChoose from './StaticWhyChoose';
import StaticOfferMore from './StaticOfferMore';
import ClientOfferMoreInteractions from '../client/ClientOfferMoreInteractions';
import OutfitGeneratorFeatureModule from './OutfitGeneratorFeatureModule';
import DesignFilterSection from './DesignFilterSection';
import DesignStepsModule from './DesignStepsModule';
import DesignAboutModule from './DesignAboutModule';

interface ThemeContentProps {
  theme: ThemeConfig;
  currentRoute?: string;
  showFusionGuide?: boolean;
  showWhyChoose?: boolean; 
  showOfferMore?: boolean;
}

export default function ThemeContent({ 
  theme, 
  currentRoute = '',
  showFusionGuide = true, 
  showWhyChoose = true, 
  showOfferMore = true 
}: ThemeContentProps) {
  // Design 页面显示 DesignFilterSection 和相关的设计模块
  if (currentRoute === 'design') {
    return (
      <div className="theme-content">
        <DesignFilterSection />
        <DesignStepsModule />
        <DesignAboutModule />
      </div>
    );
  }

  return (
    <div className="theme-content">
      {showFusionGuide && <StaticFusionGuide theme={theme} />}
      {showWhyChoose && <StaticWhyChoose theme={theme} />}
      
      {/* 特殊功能模块 - 仅在 outfit-generator 页面显示 */}
      {currentRoute === 'outfit-generator' && (
        <OutfitGeneratorFeatureModule theme={theme} />
      )}
      
      {showOfferMore && (
        <>
          <StaticOfferMore theme={theme} currentRoute={currentRoute} />
          <ClientOfferMoreInteractions currentRoute={currentRoute} />
        </>
      )}
    </div>
  );
}
