
import React from 'react';
import Image from 'next/image';

const HowToUse: React.FC = () => {
  // 定义自定义字体样式
  const customFontStyle = {
    fontFamily: `'Inter-Regular-9', 'Inter', system-ui, sans-serif`,
    lineHeight: '1.5', // 确保行高生效
  };
  return (
    <div className="w-full bg-[#222222]">
      {/* 第一步：Input Your Idea */}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full min-h-[780px] md:min-h-[1000px] lg:min-h-[780px]">
      {/* 图片区域 */}
      <div className="relative w-full h-[60vh] md:h-[600px] lg:w-1/2 lg:h-[780px]">
        {/* 背景图片 */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/marketing/images/main/how/how-to-use-image.jpg"
            alt="Fashion model in elegant dress"
            fill
            className="object-cover"
          />
        </div>
        
        {/* 气泡提示框 */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 lg:bottom-[30px] w-[calc(100%-4rem)] max-w-[500px] lg:w-[500px] flex flex-col">
          <div className="backdrop-blur-[49px] bg-white/60 rounded-2xl lg:rounded-lg px-6 py-4 lg:px-6 lg:py-4 shadow-[0px_12px_49px_0px_rgba(0,0,0,0.06)] relative">
            <div className="flex items-center gap-2">
              <p 
                className="text-[#161617] text-lg lg:text-2xl font-normal lg:font-light tracking-[-0.18px] flex-1"
                style={customFontStyle}
              >
                A stylish female model with short black hair, wearing a strapless black dress, photographed in a glossy tiled room with dramatic lighting.
              </p>
            </div>
            {/* 左下角图标 - 仅移动端显示 */}
            <div className="absolute -bottom-5 left-4 w-6 h-6 lg:hidden">
              <Image
                src="/marketing/images/main/how/pubber.png"
                alt="Bubble indicator"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          </div>
          
          {/* 底部小箭头指示器 */}
          <div className="w-[63px] h-[30px] relative ml-4 hidden lg:block">
            <Image
              src="/marketing/images/main/how/d.svg"
              alt="Arrow indicator"
              width={50}
              height={30}
              className="absolute left-4 top-0"
            />
          </div>
        </div>
      </div>

      {/* 文字内容区域 */}
      <div className="w-full h-[40vh] md:h-[400px] lg:w-1/2 lg:h-full flex flex-col justify-center items-start lg:items-center gap-6 lg:gap-8 px-6 py-8 lg:p-0">
        <div className="flex flex-col items-start lg:items-center gap-4 lg:gap-6 w-full">
          {/* 步骤标签 */}
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 lg:px-6 lg:py-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.19)' }}>
            <span 
              className="text-xl lg:text-3xl font-medium leading-[1.21] text-center bg-gradient-to-b from-white to-[#999999] bg-clip-text text-transparent font-['Inter',system-ui,sans-serif]"
            >
              How to use-01
            </span>
          </div>
          
          {/* 主标题 */}
          <h2 className="text-white text-3xl lg:text-6xl font-normal leading-[1.22] text-left lg:text-center font-['Instrument_Sans',system-ui,sans-serif]">
            Input Your Idea
          </h2>
        </div>
        
        {/* 描述文字 */}
        <div className="text-white/70 text-lg lg:text-2xl font-normal leading-[1.21] text-left lg:text-center font-['Inter',system-ui,sans-serif] max-w-2xl lg:px-0">
          Type a prompt, upload a sketch, or add a reference image — it's simple, even without design expertise.
        </div>
      </div>
    </div>

    {/* 第二步：Generate Designs */}
    <div className="flex flex-col lg:flex-row justify-between items-center w-full min-h-[780px]">
      {/* 图片网格区域 */}
      <div className="relative w-full h-[60vh] md:h-[600px] lg:w-1/2 lg:h-[780px] lg:order-2">
        <Image
          src="/marketing/images/main/how/how_two.png"
          alt="Design generation showcase"
          fill
          className="object-cover"
        />
      </div>

      {/* 文字内容区域 */}
      <div className="w-full h-[40vh] md:h-[400px] lg:w-1/2 lg:h-full flex flex-col justify-center items-start lg:items-center gap-6 lg:gap-8 px-6 py-8 lg:p-0 lg:order-1">
        <div className="flex flex-col items-start lg:items-center gap-4 lg:gap-6 w-full">
          {/* 步骤标签 */}
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 lg:px-6 lg:py-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.19)' }}>
            <span 
              className="text-xl lg:text-3xl font-medium leading-[1.21] text-center bg-gradient-to-b from-white to-[#999999] bg-clip-text text-transparent font-['Inter',system-ui,sans-serif]"
            >
              How to use-02
            </span>
          </div>
          
          {/* 主标题 */}
          <h2 className="text-white text-3xl lg:text-6xl font-normal leading-[1.22] text-left lg:text-center font-['Instrument_Sans',system-ui,sans-serif]">
            Generate Designs
          </h2>
        </div>
        
        {/* 描述文字 */}
        <div className="text-white/70 text-lg lg:text-2xl font-normal leading-[1.21] text-left lg:text-center font-['Inter',system-ui,sans-serif] max-w-2xl lg:px-0">
          AI delivers multiple fashion-ready concepts in seconds, with variations in fabrics, styles, and patterns.
        </div>
      </div>
     
    </div>

    {/* 第三步：Go to Production */}
    <div className="flex flex-col lg:flex-row justify-between items-center w-full min-h-[780px]">
      {/* 图片展示区域 */}
      <div className="relative w-full h-[60vh] md:h-[600px] lg:w-1/2 lg:h-[780px] overflow-hidden">
        {/* 全屏背景图片 */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/marketing/images/main/how/how_three.png"
            alt="Fashion background"
            fill
            className="object-cover"
          />
        </div>
        
        {/* 黑色半透明遮罩层 */}
        <div className="absolute inset-0 w-full h-full bg-black/20 backdrop-blur-[100px] py-20 pl-28">
          <div className="relative w-full h-full">
            <Image
              src="/marketing/images/main/how/how_three_img.png"
              alt="Production mockup"
              fill
             className="object-right"
            />
          </div>
        </div>
        
        {/* 中央白色mockup框架 */}
     
      </div>

      {/* 文字内容区域 */}
      <div className="w-full h-[40vh] md:h-[400px] lg:w-1/2 lg:h-full flex flex-col justify-center items-start lg:items-center gap-6 lg:gap-8 px-6 py-8 lg:p-0">
        <div className="flex flex-col items-start lg:items-center gap-4 lg:gap-6 w-full">
          {/* 步骤标签 */}
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 lg:px-6 lg:py-3 rounded-lg" style={{ background: 'rgba(181, 181, 181, 0.19)' }}>
            <span 
              className="text-xl lg:text-3xl font-medium leading-[1.21] text-center bg-gradient-to-b from-white to-[#999999] bg-clip-text text-transparent font-['Inter',system-ui,sans-serif]"
            >
              How to use-03
            </span>
          </div>
          
          {/* 主标题 */}
          <h2 className="text-white text-3xl lg:text-6xl font-normal leading-[1.22] text-left lg:text-center font-['Instrument_Sans',system-ui,sans-serif]">
            Go to Production
          </h2>
        </div>
        
        {/* 描述文字 */}
        <div className="text-white/70 text-lg lg:text-2xl font-normal leading-[1.21] text-left lg:text-center font-['Inter',system-ui,sans-serif] max-w-2xl lg:px-0">
          Download files optimized for prototyping or manufacturing, and move from concept to creation seamlessly.
        </div>
      </div>
      </div>
    </div>
  );
};

export default HowToUse;
