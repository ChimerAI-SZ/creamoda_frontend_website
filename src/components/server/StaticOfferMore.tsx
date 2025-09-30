'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

interface FeatureCard {
  id: string
  title: string
  description: string
  image: string
  gradientOverlay: string
}

const featureCards: FeatureCard[] = [
  // {
  //   id: 'fashion-agent',
  //   title: 'Fashion Agent',
  //   description: 'Streamline design, prototyping, and marketing with an end-to-end AI fashion assistant.',
  //   image: '/marketing/images/main/offer/nine.png',
  //   gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  // },
  {
    id: 'outfit-generator',
    title: 'AI Outfit Generator',
    description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.',
    image: '/marketing/images/main/offer/eight.png',
    gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  },
  {
    id: 'sketch-converter',
    title: 'AI Sketch to Image Converter',
    description: 'Turn garment sketches into realistic images for prototyping and presentations.',
    image: '/marketing/images/main/offer/four.png',
    gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  },
  {
    id: 'virtual-tryon',
    title: 'AI Virtual Try-On',
    description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.',
    image: '/marketing/images/main/offer/five.png',
    gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  },
  {
    id: 'background-remover',
    title: 'Image background remover',
    description: 'Instantly cut out subjects and get a clean,transparent PNG in seconds..',
    image: '/marketing/images/main/offer/one.png',
    gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  },
  {
    id: 'background-changer',
    title: 'Image background Changer',
    description: 'Replace any background with custom colors, images, or scenes.',
    image: '/marketing/images/main/offer/two.png',
    gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  },
  {
    id: 'image-enhancer',
    title: 'Image Enhancer',
    description: 'Boost image resolution up to 2× without losing sharpness or detail.',
    image: '/marketing/images/main/offer/six.png',
    gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  },
  {
    id: 'image-changer',
    title: 'AI Image Changer',
    description: 'Edit or replace only the areas you select, keeping the rest untouched.',
    image: '/marketing/images/main/offer/seven.png',
    gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  },
  {
    id: 'color-changer',
    title: 'Image Color Changer',
    description: 'Instantly swap product or object colors with realistic results.',
    image: '/marketing/images/main/offer/three.png',
    gradientOverlay: 'bg-gradient-to-t from-black/20 to-transparent'
  }
]

// 功能ID到路径的映射
const featureRouteMap: Record<string, string> = {
  'fashion-agent': '/fashion-agent',
  'background-remover': '/image-background-remover',
  'background-changer': '/image-background-changer',
  'color-changer': '/image-color-changer',
  'sketch-converter': '/sketch-to-image',
  'virtual-tryon': '/virtual-try-on',
  'outfit-generator': '/outfit-generator',
  'image-enhancer': '/image-enhancer',
  'image-changer': '/image-changer'
}

