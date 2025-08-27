import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Why does my output sometimes differ from my prompt?",
    answer: "AI interprets creatively. For closer matches, add more specific keywords or choose one or more of the design features we have pre-set that best meet your needs."
  },
  {
    question: "How does AI prioritize when both text and image inputs are provided?",
    answer: "AI integrates these two types of inputs: your image settings are basic, while text prompts refine details, so for optimal results, use clear instructions such as \"Keep the bottoms the same as the original image, but change long sleeves to short sleeves.\""
  },
  {
    question: "Is the AI Image Generator free to use?",
    answer: "New users receive 5 free credits to try the feature. Continued use requires purchasing credit packages, which can be done in your account dashboard."
  },
  {
    question: "Will the processed images be stored in my account?",
    answer: "Yes, all edited images are saved securely in your portfolio. You can access, download, or delete them anytime via your account."
  },
  {
    question: "Can I use text prompts and image uploads together?",
    answer: "Yes! For text to image, you can output text and select our preset models and output formats for combination, and the image to image function supports uploading images and adding text prompts for combination editing. There are multiple ways for you to choose from, just to output the results that satisfy you the most."
  }
];

export default function StaticFAQ() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-6 lg:gap-8">
          {/* 左侧标题 */}
          <div className="flex flex-col justify-start">
            <h2 
              className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight"
              style={{ 
                fontFamily: "'Neue Machina Regular', 'Neue Machina', system-ui, -apple-system, sans-serif",
                fontWeight: '950'
              }}
            >
              <span className="block">Frequently</span>
              <span className="block">Asked</span>
              <span className="block">Questions</span>
            </h2>
          </div>
          
          {/* 右侧问题列表 */}
          <div className="space-y-0">
            {faqData.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: FAQItem) {
  return (
    <details className="group border-b border-gray-600">
      <summary className="flex justify-between items-center py-4 md:py-6 text-lg md:text-xl lg:text-2xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors list-none">
        <span className="flex-1 text-left pr-4">{question}</span>
        {/* 自定义向下箭头 */}
        <div className="faq-arrow flex-shrink-0 w-6 h-6 flex items-center justify-center">
          <svg 
            className="w-5 h-5 text-gray-300 transform transition-transform duration-300 group-open:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>
      <div className="pb-4 md:pb-6 text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}