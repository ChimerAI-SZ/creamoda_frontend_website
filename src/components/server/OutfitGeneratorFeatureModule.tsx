'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ThemeConfig } from '../../types/theme';

interface OutfitGeneratorFeatureModuleProps {
  theme: ThemeConfig;
}

interface TagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface CardProps {
  image: {
    id: number;
    src: string;
    alt: string;
  };
  hasViewMore?: boolean;
  className?: string;
  onClick?: () => void;
}

function Tag({ label, isActive, onClick }: TagProps) {
  return (
    <div
      className="px-2 py-1.5 sm:px-4 sm:py-3 text-xs sm:text-base leading-relaxed text-white flex items-center justify-center"
      style={{ 
        fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif",
        fontWeight: 500,
        background: 'rgba(255, 255, 255, 0.18)',
        borderRadius: '4px',
        outline: '0.40px solid rgba(255, 255, 255, 0.40)',
        outlineOffset: '-0.40px'
      }}
    >
      {label}
    </div>
  );
}

function Card({ image, hasViewMore = false, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`relative w-full aspect-[268/356] overflow-hidden group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 35vw, 30vw"
        priority
      />
      {hasViewMore && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button className="bg-white text-black px-1.5 py-1 md:px-2 md:py-1.5 rounded-lg font-bold text-xs md:text-sm hover:bg-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              Discover more
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutfitGeneratorFeatureModule({ theme }: OutfitGeneratorFeatureModuleProps) {
  const router = useRouter();

  const tags = ['Evening Wear', 'Casual', 'Professional', 'Sportswear', 'Kidswear'];

  // 固定的5张图片
  const staticImages = [
    {
      id: 1,
      src: '/marketing/images/outfit-generator/onee.png',
      alt: 'Fashion inspiration 1'
    },
    {
      id: 2,
      src: '/marketing/images/outfit-generator/twoo.png',
      alt: 'Fashion inspiration 2'
    },
    {
      id: 3,
      src: '/marketing/images/outfit-generator/threee.png',
      alt: 'Fashion inspiration 3'
    },
    {
      id: 4,
      src: '/marketing/images/outfit-generator/fourr.png',
      alt: 'Fashion inspiration 4'
    },
    {
      id: 5,
      src: '/marketing/images/outfit-generator/fivee.png',
      alt: 'Fashion inspiration 5'
    },
    {
      id: 6,
      src: '/marketing/images/outfit-generator/six.png',
      alt: 'Fashion inspiration 6'
    }
  ];

  // 处理图片点击
  const handleImageClick = () => {
    router.push('/designs');
  };

  return (
    <section className="bg-black py-8 sm:py-16 overflow-hidden">
      {/* Title and Tags - constrained container to align with other components */}
      <div className="max-w-7xl lg:max-w-[1450px] xl:max-w-[1550px] 2xl:max-w-[1650px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Title */}
        <div className="text-left mb-6 sm:mb-12">
          <h2 className="fusion-title !text-left pl-4 sm:pl-0">
            Explore Fashion Inspirations
          </h2>
        </div>

        {/* Tags */}
        <div className="flex justify-start mb-8 sm:mb-16 pl-4 sm:pl-0">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-start">
            {tags.map((tag) => (
              <Tag
                key={tag}
                label={tag}
                isActive={false}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid - with contained overflow for cropped effect */}
      <div className="w-full overflow-hidden relative" style={{ zIndex: 0 }}>
        {/* Mobile: 2x3 Grid, Desktop: Horizontal scroll */}
        <div className="block sm:hidden px-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {staticImages.slice(0, 6).map((image, index) => (
              <div key={image.id} className="w-full relative">
                <Card
                  image={image}
                  hasViewMore={false}
                  onClick={handleImageClick}
                  className="rounded-lg sm:rounded-none"
                />
                {/* 为最后两张图片（index 4和5）添加底部蒙版 */}
                {index >= 4 && (
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, black 100%)'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile: Discover more button */}
          <div className="flex justify-center -mt-20 relative z-30">
            <button 
              onClick={handleImageClick}
              className="bg-white text-black px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              Discover More
            </button>
          </div>
        </div>

        {/* Desktop: Horizontal scroll */}
        <div 
          className="hidden sm:flex gap-2 md:gap-3 lg:gap-4 mb-6 relative"
          style={{ 
            width: 'calc(100% + 16rem)', // Extend beyond viewport significantly
            marginLeft: '-8rem' // Center the extended grid
          }}
        >
          {staticImages.map((image) => (
            <div key={image.id} className="flex-shrink-0 w-72 md:w-80 lg:w-96">
              <Card
                image={image}
                hasViewMore={false}
                onClick={handleImageClick}
              />
            </div>
          ))}
          
          {/* Desktop: Discover more button - positioned over images */}
          <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none z-20">
            <button 
              onClick={handleImageClick}
              className="bg-white text-black px-4 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-colors flex items-center gap-2 pointer-events-auto"
            >
              Discover more
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Subtle fade mask at bottom - only for desktop */}
        <div 
          className="hidden sm:block absolute inset-x-0 bottom-0 h-2/3 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 10%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.3) 75%, transparent 100%)'
          }}
        />


       
      </div>
    </section>
  );
}
