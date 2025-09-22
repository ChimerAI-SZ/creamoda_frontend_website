'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

const AGENT_URL = 'https://agent.chimer-ai.com/';

const AgentHero: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] sm:h-[800px] overflow-hidden">
      {/* 背景图片 - 延伸到顶部以覆盖导航栏区域 */}
      <div 
        className="absolute w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/marketing/images/main/agent/mobile.png')",
          top: '-80px',
          height: 'calc(100% + 80px)'
        }}
      />
      {/* 桌面端背景图片 */}
      <div 
        className="absolute w-full h-full bg-cover bg-center hidden sm:block"
        style={{
          backgroundImage: "url('/marketing/images/main/agent/background.png')",
          top: '-80px',
          height: 'calc(100% + 80px)'
        }}
      />
      
      {/* 渐变叠加层 - 也延伸到顶部 */}
      <div 
        className="absolute w-full h-full"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 53%)',
          top: '-80px',
          height: 'calc(100% + 80px)'
        }}
      />

      {/* 主要内容 */}
      <div className="absolute bottom-4 sm:relative sm:z-10 w-full flex flex-col items-center sm:justify-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-52 sm:pt-40 md:pt-52 lg:pt-60 sm:pb-20 md:pb-28 lg:pb-32">
        {/* 主标题 */}
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14 leading-tight px-4"
          style={{ 
            fontFamily: 'Instrument Sans',
            textShadow: '0px 0px 50px rgba(0, 0, 0, 0.25)'
          }}
        >
          Turn Creative Concepts into Complete Fashion Designs with AI.
        </h1>

        {/* 输入和按钮区域 */}
        <div className="flex flex-col gap-4 items-center justify-center w-full max-w-4xl">
          {/* 主输入框 */}
          <div 
            className="bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0px_0px_34px_0px_rgba(0,0,0,0.25)] p-4 sm:p-8 w-full flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-white/25 transition-colors"
            onClick={() => window.open(AGENT_URL, '_blank')}
          >
            <input
              type="text"
              placeholder="Type your idea…"
              className="flex-1 bg-transparent text-white/70 text-lg sm:text-2xl font-normal placeholder:text-white/70 border-none outline-none tracking-[-0.18px] leading-6 cursor-pointer"
              style={{ fontFamily: 'Inter, sans-serif' }}
              readOnly
              onClick={() => window.open(AGENT_URL, '_blank')}
            />
            <button 
              className="bg-white rounded-full p-1.5 hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                window.open(AGENT_URL, '_blank');
              }}
            >
              <ArrowUp className="w-4.5 h-4.5 text-black " />
            </button>
          </div>

          {/* 生成功能按钮区域 - 移动端 */}
          <div className="flex justify-between w-full gap-2 sm:hidden">
            {[
              { main: 'Generate', sub: 'Inspiration' },
              { main: 'Generate', sub: 'Cover' },
              { main: 'Generate', sub: 'Patterns' }
            ].map((textObj, index) => (
              <button
                key={index}
                className="bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl shadow-[0px_0px_34px_0px_rgba(0,0,0,0.25)] px-2 py-3 flex items-center justify-between gap-2 hover:bg-white/30 transition-colors flex-1 min-h-[55px]"
                onClick={() => window.open(AGENT_URL, '_blank')}
              >
                <div className="flex flex-col items-start justify-center gap-0.5 flex-1">
                  <span 
                    className="text-white text-sm font-semibold tracking-[-0.18px] leading-tight"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {textObj.main}
                  </span>
                  <span 
                    className="text-white text-sm font-semibold tracking-[-0.18px] leading-tight"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {textObj.sub}
                  </span>
                </div>
                <div className="rotate-90 flex-shrink-0">
                  <div className="bg-white/20 rounded-full p-1">
                    <ArrowUp className="w-4 h-4 text-white" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 生成功能按钮区域 - 桌面端 */}
          <div className="hidden sm:flex justify-between w-full gap-2">
            {[
              { main: 'Generate', sub: 'Inspiration' },
              { main: 'Generate', sub: 'Cover' },
              { main: 'Generate', sub: 'Patterns' },
              { main: 'Generate', sub: 'Pieces' },
              { main: 'Generate', sub: 'Fabrics' },
              { main: 'Generate', sub: 'Key Colors' }
            ].map((textObj, index) => (
              <button
                key={index}
                className="bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl shadow-[0px_0px_34px_0px_rgba(0,0,0,0.25)] px-3 py-4 flex items-center justify-between gap-2 hover:bg-white/30 transition-colors flex-1 min-h-[70px]"
                onClick={() => window.open(AGENT_URL, '_blank')}
              >
                <div className="flex flex-col items-start justify-center gap-0.5 flex-1">
                  <span 
                    className="text-white text-sm font-semibold tracking-[-0.18px] leading-tight"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {textObj.main}
                  </span>
                  <span 
                    className="text-white text-sm font-semibold tracking-[-0.18px] leading-tight"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {textObj.sub}
                  </span>
                </div>
                <div className="rotate-90 flex-shrink-0">
                  <div className="bg-white/20 rounded-full p-1">
                    <ArrowUp className="w-4 h-4 text-white" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default AgentHero;
