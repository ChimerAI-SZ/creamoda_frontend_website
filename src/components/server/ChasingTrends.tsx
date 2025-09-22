import React from 'react';
import Image from 'next/image';

interface ChasingTrendsProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const ChasingTrends: React.FC<ChasingTrendsProps> = ({
  title = "No More Chasing Trends,\nStart Creating Them Instead.",
  buttonText = "Design now",
  onButtonClick,
  className = ""
}) => {
  return (
    <section className={`bg-black w-full py-12 md:py-16 lg:py-20 ${className}`}>
      <div className="py-8 md:py-12 lg:py-16 max-w-[1440px] mx-auto" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-10 px-4 md:px-8 lg:px-16">
        {/* Images Collage - shows first on mobile */}
        <div className="relative w-[320px] h-[360px] md:w-[380px] md:h-[420px] lg:w-[420px] lg:h-[480px] flex-shrink-0 overflow-hidden lg:order-2">
          {/* Image 467 - top left with blur and opacity */}
          <div 
            className="absolute opacity-30"
            style={{
              left: '15%',
              top: '5%',
              width: '26%',
              height: '36%',
              borderRadius: '4.77px',
              filter: 'blur(3px)'
               
            }}
          >
            <Image
              src="/marketing/images/main/hero/four.png"
              alt="Fashion design"
              fill
              className="object-cover rounded-[4.77px]"
            />
          </div>

          {/* Image 1 - center right */}
          <div 
            className="absolute"
            style={{
              left: '55%',
              top: '10%',
              width: '35%',
              height: '60%',
              borderRadius: '5.4px'
            }}
          >
            <Image
              src="/marketing/images/main/hero/six.png"
              alt="Fashion design"
              fill
              className="object-cover rounded-[5.4px]"
            />
          </div>

          {/* Image 3 - bottom center with blur effect */}
          <div 
            className="absolute"
            style={{
              left: '25%',
              top: '35%',
              width: '45%',
              height: '90%',
              borderRadius: '5.4px'
            }}
          >
            <Image
             src="/marketing/images/main/hero/one.png"
              alt="Fashion design"
              fill
              className="object-cover rounded-[5.4px]"
            />
          </div>
        </div>

        {/* Content - shows after images on mobile, left-aligned */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-10 flex-shrink-0 text-left lg:order-1">
          <h1 
            className="text-white text-2xl md:text-4xl lg:text-[60px] leading-[1.6] md:leading-[1.4] lg:leading-[1] font-normal max-w-[754px]"
            style={{ fontFamily: 'Instrument Sans, system-ui, sans-serif' }}
          >
            {title.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          
          <button 
            className="bg-white text-black px-4 py-2 md:px-5 md:py-3 rounded-lg flex items-center justify-center gap-2 w-fit hover:bg-gray-100 transition-colors"
            onClick={onButtonClick}
          >
            <span className="text-base md:text-lg font-semibold" style={{ letterSpacing: '-1.4%' }}>
              {buttonText}
            </span>
            <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
              <Image
                src="/images/chasing-trends/arrow-right.svg"
                alt="Arrow right"
                width={17}
                height={16}
                className="ml-1"
              />
            </div>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default ChasingTrends;
