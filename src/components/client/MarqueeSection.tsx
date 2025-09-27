"use client";

import React from 'react';

const MarqueeSection: React.FC = () => {
  const logos = [
   
    { src: '/marketing/images/main/endor/on.svg', alt: 'Ones Logo' },
    { src: '/marketing/images/main/endor/first.svg', alt: 'First Logo' },
    { src: '/marketing/images/main/endor/two.svg', alt: 'Two Logo' },
    { src: '/marketing/images/main/endor/three.svg', alt: 'Three Logo' },
    { src: '/marketing/images/main/endor/four.svg', alt: 'Four Logo' },
    { src: '/marketing/images/main/endor/five.svg', alt: 'Five Logo' },
    { src: '/marketing/images/main/endor/six.svg', alt: 'Six Logo' },
    { src: '/marketing/images/main/endor/sevens.svg', alt: 'Seven Logo' },
  ];

  // 移动端分组
  const firstRowLogos = logos.slice(0, 5); // 前5张：on, first, two, three, four
  const secondRowLogos = logos.slice(5); // 后3张：five, six, sevens

  const renderLogoItems = (logoList = logos) => (
    <>
      {logoList.map((logo, index) => (
        <div key={index} className="trusted-by-logo-item">
          <img src={logo.src} alt={logo.alt} className="trusted-by-logo" />
        </div>
      ))}
    </>
  );

  return (
    <>
      <style jsx>{`
        @font-face {
          font-family: 'InstrumentSans';
          src: url('/marketing/fonts/InstrumentSans-VariableFont_wdth,wght.ttf') format('truetype');
          font-weight: 100 900;
          font-display: swap;
        }

        .trusted-by-section {
          text-align: center;
          margin: 0;
          background-color: #000000;
          padding: 80px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          width: 100%;
        }

        .title-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          padding: 0 30px;
          position: relative;
          z-index: 2;
        }
        
        
        .trusted-by-title {
          font-family: 'InstrumentSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 1.6rem;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 300;
          padding: 0 30px;
          margin: 0;
        }
        
        @media (min-width: 768px) {
          .trusted-by-title {
            font-size: 2rem;
            margin: 0;
          }
            .title-container {
             margin-bottom: 80px;
      }
        }

        .trusted-by-logo-group {
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          width: 100%;
        }

        .trusted-by-logo-w {
          display: inline-block;
          animation: scroll-left 15s linear infinite;
        }

        .trusted-by-logo-strip-c {
          display: inline-flex;
          align-items: center;
          gap: 60px;
        }

        .trusted-by-logo-item {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
        }

        .trusted-by-logo {
          height: 60px;
          width: auto;
          object-fit: contain;
          filter: grayscale(100%) opacity(0.7);
          transition: all 0.3s ease;
        }

        .trusted-by-logo:hover {
          filter: grayscale(0%) opacity(1);
          transform: scale(1.1);
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .mobile-reverse {
          animation: scroll-right 12s linear infinite !important;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .trusted-by-logo-strip-c {
            gap: 40px;
          }
          
          .trusted-by-logo {
            height: 45px;
          }
          
          .trusted-by-logo-item {
            padding: 0 15px;
          }
        }

        /* 为了确保无缝滚动，我们需要两个相同的条带 */
        .trusted-by-logo-group::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 50px;
          background: linear-gradient(to right, #000000, transparent);
          z-index: 1;
        }

        .trusted-by-logo-group::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 50px;
          background: linear-gradient(to left, #000000, transparent);
          z-index: 1;
        }
      `}</style>
      
      <div className="trusted-by-section">
        <div className="title-container">
            <div className="h-0.5 bg-white/20 flex-1 max-w-32"></div>
            <div className="trusted-by-title">Trusted by</div>
            <div className="h-0.5 bg-white/20 flex-1 max-w-32"></div>
        </div>
        
        {/* 桌面端 - 单行滚动 */}
        <div className="trusted-by-logo-group hidden md:block">
          <div className="trusted-by-logo-w">
            <div className="trusted-by-logo-strip-c">
              {renderLogoItems()}
            </div>
          </div>
          <div className="trusted-by-logo-w">
            <div className="trusted-by-logo-strip-c">
              {renderLogoItems()}
            </div>
          </div>
        </div>

        {/* 移动端 - 双行滚动 */}
        <div className="md:hidden space-y-6">
          {/* 第一行 - 前5张 */}
          <div className="trusted-by-logo-group">
            <div className="trusted-by-logo-w">
              <div className="trusted-by-logo-strip-c">
                {renderLogoItems(firstRowLogos)}
              </div>
            </div>
            <div className="trusted-by-logo-w">
              <div className="trusted-by-logo-strip-c">
                {renderLogoItems(firstRowLogos)}
              </div>
            </div>
          </div>

          {/* 第二行 - 后3张 */}
          <div className="trusted-by-logo-group">
            <div className="trusted-by-logo-w mobile-reverse">
              <div className="trusted-by-logo-strip-c">
                {renderLogoItems(secondRowLogos)}
              </div>
            </div>
            <div className="trusted-by-logo-w mobile-reverse">
              <div className="trusted-by-logo-strip-c">
                {renderLogoItems(secondRowLogos)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarqueeSection;
