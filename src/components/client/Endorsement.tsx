'use client';

import Image from 'next/image';

export default function Endorsement() {
  // 品牌数据
  const brands = [
    { src: "/marketing/images/main/endor/ones.svg", alt: "Brand 1", width: 125, height: 40 },
    { src: "/marketing/images/main/endor/two.svg", alt: "Brand 2", width: 345, height: 40 },
    { src: "/marketing/images/main/endor/three.svg", alt: "Brand 3", width: 47, height: 40 },
    { src: "/marketing/images/main/endor/four.svg", alt: "Brand 4", width: 147, height: 40 },
    { src: "/marketing/images/main/endor/five.svg", alt: "Brand 5", width: 227, height: 40 },
    { src: "/marketing/images/main/endor/six.svg", alt: "Brand 6", width: 173, height: 40 },
    { src: "/marketing/images/main/endor/seven.svg", alt: "Brand 7", width: 86, height: 40 },
  ];

  // 移动端分组
  const firstRowBrands = brands.slice(0, 4); // ones, two, three, four
  const secondRowBrands = brands.slice(4); // five, six, seven

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
        {/* 桌面端 - 单行滚动 */}
        <div className="overflow-hidden group hidden md:block">
          <div 
            className="flex items-center gap-16 w-fit"
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
              <div key={`desktop-first-${index}`} className="flex-shrink-0">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={brand.width}
                  height={brand.height}
                  className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
            {/* 第二组品牌（用于无缝循环） */}
            {brands.map((brand, index) => (
              <div key={`desktop-second-${index}`} className="flex-shrink-0">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={brand.width}
                  height={brand.height}
                  className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 移动端 - 双行滚动 */}
        <div className="md:hidden space-y-6">
          {/* 第一行 - 前四张图片 */}
          <div className="overflow-hidden">
            <div 
              className="flex items-center gap-8 w-fit"
              style={{
                animation: 'brandScrollMobile 20s linear infinite',
                animationPlayState: 'running'
              }}
            >
              {/* 第一组 - 前四张 */}
              {firstRowBrands.map((brand, index) => (
                <div key={`mobile-row1-first-${index}`} className="flex-shrink-0">
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={brand.width}
                    height={brand.height}
                    className="h-6 w-auto object-contain opacity-70"
                  />
                </div>
              ))}
              {/* 第二组 - 前四张（用于无缝循环） */}
              {firstRowBrands.map((brand, index) => (
                <div key={`mobile-row1-second-${index}`} className="flex-shrink-0">
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={brand.width}
                    height={brand.height}
                    className="h-6 w-auto object-contain opacity-70"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 第二行 - 后三张图片 */}
          <div className="overflow-hidden">
            <div 
              className="flex items-center gap-8 w-fit"
              style={{
                animation: 'brandScrollMobileReverse 18s linear infinite',
                animationPlayState: 'running'
              }}
            >
              {/* 第一组 - 后三张 */}
              {secondRowBrands.map((brand, index) => (
                <div key={`mobile-row2-first-${index}`} className="flex-shrink-0">
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={brand.width}
                    height={brand.height}
                    className="h-6 w-auto object-contain opacity-70"
                  />
                </div>
              ))}
              {/* 第二组 - 后三张（用于无缝循环） */}
              {secondRowBrands.map((brand, index) => (
                <div key={`mobile-row2-second-${index}`} className="flex-shrink-0">
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={brand.width}
                    height={brand.height}
                    className="h-6 w-auto object-contain opacity-70"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
