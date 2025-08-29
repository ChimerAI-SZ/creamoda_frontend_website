'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  image: string;
  hasViewMore?: boolean;
  className?: string;
}

function Tag({ label, isActive, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-2.5 rounded-lg border transition-all duration-300 font-normal text-sm leading-relaxed
        ${isActive 
          ? 'border-[#704DFF] font-medium' 
          : 'border-gray-300 text-black hover:border-gray-400'
        }
      `}
      style={{ 
        fontFamily: "'Neue Machina', system-ui, -apple-system, sans-serif",
        backgroundColor: isActive ? '#EEEFFF' : '#FFFFFF'
      }}
    >
      {isActive ? (
        <span
          style={{
            background: 'linear-gradient(to bottom, #EEEFFF, #704DFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
}

function Card({ image, hasViewMore = false, className = '' }: CardProps) {
  return (
    <div className={`relative w-full aspect-[268/356] rounded-2xl overflow-hidden group ${className}`}>
      <Image
        src={image}
        alt="Design inspiration"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 25vw, (max-width: 1024px) 17vw, 15vw"
        priority
      />
      {hasViewMore && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
              style={{ fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif" }}>
              View more
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutfitGeneratorFeatureModule({ theme }: OutfitGeneratorFeatureModuleProps) {
  const [activeTag, setActiveTag] = useState('Evening Wear');

  const tags = ['Evening Wear', 'Casual', 'Professional', 'Sportswear', 'Kidswear'];
  
  const cardImages = [
    '/images/outfit-generator/card-image-1.png',
    '/images/outfit-generator/card-image-2.png', 
    '/images/outfit-generator/card-image-3.png',
    '/images/outfit-generator/card-image-4.png',
    '/images/outfit-generator/card-image-5.png',
    '/images/outfit-generator/card-image-6.png',
    '/images/outfit-generator/card-image-1.png', // Repeat images
    '/images/outfit-generator/card-image-2.png',
  ];

  return (
    <section className="bg-black py-16 px-4">
      {/* Title - responsive container */}
      <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-none mx-auto text-center mb-12 px-4">
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
          style={{ 
            fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif",
            fontWeight: '800'
          }}
        >
          Discover More Design Ideas
        </h2>
      </div>

      <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-none mx-auto">
        {/* Tags */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap gap-3 justify-center">
            {tags.map((tag) => (
              <Tag
                key={tag}
                label={tag}
                isActive={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="relative -mx-4"> {/* Extend beyond container padding */}
          {/* Full viewport width container with overflow hidden */}
          <div className="overflow-hidden w-full relative">
            {/* Responsive grid that adapts to screen size */}
            <div 
              className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4 lg:gap-6 mb-6"
              style={{ 
                width: '120%', // Make grid slightly wider than container
                marginLeft: '-10%' // Center the grid and create cropped effect
              }}
            >
              {cardImages.map((image, index) => (
                <Card
                  key={index}
                  image={image}
                  hasViewMore={false} // Remove individual card view more buttons
                />
              ))}
            </div>
            
            {/* White mask at bottom 1/3 */}
            <div 
              className="absolute inset-x-0 bottom-5 h-1/2 bg-gradient-to-t from-white via-white/30 to-transparent pointer-events-none"
            />
          </div>

          {/* View more button overlay on images */}
          <div className="absolute inset-x-0 bottom-16 flex justify-center pointer-events-none z-10">
            <button 
              className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors pointer-events-auto"
              style={{ fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif" }}
            >
              View more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
