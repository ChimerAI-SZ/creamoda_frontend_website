'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ThemeConfig } from '../../types/theme';
import { getFrontendImages } from '../../../lib/api/common';
import { FrontendImageItem } from '../../../types/frontendImages';

interface OutfitGeneratorFeatureModuleProps {
  theme: ThemeConfig;
}

interface TagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface CardProps {
  image: FrontendImageItem;
  hasViewMore?: boolean;
  className?: string;
  onClick?: () => void;
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

function Card({ image, hasViewMore = false, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`relative w-full 10 aspect-[268/356] rounded-2xl overflow-hidden group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <Image
        src={image.image_url}
        alt={image.clothing_description || "Design inspiration"}
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
  const router = useRouter();
  const [activeTag, setActiveTag] = useState('Evening Wear');
  const [images, setImages] = useState<FrontendImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tags = ['Evening Wear', 'Casual', 'Professional', 'Sportswear', 'Kidswear'];

  // 加载图片数据
  const loadImages = async (category: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getFrontendImages({
        page: 1,
        page_size: 8, // 限制显示8张图片
        type: category
      });

      if (response.code === 0 && response.data) {
        setImages(response.data.list || []);
      } else {
        setError('Failed to load images');
        setImages([]);
      }
    } catch (err) {
      console.error('Failed to load images:', err);
      setError('Failed to load images');
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载和标签切换时重新加载
  useEffect(() => {
    loadImages(activeTag);
  }, [activeTag]);

  // 处理标签切换
  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
  };

  // 处理图片点击
  const handleImageClick = (image: FrontendImageItem) => {
    router.push(`/designs/${image.slug}`);
  };

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
                onClick={() => handleTagChange(tag)}
              />
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="relative -mx-4"> {/* Extend beyond container padding */}
          {/* Full viewport width container with overflow hidden */}
          <div className="overflow-hidden w-full relative">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4 lg:gap-6 mb-6"
                style={{ 
                  width: '120%',
                  marginLeft: '-10%',
                  marginBottom: '-5px'
                }}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="w-full aspect-[268/356] rounded-2xl bg-gray-800 animate-pulse" />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-16">
                <p className="text-white text-lg mb-4">Failed to load images</p>
                <button 
                  onClick={() => loadImages(activeTag)}
                  className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                  style={{ fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif" }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Images Grid */}
            {!isLoading && !error && images.length > 0 && (
              <div 
                className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4 lg:gap-6 mb-6"
                style={{ 
                  
                  width: '120%', // Make grid slightly wider than container
                  marginLeft: '-10%' // Center the grid and create cropped effect
                }}
              >
                {images.map((image, index) => (
                  <Card
                    key={image.id}
                    image={image}
                    hasViewMore={false}
                    onClick={() => handleImageClick(image)}
                    
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && images.length === 0 && (
              <div className="text-center py-16">
                <p className="text-white text-lg">No images found for {activeTag}</p>
              </div>
            )}
            
            {/* Subtle fade mask at bottom */}
            {!isLoading && !error && images.length > 0 && (
              <div 
                className="absolute inset-x-0 bottom-5 h-2/3 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 10%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.3) 75%, transparent 100%)'
                }}
              />
            )}
          </div>

          {/* View more button overlay on images */}
          {!isLoading && !error && images.length > 0 && (
            <div className="absolute inset-x-0 bottom-16 flex justify-center pointer-events-none z-10">
              <button 
                className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors pointer-events-auto"
                style={{ fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif" }}
                onClick={() => router.push('/designs')}
              >
                View more
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
