import React from 'react';

const StaticWhyChoose: React.FC = () => {
  const features = [
    {
      metric: '70%',
      label: 'Faster',
      description: 'From idea to prototype in days instead of weeks.'
    },
    {
      metric: '5x',
      label: 'More Designs', 
      description: 'Generate multiple outfit variations instantly with AI.'
    },
    {
      metric: '60%',
      label: 'Lower Costs',
      description: 'Reduce fabric sampling and photoshoot expenses with virtual tools.'
    }
  ];

  return (
    <section className="w-full bg-black text-white overflow-visible">
      <div className="max-w-7xl lg:max-w-[1450px] xl:max-w-[1550px] 2xl:max-w-[1650px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-24 lg:py-40">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Main Title */}
          <div className="mb-14 w-full">
            <h2 className="text-3xl md:text-4xl lg:text-[48px] font-normal text-left leading-[1.22] font-['Instrument_Sans',sans-serif]">
              {/* Why Choose Chimer AI */}
              Why Choose Creamoda AI
            </h2>
          </div>

          {/* Features Grid */}
          <div className="flex flex-col lg:flex-row items-stretch justify-stretch w-full gap-8 lg:gap-[120px]">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-row lg:flex-col items-center justify-start lg:justify-center flex-1 gap-8 lg:gap-16"
              >
                {/* Circular Badge */}
                <div className="flex flex-col items-center justify-center w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[228px] lg:h-[228px] rounded-full border border-white border-opacity-50 p-3 md:p-4 lg:p-14 flex-shrink-0">
                  <span className="text-[18px] md:text-[24px] lg:text-[62px] font-normal leading-[1.55] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {feature.metric}
                  </span>
                  <span className="text-[10px] md:text-xs lg:text-xl font-light leading-[1.5] font-['Inter',sans-serif] text-white whitespace-nowrap">
                    {feature.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-base lg:text-lg font-normal leading-[1.21] text-left lg:text-center font-['Inter',sans-serif] text-white flex-1 lg:max-w-sm lg:px-4">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticWhyChoose;