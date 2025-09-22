import { Suspense } from 'react';
import { ThemeConfig } from '../../types/theme';
import StaticFusionGuide from './StaticFusionGuide';
import StaticWhyChoose from './StaticWhyChoose';
import ClientOfferMoreInteractions from '../client/ClientOfferMoreInteractions';
import OutfitGeneratorFeatureModule from './OutfitGeneratorFeatureModule';
import DesignFilterSection from './DesignFilterSection';

import DesignAboutModule from './DesignAboutModule';
import StaticOfferMore from './StaticOfferMore';



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
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
          <DesignFilterSection />
        </Suspense>
      
        <DesignAboutModule />
      </div>
    );
  }

  return (
    <div className="theme-content">
      {showFusionGuide && <StaticFusionGuide theme={theme} />}
     
      {/* {showWhyChoose && <StaticWhyChoose theme={theme} />} */}
    
      <StaticWhyChoose theme={theme} />
     
      {/* 特殊功能模块 - 仅在 outfit-generator 页面显示 */}
      {currentRoute === 'outfit-generator' && (
        <OutfitGeneratorFeatureModule theme={theme} />
      )}
      <StaticOfferMore  />
      {showOfferMore && (
        <>
          {/* <StaticOfferMore theme={theme} currentRoute={currentRoute} /> */}
          <ClientOfferMoreInteractions currentRoute={currentRoute} />
        </>
      )}
    </div>
  );
}
