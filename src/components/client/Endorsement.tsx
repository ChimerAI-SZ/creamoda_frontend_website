'use client';

import Image from 'next/image';

export default function Endorsement() {
  // 品牌数据
  const brands = [
    { src: "/marketing/images/main/endor/one.svg", alt: "Brand 1", width: 125, height: 40 },
    { src: "/marketing/images/main/endor/two.svg", alt: "Brand 2", width: 345, height: 40 },
    { src: "/marketing/images/main/endor/three.svg", alt: "Brand 3", width: 47, height: 40 },
    { src: "/marketing/images/main/endor/four.svg", alt: "Brand 4", width: 147, height: 40 },
    { src: "/marketing/images/main/endor/five.svg", alt: "Brand 5", width: 227, height: 40 },
    { src: "/marketing/images/main/endor/six.svg", alt: "Brand 6", width: 173, height: 40 },
    { src: "/marketing/images/main/endor/seven.svg", alt: "Brand 7", width: 86, height: 40 },
  ];

  return (
    <>
      <section className="w-full bg-black py-16 md:py-20">
        <div className="w-full">
          {/* Trusted by 标题区域 */}
          <div className="flex items-center justify-center mb-20 md:mb-26 px-4">
            <div className="h-px bg-gray-500 flex-1 max-w-32"></div>
            <h2 className="text-gray-500 text-2xl md:text-3xl font-medium px-6">
              Trusted by
            </h2>
            <div className="h-px bg-gray-600 flex-1 max-w-32"></div>
          </div>
        </div>
      </section>

      {/* 品牌图片 - 自动滚动 */}
      <div className="w-screen bg-black pb-16">
        <div className="overflow-hidden group">
          <div 
            className="flex items-center gap-12 md:gap-16 w-fit"
            style={{
              animation: 'brandScroll 25s linear infinite',
              animationPlayState: 'running'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.animationPlayState = 'paused';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animationPlayState = 'running';
            }}
          >
            {/* 第一组品牌 */}
            {brands.map((brand, index) => (
              <div key={`first-${index}`} className="flex-shrink-0">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={brand.width}
                  height={brand.height}
                  className="h-6 md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
            {/* 第二组品牌（用于无缝循环） */}
            {brands.map((brand, index) => (
              <div key={`second-${index}`} className="flex-shrink-0">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={brand.width}
                  height={brand.height}
                  className="h-6 md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}
