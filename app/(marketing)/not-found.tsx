import Link from 'next/link';
import StaticNavigation from '@/src/components/server/StaticNavigation';
import StaticFooter from '@/src/components/server/StaticFooter';
import ClientHeroInteractions from '@/src/components/client/ClientHeroInteractions';

export default function NotFound() {

  return (
    <div className="min-h-screen">
      {/* 营销页导航栏和404内容 */}
      <div className="hero-container">
        <div className="hero-background"></div>
        <div className="hero-content">
          <StaticNavigation currentSaasUrl="https://www.creamoda.ai/fashion-design/create" />
          
          {/* 下拉菜单容器 - 由客户端组件管理显示 */}
          <div className="dropdown-container"></div>
          
          {/* 404 内容 */}
          <div className="flex-1 flex items-center justify-center px-4 py-16 mt-20">
            <div className="text-center max-w-2xl">
              <h1 className="text-8xl font-bold text-white mb-8 tracking-tight">
                4<span className="text-purple-400">0</span>4
              </h1>
              <h2 className="text-3xl font-semibold text-gray-200 mb-6">Oops! Page not found</h2>
              <p className="text-gray-400 mb-12 text-lg leading-relaxed">
              The page you’re looking for might have been removed, renamed, or is temporarily unavailable.
              </p>
              
              <div className="space-y-8">
                <Link
                  href="/"
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  Back to Home
                </Link>
                
                <div className="mt-12">
                  <p className="text-gray-300 mb-6 text-lg font-medium">Try our design tools:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <Link href="/image-background-remover" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">Image Background Remover</span>
                    </Link>
                    <Link href="/image-background-changer" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">Image Background Changer</span>
                    </Link>
                    <Link href="/image-enhancer" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">AI Image Enhancer</span>
                    </Link>
                    <Link href="/image-color-changer" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">Image Color Changer</span>
                    </Link>
                    <Link href="/virtual-try-on" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">AI Virtual Try-on</span>
                    </Link>
                    <Link href="/outfit-generator" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">AI Outfit Generator</span>
                    </Link>
                    <Link href="/sketch-to-image" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">AI Sketch to Image Converter</span>
                    </Link>
                    <Link href="/image-changer" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">AI Image Changer</span>
                    </Link>
                    <Link href="/free-nano-banana" className="flex items-center justify-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-purple-500 min-h-[60px]">
                      <span className="text-purple-400 font-medium text-center">Free Nabo-Banana Generator</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 营销页Footer */}
      <StaticFooter />
      
      {/* 客户端交互逻辑 */}
      <ClientHeroInteractions currentSaasUrl="https://www.creamoda.ai/fashion-design/create" />
    </div>
  );
} 