import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function ChasingTrends() {
  return (
    <section className="w-full bg-black text-white py-12 lg:py-20">
      <div className="max-w-7xl lg:max-w-[1450px] xl:max-w-[1550px] 2xl:max-w-[1650px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">


        {/* 内容区域 */}
        <div className="flex flex-col gap-8">
          {/* 圆角容器 */}
          <div className="backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800/30" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
              {/* 移动端：图片在上面，桌面端：图片在右边 */}
              <div className="order-1 lg:order-2 flex-1 lg:max-w-md -my-8 md:-my-12">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden">
                  <Image
                    src="/marketing/images/main/chasing/right.png"
                    alt="Chasing Trends"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              
              {/* 移动端：文字在下面，桌面端：文字在左边 */}
              <div className="order-2 lg:order-1 flex-1 flex flex-col lg:justify-center">
                {/* 标题 */}
                <div className="mb-8 text-left">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white" style={{ lineHeight: '1.2' }}>
                    No More Chasing Trends,<br />
                    Start Creating Them Instead.
                  </h3>
                </div>
                
                {/* 按钮 */}
                <div className="pl-2 text-left">
                  <button className="bg-white text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors">
                    Design now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
