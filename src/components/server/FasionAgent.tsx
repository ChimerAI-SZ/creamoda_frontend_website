import React from 'react';
import Link from 'next/link';
import { ImageIcon, LinkIcon, ArrowUp } from 'lucide-react';

const FashionAgent: React.FC = () => {
  return (
    <Link href="/fashion-agent" className="block">
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[670px] overflow-hidden cursor-pointer">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/marketing/images/main/agent/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Top Gradient Overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-[800px] pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 47%)'
        }}
      />
      
      {/* Bottom Gradient Overlay */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[384px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-8 sm:py-12 lg:py-20 sm:px-8 md:px-16 lg:px-40 xl:px-60">
        {/* Text Content */}
        <div className="flex flex-col items-center gap-6 sm:gap-10 lg:gap-14 w-full max-w-4xl">
          {/* Title and Description */}
          <div className="flex flex-col items-center gap-4 lg:gap-6 text-center">
            <h1 className="text-3xl sm:text-3xl lg:text-5xl font-normal text-white leading-tight" style={{ fontFamily: 'Instrument Sans' }}>
              One Flow, Endless Possibilities
            </h1>
            <p className="hidden sm:block text-base lg:text-xl font-medium text-white/70 leading-tight max-w-4xl">
              Fashion Agent by Chimer AI empowers designers, brands, and creators to turn ideas into valuable designs. By merging AI-powered creativity with practical workflows, we help democratize fashion innovation — making professional-grade design accessible to everyone.
            </p>
          </div>
          
          {/* Input Area - Static Display */}
          <div className="w-full max-w-4xl">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 border border-white/10">
              {/* Mobile Layout - Input and Send Button on Same Row */}
              <div className="flex sm:hidden items-center gap-3">
                <div className="flex-1 bg-transparent border-none text-base text-white/70 flex items-center min-h-[40px]">
                  <span style={{ letterSpacing: '-0.75%' }}>Type your idea…</span>
                </div>
                <div className="bg-white hover:bg-white/90 text-black rounded-full w-8 h-8 p-1.5 flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0">
                  <ArrowUp className="w-full h-full" />
                </div>
              </div>

              {/* Desktop Layout - Original Structure */}
              <div className="hidden sm:flex flex-col gap-3 lg:gap-4 min-h-[120px] lg:min-h-[180px]">
                {/* Input Field - Static */}
                <div className="flex-1">
                  <div className="w-full h-full bg-transparent border-none text-lg lg:text-2xl text-white/70 flex items-center">
                    <span style={{ letterSpacing: '-0.75%' }}>Type your idea…</span>
                  </div>
                </div>
                
                {/* Controls Row - Static */}
                <div className="flex items-center justify-end">
                  {/* Left Side - Image and Link Buttons */}
                  <div className="flex items-center gap-2 mr-auto">
                    <div className="bg-white/10 text-white rounded-full px-3 py-2 h-auto gap-1 flex items-center cursor-pointer hover:bg-white/20 transition-all duration-200">
                      <div className="w-4 h-4">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-normal">Image</span>
                    </div>
                    
                    <div className="bg-white/10 text-white rounded-full px-3 py-2 h-auto gap-1 flex items-center cursor-pointer hover:bg-white/20 transition-all duration-200">
                      <div className="w-4 h-4">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-normal">Link</span>
                    </div>
                  </div>
                  
                  {/* Right Side - Send Button */}
                  <div className="bg-white hover:bg-white/90 text-black rounded-full w-8 h-8 p-1.5 flex items-center justify-center cursor-pointer transition-all duration-200">
                    <ArrowUp className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};

export default FashionAgent;