import { ThemeConfig } from '../../types/theme';
import StaticFusionGuide from './StaticFusionGuide';
import StaticWhyChoose from './StaticWhyChoose';
import StaticOfferMore from './StaticOfferMore';
import ClientOfferMoreInteractions from '../client/ClientOfferMoreInteractions';

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
  return (
    <div className="theme-content">
      {showFusionGuide && <StaticFusionGuide theme={theme} />}
      {showWhyChoose && <StaticWhyChoose theme={theme} />}
      {showOfferMore && (
        <>
          <StaticOfferMore theme={theme} currentRoute={currentRoute} />
          <ClientOfferMoreInteractions currentRoute={currentRoute} />
        </>
      )}
    </div>
  );
}
