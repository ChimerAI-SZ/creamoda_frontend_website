'use client';

import { useState } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

interface FAQItem {
  question: string;
  answer: string;
}

const fallbackFaqData: FAQItem[] = [
  {
    question: "How does the background remover handle complex edges like hair or transparent objects?",
    answer: "Our AI automatically detects edges with high precision, though results may vary with low-contrast images—high-resolution inputs yield the best outcomes."
  },
  {
    question: "Can I customize the background after removal (e.g., change colors)?",
    answer: "Yes — while background removal exports only transparent PNG or white backgrounds, you can use our AI Background Changer tool to add any color, image, or custom design you want."
  },
  {
    question: "How long does the background remover take to process an image?",
    answer: "Typically, just 2–5 seconds for most images. Even complex images with fine details are usually done in moments — so you can keep creating without waiting."
  },
  {
    question: "Is the background remover free to use?",
    answer: "Every new user gets 5 free credits to explore Creamoda's AI tools. Each feature, like AI Background Remover, uses credits — and you can easily buy more in flexible packages to keep creating without limits."
  },
  {
    question: "Will the processed images be stored in my account?",
    answer: "Yes, all processed images will be automatically saved in your portfolio, and you can log in to your account at any time to view, download, or delete these files. We use encrypted storage to ensure the security of your data."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { currentTheme } = useTheme();

  const themedFaq: FAQItem[] = currentTheme.faq?.items ?? fallbackFaqData;

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">
          Frequently<br />
          Asked<br />
          Questions
        </h2>
        
        <div className="faq-content">
          {themedFaq.map((item, index) => (
            <div key={index} className="faq-item-wrapper">
              <div 
                className="faq-item"
                onClick={() => toggleItem(index)}
              >
                <h3 className="faq-question">{item.question}</h3>
                <button className="faq-toggle">
                  <svg
                    className={`faq-arrow ${openItems.has(index) ? 'faq-arrow-open' : ''}`}
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L9 9L17 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              
              <div className={`faq-answer ${openItems.has(index) ? 'faq-answer-open' : ''}`}>
                <p>{item.answer}</p>
              </div>
              
              {index < themedFaq.length - 1 && <div className="faq-divider" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
