import { useTheme } from '../context/ThemeContext';

export default function WhyChoose() {
  const { currentTheme } = useTheme();
  const { whyChoose } = currentTheme;

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
