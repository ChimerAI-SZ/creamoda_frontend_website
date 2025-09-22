import Image from 'next/image';
import { ThemeConfig } from '../../types/theme';

interface StaticFusionGuideProps {
  theme: ThemeConfig;
}

export default function StaticFusionGuide({ theme }: StaticFusionGuideProps) {
  const { fusionGuide } = theme;

  if (!fusionGuide || !fusionGuide.cards) {
    return null;
  }

  return (
    <div className="fusion-guide">
      <h2 
        className="fusion-title text-3xl md:text-4xl lg:text-6xl pl-4 sm:pl-0"
        dangerouslySetInnerHTML={{ __html: fusionGuide.title }}
      />
      <div className="fusion-cards">
        {fusionGuide.cards.map((card, index) => (
          <div key={index} className="fusion-card">
            <div className="fusion-icon">
              <div className="fusion-icon-container">
                <div className="fusion-icon-inner">
                  <Image
                    src={card.icon}
                    alt={`${card.title} icon`}
                    width={32}
                    height={32}
                    className="feature-icon"
                  />
                </div>
              </div>
              <h3 className="fusion-card-title">{card.title}</h3>
            </div>
            <p className="fusion-card-desc">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
