'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface UserType {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  isActive: boolean;
}

const HowDifferent: React.FC = () => {
  const [activeUserType, setActiveUserType] = useState<string>('independent-designers');

  const userTypes: UserType[] = [
    {
      id: 'independent-designers',
      title: 'Independent Designers',
      description: 'Turning ideas into prototypes without costly resources.',
      shortDescription: 'Freelance and independent designers can instantly visualize their fashion concepts, experiment with fabrics and cuts, and prepare production-ready drafts—all without hiring large teams or investing heavily in software.',
      image: '/marketing/images/main/agent/independents.png',
      isActive: true
    },
    {
      id: 'ecommerce-sellers',
      title: 'E-commerce Sellers',
      description: 'Faster product visuals, stronger sales.',
      shortDescription: 'Small to medium online fashion stores can generate professional product images, create styled mockups, and test multiple looks for marketing campaigns. This makes product listings more engaging while cutting time-to-market.',
      image: '/marketing/images/main/agent/commeres.png',
      isActive: false
    },
    {
      id: 'marketing-teams',
      title: 'Marketing Teams',
      description: 'Campaign visuals in hours, not weeks.',
      shortDescription: 'Fashion brands\' marketing teams can use AI to create campaign visuals, seasonal lookbooks, and social content at scale—dramatically reducing dependency on traditional shoots while keeping aesthetics consistent.',
      image: '/marketing/images/main/agent/marketings.png',
      isActive: false
    },
    {
      id: 'fashion-students',
      title: 'Fashion Students & Creatives',
      description: 'Learn, experiment, and showcase your creativity.',
      shortDescription: 'Fashion students and creative hobbyists can quickly explore ideas, iterate on designs, and build portfolios. The AI assists in turning imagination into polished outputs, lowering the entry barrier for new talent.',
      image: '/marketing/images/main/agent/fasions.png',
      isActive: false
    }
  ];

  const handleUserTypeClick = (id: string) => {
    setActiveUserType(id);
  };

  const activeUser = userTypes.find(user => user.id === activeUserType) || userTypes[0];

  return (
    <section className="w-full bg-black text-white overflow-visible">
      <div className="max-w-7xl lg:max-w-[1450px] xl:max-w-[1550px] 2xl:max-w-[1650px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 lg:py-20">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Main Title */}
          <div className="mb-14 w-full">
            <h2 className="text-3xl md:text-4xl lg:text-[48px] font-normal text-left leading-[1.22] font-['Instrument_Sans',sans-serif]">
              See How Different Users Win with Our Fashion Agent
            </h2>
          </div>

          {/* Mobile Layout - Vertical Cards */}
          <div className="flex flex-col gap-8 w-full lg:hidden">
            {userTypes.map((userType) => (
              <div key={userType.id} className="flex flex-col w-full">
                {/* Image */}
                <div className="relative w-full h-[200px] mx-0 rounded-lg overflow-hidden">
                  <Image
                    src={userType.image}
                    alt={`${userType.title} demonstration`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw"
                  />
                </div>
                
                {/* Title Rectangle */}
                <div className="bg-[#333333] mx-2 px-2 py-1 mt-4 inline-block w-fit">
                  <span className="text-sm font-medium text-white font-['Instrument_Sans',sans-serif]">
                    {userType.title}
                  </span>
                </div>
                
                {/* Description Area */}
                <div className="flex flex-col gap-3 px-2 mt-4">
                  <h3 className="text-xl font-semibold text-white font-['Instrument_Sans',sans-serif] leading-[1.33]">
                    {userType.description}
                  </h3>
                  
                  <p className="text-base font-normal text-white text-opacity-70 font-['Inter',sans-serif] leading-[1.5]">
                    {userType.shortDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Layout - Tab Style */}
          <div className="hidden lg:flex lg:flex-row items-stretch w-full gap-16 lg:gap-24">
            
            {/* Left Side - User Type Selector */}
            <div className="flex flex-col w-full lg:w-auto lg:flex-shrink-0 lg:min-w-[280px]">
              <div className="flex flex-col justify-between lg:h-[544px]">
                {userTypes.map((userType, index) => (
                  <div key={userType.id} className="flex flex-col flex-1">
                    <button
                      onClick={() => handleUserTypeClick(userType.id)}
                      className={`flex items-center justify-stretch w-full lg:w-auto px-6 py-4 lg:py-6 rounded-md text-left transition-all duration-300 flex-1 min-h-[60px] lg:min-h-[100px] ${
                        activeUserType === userType.id
                          ? 'bg-white bg-opacity-15 text-white font-medium'
                          : 'bg-transparent text-white font-normal hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <span className="text-lg md:text-xl lg:text-2xl font-['Instrument_Sans',sans-serif] leading-[1.5]">
                        {userType.title}
                      </span>
                    </button>
                    
                    {/* Divider Line - only show between items, not after last item, and not when current or next item is active */}
                    {index < userTypes.length - 1 && 
                     activeUserType !== userType.id && 
                     activeUserType !== userTypes[index + 1].id && (
                      <div className="w-full h-px bg-white bg-opacity-15 my-0"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Visual Demo Area */}
            <div className="flex flex-col gap-6 w-full lg:flex-1 lg:max-w-[900px] lg:h-[544px]">
              
              {/* Dynamic Image Container */}
              <div className="relative w-full h-[420px] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={activeUser.image}
                  alt={`${activeUser.title} demonstration`}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 900px"
                />
              </div>

              {/* Description Area */}
              <div className="flex flex-col gap-4 w-full">
                <h3 className="text-xl md:text-2xl font-semibold text-white font-['Instrument_Sans',sans-serif] leading-[1.33]">
                  {activeUser.description}
                </h3>
                
                <p className="text-base font-normal text-white text-opacity-70 font-['Inter',sans-serif] leading-[1.5]">
                  {activeUser.shortDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowDifferent;