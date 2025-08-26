import { ThemeConfig } from '../../types/theme';

interface StaticWhyChooseProps {
  theme: ThemeConfig;
}

export default function StaticWhyChoose({ theme }: StaticWhyChooseProps) {
  const { whyChoose } = theme;

  if (!whyChoose || !whyChoose.cards) {
    return null;
  }

  return (
    <div className="why-choose-section">
      <h2 className="why-choose-title">{whyChoose.title}</h2>
      <div className="testimonial-cards">
        {whyChoose.cards.map((card, index) => (
          <div key={index} className={`testimonial-card testimonial-card-${index + 1}`}>
            <div className="testimonial-content">
              <h3 className="testimonial-title">{card.title}</h3>
              <p className="testimonial-text">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