const StaticOfferMore: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeButton, setActiveButton] = useState<'left' | 'right' | null>(null)

  // 根据当前路径过滤掉对应的功能卡片
  const getFilteredFeatureCards = () => {
    // 根据路径找到对应的功能ID
    const currentFeatureId = Object.keys(featureRouteMap).find(
      featureId => featureRouteMap[featureId] === pathname
    )
    
    // 过滤掉当前页面的功能卡片
    return featureCards.filter(card => card.id !== currentFeatureId)
  }

  const filteredCards = getFilteredFeatureCards()

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      setActiveButton('left')
      scrollContainerRef.current.scrollBy({
        left: -360,
        behavior: 'smooth'
      })
      // Reset active state after a short delay
      setTimeout(() => setActiveButton(null), 200)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      setActiveButton('right')
      scrollContainerRef.current.scrollBy({
        left: 360,
        behavior: 'smooth'
      })
      // Reset active state after a short delay
      setTimeout(() => setActiveButton(null), 200)
    }
  }

  const handleTryNow = (featureId: string) => {
    // 根据功能ID获取对应的路径
    const route = featureRouteMap[featureId]
    if (route) {
      router.push(route)
    } else {
      console.warn(`No route found for feature: ${featureId}`)
    }
  }

  // Initialize scroll state on mount and when cards change
  useEffect(() => {
    checkScrollButtons()
    
    // Add resize listener for responsive behavior
    const handleResize = () => checkScrollButtons()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [filteredCards.length]) // Re-run when number of cards changes

  return (
    <section className="w-full bg-black text-white overflow-visible">
      {/* Header Section - Constrained width */}
      <div className="max-w-7xl lg:max-w-[1450px] xl:max-w-[1550px] 2xl:max-w-[1650px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-12 lg:pt-20 pb-8 lg:pb-10">
        <div className="flex items-center justify-between">
          <h2 className="fusion-title !text-left pl-4 sm:pl-0">
            We Offer More
          </h2>
          
          {/* Navigation Controls - Hidden on mobile */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                !canScrollLeft 
                  ? 'bg-[#151515] cursor-not-allowed opacity-50' 
                  : 'bg-[#292929] hover:bg-[#3a3a3a]'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                !canScrollRight 
                  ? 'bg-[#151515] cursor-not-allowed opacity-50' 
                  : 'bg-[#292929] hover:bg-[#3a3a3a]'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Container - Full width with responsive padding */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex gap-6 md:gap-8 lg:gap-10 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none'
        }}
      >
        {filteredCards.map((card, index) => (
          <div key={card.id} className="flex-none first:ml-0 last:mr-0">
            <FeatureCard 
              card={card}
              onTryNow={() => handleTryNow(card.id)}
            />
          </div>
        ))}
      </div>

      {/* Mobile Navigation Controls - Constrained width */}
      <div className="max-w-7xl lg:max-w-[1450px] xl:max-w-[1550px] 2xl:max-w-[1650px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-12 lg:pb-20">
        <div className="flex md:hidden justify-center gap-4 pt-8">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
              !canScrollLeft 
                ? 'bg-[#151515] cursor-not-allowed opacity-50' 
                : 'bg-[#292929] hover:bg-[#3a3a3a]'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
              !canScrollRight 
                ? 'bg-[#151515] cursor-not-allowed opacity-50' 
                : 'bg-[#292929] hover:bg-[#3a3a3a]'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  card: FeatureCard
  onTryNow: () => void
}

const FeatureCard: React.FC<FeatureCardProps> = ({ card, onTryNow }) => {
  return (
    <div className="relative">
      {/* Card Container */}
      <div className="w-80 h-[490px] rounded-lg overflow-hidden relative group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-gray-800"
            style={{ 
              backgroundImage: `url(${card.image})`,
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Content Panel - Outside of card container to allow overflow */}
      <div className="absolute bottom-6 left-4" style={{ transform: 'translateX(10px)' }}>
        <div className="bg-white p-4 px-5 shadow-[0px_0px_24px_0px_rgba(0,0,0,0.08)] h-[150px] flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-black capitalize tracking-tight leading-tight">
              {card.title}
            </h3>
            
            <p className="text-xs text-black/50 leading-tight mt-2">
              {card.description}
            </p>
          </div>
          
          <div className="mt-auto">
            {/* Gray top line with margins */}
            <div className="mx-0 h-px bg-gray-300 mb-2" />
            
            {/* Try Now Button */}
            <div className="-ml-2">
              <a 
                href={featureRouteMap[card.id] || '#'}
                onClick={(e) => {
                  e.preventDefault()
                  onTryNow()
                }}
                className="inline-flex items-center gap-2 pl-2 bg-white rounded-2xl shadow-[0px_0px_40px_0px_rgba(255,255,255,0.6)] group/btn cursor-pointer"
              >
                <span className="text-[#5F2EFF] font-semibold text-sm">
                  Try now
                </span>
                <div className="w-4 h-4 flex items-center justify-center">
                  <ArrowRight size={12} className="text-[#5F2EFF] stroke-[1.33px]" />
                </div>
              </a>
              {/* Purple bottom line same width as button */}
              <div className="h-px bg-[#5F2EFF] ml-2" style={{ width: '55px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaticOfferMore

