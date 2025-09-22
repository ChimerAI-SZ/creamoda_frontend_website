"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface TestimonialData {
  id: number;
  name: string;
  title: string;
  testimonial: string;
  avatar: string;
  productImages: {
    main: string;
    secondary: string;
  };
}

export default function InsightsBeta() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初始检查
    checkIfMobile();

    // 监听窗口大小变化
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const cardData: TestimonialData[] = [

  
      {
        id: 1,
        name: "Sarah Johnson",
        title: "CEO, Hellotalk Knitted Hats",
        testimonial: "CREAMODA has been an invaluable partner for Hellotalk Knitted Hats. Their ability to offer a high variety of SKUs with low MOQs has allowed us to maintain product diversity while keeping production costs manageable. Their flexible and efficient design solutions, combined with their ability to deliver varied styles, have made them a trusted partner for our brand. We are confident in CREAMODA's capabilities and look forward to a long-term partnership with them. Their all-in-one design and production services have been a huge asset to our business.",
        avatar: "/marketing/images/main/insight/headimage 1.jpg",
        productImages: {
          main: "/marketing/images/main/insight/placeholder-product1-b.png",
          secondary: "/marketing/images/main/insight/placeholder-product1-h.jpg"
        }
      },
      {
        id: 2,
        name: "Michael Chen",
        title: "Creative Director, Fashion Forward",
        testimonial: "Working with CREAMODA has transformed our approach to fashion design. Their AI-powered design tools have helped us create stunning collections in half the time it used to take. The quality of their manufacturing services is exceptional, and their team truly understands what modern fashion brands need.",
        avatar: "/marketing/images/main/insight/headimage 2.png",
        productImages: {
          main: "/marketing/images/main/insight/placeholder-product2-b.png",
          secondary: "/marketing/images/main/insight/placeholder-product2-h.png"
        }
      },
      {
        id: 3,
        name: "Emma Davis",
        title: "Founder, Sustainable Style Co.",
        testimonial: "CREAMODA's commitment to sustainable fashion practices aligns perfectly with our brand values. Their innovative approach to eco-friendly materials and ethical manufacturing has helped us create beautiful, responsible fashion that our customers love.",
        avatar: "/marketing/images/main/insight/headimage 3.png",
        productImages: {
          main: "/marketing/images/main/insight/placeholder-product3-b.png",
          secondary: "/marketing/images/main/insight/placeholder-product3-h.png"
        }
      }
      
    
  ];

  const goToPrevious = () => {
    if (currentIndex === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (currentIndex >= cardData.length - 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // 确定按钮是否可用
  const isPreviousDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= cardData.length - 1;

  return (
    <div className="bg-black text-white">
      {/* Header with title */}
      <div className="py-8 md:py-12">
        <div className="px-6 md:px-12 lg:px-[120px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight">
              Insight from our beta testers
            </h2>
            
            {/* Desktop Navigation buttons */}
            <div className="hidden md:flex gap-4">
              <button
                onClick={goToPrevious}
                disabled={isPreviousDisabled}
                className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                  isPreviousDisabled 
                    ? 'bg-[#151515] cursor-not-allowed opacity-50' 
                    : 'bg-[#292929] hover:bg-[#3a3a3a]'
                }`}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={goToNext}
                disabled={isNextDisabled}
                className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                  isNextDisabled 
                    ? 'bg-[#151515] cursor-not-allowed opacity-50' 
                    : 'bg-[#292929] hover:bg-[#3a3a3a]'
                }`}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-screen overflow-hidden" style={{ marginLeft: '-2px' }}>
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (isMobile ? 100 : 66.67)}${isMobile ? 'vw' : '%'})`,
          }}
        >
          {cardData.map((card) => (
            <div 
              key={card.id} 
              className="flex-shrink-0 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 bg-black border border-[#4C4C4C] pl-6 pr-6 py-6 md:pl-16 md:pr-16 md:py-10 w-screen md:w-[66.67vw]"
              style={{ 
                minWidth: '320px',
                minHeight: '442px'
              }}
            >
              {/* Product Images Section */}
              <div className="relative flex-shrink-0 mx-auto md:mx-0" style={{ width: '180px', height: '270px' }}>
                {/* Main Product Image */}
                <div className="absolute top-0 left-6 md:left-8 w-[150px] md:w-[188px] h-[225px] md:h-[282px]">
                  <Image
                    src={card.productImages.main}
                    alt="Product main"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Secondary Product Image */}
                <div className="absolute bottom-0 left-0 w-[80px] md:w-[103px] h-[120px] md:h-[154px]">
                  <Image
                    src={card.productImages.secondary}
                    alt="Product secondary"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* User Info and Testimonial Section */}
              <div className="flex-1 flex flex-col gap-4 md:gap-6 md:ml-8">
                {/* User Info */}
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={card.avatar}
                      alt={card.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold leading-7 md:leading-9 break-words" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {card.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-300 mt-1">
                      {card.title}
                    </p>
                  </div>
                </div>

                {/* Testimonial */}
                <p 
                  className="text-white text-base md:text-lg leading-6 md:leading-7 opacity-90" 
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  "{card.testimonial}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation buttons */}
      <div className="flex md:hidden justify-center gap-4 pb-8 pt-6">
        <button
          onClick={goToPrevious}
          disabled={isPreviousDisabled}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            isPreviousDisabled 
              ? 'bg-[#151515] cursor-not-allowed opacity-50' 
              : 'bg-[#292929] hover:bg-[#3a3a3a]'
          }`}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={goToNext}
          disabled={isNextDisabled}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            isNextDisabled 
              ? 'bg-[#151515] cursor-not-allowed opacity-50' 
              : 'bg-[#292929] hover:bg-[#3a3a3a]'
          }`}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

    </div>
  );
}