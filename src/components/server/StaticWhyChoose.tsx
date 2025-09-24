import { ThemeConfig } from '../../types/theme';
import Image from 'next/image';

interface StaticWhyChooseProps {
  theme: ThemeConfig;
}

// 主题ID到图片的映射
const getThemeImage = (themeId: string): string => {
  const imageMap: Record<string, string> = {
    'background_remove': '/marketing/images/main/why/background_remover.png',
    'background_change': '/marketing/images/main/why/background_changer.png',
    'image_enhance': '/marketing/images/main/why/enhancer.png',
    'color_change': '/marketing/images/main/why/color_changer.png',
    'virtual_try': '/marketing/images/main/why/virtual_try_on.png',
    'outfit_generator': '/marketing/images/main/why/outfit_generates.png',
    'sketch_convert': '/marketing/images/main/why/sketch.png',
    'partial_modify': '/marketing/images/main/why/changer.png',
    'free_nano_banana': '/marketing/images/main/why/nano.png',
    'design_page': '/marketing/images/main/why/virtual.png',
    'agent_page': '/marketing/images/main/why/agentes.png'
  };
  
  return imageMap[themeId] || '/marketing/images/choose/virtual_try_on.png';
};

export default function StaticWhyChoose({ theme }: StaticWhyChooseProps) {
  const { whyChoose } = theme;

  if (!whyChoose || !whyChoose.cards) {
    return null;
  }

  // 确保有4个卡片，如果不足则补充空卡片
  const cards = [...whyChoose.cards];
  while (cards.length < 4) {
    cards.push({
      title: '',
      description: ''
    });
  }

  return (
    <section className="w-full bg-black text-white pt-8 pb-0 md:py-24">
      <div className="max-w-7xl lg:max-w-[1450px] xl:max-w-[1550px] 2xl:max-w-[1650px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Main Title */}
        <div className="mb-8 md:mb-16">
          <h2 className="fusion-title text-center lg:!text-left mb-4 pl-4 sm:pl-0">
            {whyChoose.title}
          </h2>
        </div>

        {/* Mobile: Stack Layout, Desktop: Left-Right Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center">
          {/* Image - Mobile: First, Desktop: Left */}
          <div className="relative order-1 lg:order-1">
            <div className="relative w-full lg:mx-0 h-[300px] sm:h-[400px] md:h-[450px] lg:h-[550px] xl:h-[650px] overflow-hidden">
              <Image
                src={getThemeImage(theme.id)}
                alt={`${theme.name} Technology`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Cards - Mobile: Second (Stack), Desktop: Right (Grid) */}
          <div className="order-2 lg:order-2">
            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col gap-6">
              {cards.slice(0, 4).map((card, index) => (
                <div
                  key={index}
                  className={`
                    group relative p-6 transition-all duration-300
                    ${!card.title ? 'opacity-50' : ''}
                  `}
                >
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors text-left">
                      {card.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors text-left">
                      {card.description || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Layout - 2x2 Grid with Dynamic Cross */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-x-0 gap-y-0 relative">
                {/* Top Row */}
                <div className="relative border-r border-b border-[#454545] p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors text-left">
                      {cards[0]?.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors text-left">
                      {cards[0]?.description || ''}
                    </p>
                  </div>
                </div>
                
                <div className="relative border-b border-[#454545] p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors text-left">
                      {cards[1]?.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors text-left">
                      {cards[1]?.description || ''}
                    </p>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="relative border-r border-[#454545] p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors text-left">
                      {cards[2]?.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors text-left">
                      {cards[2]?.description || ''}
                    </p>
                  </div>
                </div>
                
                <div className="relative p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors text-left">
                      {cards[3]?.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors text-left">
                      {cards[3]?.description || ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
