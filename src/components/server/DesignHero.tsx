import Image from 'next/image';
import StaticNavigation from './StaticNavigation';
import ClientHeroInteractions from '../client/ClientHeroInteractions';
import ClientGeneralWorkflowInteractions from '../client/ClientGeneralWorkflowInteractions';

interface DesignHeroProps {
  saasUrl: string;
}

export default function DesignHero({ saasUrl }: DesignHeroProps) {
  return (
    <section className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/marketing/images/background.png)'}}>
      {/* 导航栏 */}
      <StaticNavigation currentSaasUrl={saasUrl} />
      
      {/* 下拉菜单容器 - 由客户端组件管理显示 */}
      <div className="dropdown-container"></div>
      
      {/* 主要内容区域 */}
      <div className="pt-20 pb-16 px-4">
        <div className="mx-auto" style={{ maxWidth: '1600px' }}>
          {/* Hero 卡片容器 */}
          <div 
            className="rounded-[40px] pl-8 border-2 border-white/20 flex items-center justify-between overflow-hidden relative"
            style={{
              backgroundColor: 'transparent',
              minHeight: '300px',
              width: '100%',
              margin: '0 auto'
            }}
          >
            {/* 左侧内容 */}
            <div className="flex-1 max-w-[780px]">
              <div className="pl-[60px]">
                {/* 标题 */}
                <h1 
                  className="text-white mb-6"
                  style={{
                    fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif",
                    fontWeight: '800',
                    fontSize: '44px',
                    lineHeight: '1.32',
                    textAlign: 'left'
                  }}
                >
                  Discover Design Ideas
                </h1>
                
                {/* 描述文本 */}
                <p 
                  className="text-white"
                  style={{
                    fontFamily: "'Neue Machina', system-ui, -apple-system, sans-serif",
                    fontWeight: '400',
                    fontSize: '20px',
                    lineHeight: '0.98',
                    textAlign: 'left',
                    maxWidth: '750px'
                  }}
                >
                  Find inspiration for your next collection with AI fashion design ideas, spanning casualwear, couture, and avant-garde styles — explore a wide range of looks to spark creativity and bring bold concepts to life.
                </p>
              </div>
            </div>
            
            {/* 右侧图片区域 */}
            <div className="relative flex-shrink-0" style={{ width: '600px', height: '350px' }}>
              {/* 背景渐变 */}
              {/* <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(244deg, rgba(217, 217, 217, 1) 0%, rgba(115, 115, 115, 0) 100%)'
                }}
              /> */}
              
              {/* 主要图片 - 背景大图 */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <Image
                  src="/images/design/design-hero-main.png"
                  alt="AI Fashion Design Ideas"
                  width={1200}
                  height={1300}
                  className="absolute"
                                          style={{ 
                        right: '-50px',
                        top: '-160px',
                        width: '1200px',
                        height: '700px',
                        objectFit: 'contain',
                        transform: 'rotate(-15deg)',
                        opacity: '0.5',
                        maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,1) 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,1) 100%)'
                      }}
                  priority
                />
                
                {/* 左边模糊蒙版 */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-4/5 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to right, rgba(44, 20, 151, 0.6) 0%, rgba(44, 20, 151, 0.3) 30%, rgba(20, 5, 78, 0.15) 50%, rgba(48, 21, 159, 0.05) 70%, rgba(48, 21, 159, 0.01) 85%, transparent 100%)',
                    filter: 'blur(120px)'
                  }}
                />
                
                {/* 中间图片 */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <Image
                    src="/images/design/design-hero-secondary-2d88c0.png"
                    alt="Fashion Design Collection"
                    width={458}
                    height={519}
                    className="object-contain"
                    style={{ 
                      width: '300px',
                      height: 'auto'
                    }}
                  />
                </div>
              </div>
              
              {/* 次要图片 - 前景图 */}
             
            </div>
            
          </div>
          
          {/* 额外内容区域 - 可以添加其他设计工具或功能 */}
          <div className="mt-16">
            {/* 这里可以添加设计工具展示区域 */}
          </div>
        </div>
      </div>
      
      {/* 客户端交互增强 */}
      <ClientHeroInteractions currentSaasUrl={saasUrl} />
      <ClientGeneralWorkflowInteractions />
    </section>
  );
}
