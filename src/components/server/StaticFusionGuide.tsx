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
        className="fusion-title"
        dangerouslySetInnerHTML={{ __html: fusionGuide.title }}
      />
      <div className="fusion-cards">
        {fusionGuide.cards.map((card, index) => (
          <div key={index} className="fusion-card">
            <div className="fusion-icon">
              <Image
                src={card.icon}
                alt={`${card.title} icon`}
                width={48}
                height={48}
                className="feature-icon"
              />
            </div>
            <h3 className="fusion-card-title">{card.title}</h3>
            <p className="fusion-card-desc">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
