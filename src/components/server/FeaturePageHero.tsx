import Image from 'next/image';
import Link from 'next/link';
import { ThemeConfig } from '../../types/theme';
import DemoThumbnail from '../client/DemoThumbnail';

interface FeaturePageHeroProps {
  theme: ThemeConfig;
  saasUrl: string;
  currentRoute?: string;
}

export default function FeaturePageHero({ theme, saasUrl, currentRoute }: FeaturePageHeroProps) {
  const { heroMain } = theme;
  
  // 判断是否为需要贴合底部的页面
  const shouldStickToBottom = currentRoute === 'virtual-try-on' || currentRoute === 'outfit-generator' || currentRoute === 'image-color-changer';
  
  // 判断是否为需要上移标题的页面
  const shouldMoveUp = currentRoute === 'image-background-changer' || currentRoute === 'image-background-remover' || currentRoute === 'image-enhancer' || currentRoute === 'image-changer' || currentRoute === 'sketch-to-image';
  
  // 根据页面决定左侧图片容器的transform值
  const getLeftImageTransform = () => {
    if (shouldStickToBottom) {
      return 'translateY(0)'; // 贴合底部
    }
    return 'translateY(-30px)'; // 减少向上偏移，更接近居中
  };
  
  // 根据页面决定图片宽高比
  const getImageAspectRatio = () => {
    if (shouldStickToBottom) {
      return '3/3'; // 正方形比例
    }
    return '4/5'; // 更合适的默认比例，避免图片过高
  };
  
  // 根据页面决定图片尺寸的放大系数
  const getSizeMultiplier = () => {
    if (shouldStickToBottom) {
      return 1.2; // 放大20%
    }
    return 1.15; // 其他页面也稍微放大15%
  };
  
  // 根据imageSize配置动态设置图片尺寸（增大尺寸并确保完整显示）
  const getImageSizeStyles = (imageSize?: string) => {
    const multiplier = getSizeMultiplier();
    
    switch (imageSize) {
      case 'small':
        return {
          width: `min(${40 * multiplier}vw, ${500 * multiplier}px)`,
          minWidth: `clamp(${320 * multiplier}px, ${35 * multiplier}vw, ${400 * multiplier}px)`,
          maxWidth: `${500 * multiplier}px`
        };
      case 'medium':
        return {
          width: `min(${45 * multiplier}vw, ${580 * multiplier}px)`,
          minWidth: `clamp(${380 * multiplier}px, ${40 * multiplier}vw, ${480 * multiplier}px)`,
          maxWidth: `${580 * multiplier}px`
        };
      case 'large':
        return {
          width: `min(${50 * multiplier}vw, ${650 * multiplier}px)`,
          minWidth: `clamp(${420 * multiplier}px, ${45 * multiplier}vw, ${550 * multiplier}px)`,
          maxWidth: `${650 * multiplier}px`
        };
      default: // 'default' 或未设置
        return {
          width: `min(${48 * multiplier}vw, ${620 * multiplier}px)`,
          minWidth: `clamp(${400 * multiplier}px, ${42 * multiplier}vw, ${520 * multiplier}px)`,
          maxWidth: `${620 * multiplier}px`
        };
    }
  };
  
  const imageSizeStyles = getImageSizeStyles(heroMain.imageSize);

  return (
    <>
      {/* 添加响应式样式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hero-desktop {
            display: flex !important;
            flex-wrap: wrap !important;
          }
          .hero-mobile {
            display: none !important;
          }
          
          /* 特大屏幕：双列并排 */
          @media (min-width: 1200px) {
            .hero-desktop {
              flex-wrap: nowrap !important;
              justify-content: space-between !important;
            }
          }
          
          /* 大屏幕：压缩右侧组件但仍并排 */
          @media (min-width: 1101px) and (max-width: 1199px) {
            .hero-desktop {
              flex-wrap: nowrap !important;
              justify-content: space-between !important;
              gap: clamp(15px, 2vw, 40px) !important;
            }
            .hero-desktop .upload-showcase {
              width: clamp(300px, 30vw, 400px) !important;
              min-width: 300px !important;
              max-width: 400px !important;
            }
          }
          
          /* 中等屏幕：强制换行，优雅地扩展容器高度 */
          @media (max-width: 1100px) and (min-width: 769px) {
            .hero-container {
              height: auto !important;
              /* 大幅增加高度以确保垂直布局时底部完全显示 */
              min-height: max(100vh, 1250px) !important;
            }
            .hero-background {
              height: 100% !important;
              min-height: 100% !important;
            }
            .hero-desktop {
              flex-wrap: wrap !important;
              justify-content: center !important;
              align-items: flex-start !important;
              gap: 30px !important;
              height: auto !important;
              min-height: auto !important;
              padding-bottom: 60px !important;
              /* 确保内容在容器内正确布局 */
              display: flex !important;
            }
            .hero-desktop > div:first-child {
              flex: 0 0 auto !important;
              max-width: 90vw !important;
              margin-bottom: 0 !important;
            }
            .hero-desktop .upload-showcase {
              flex: 0 0 auto !important;
              width: 90vw !important;
              max-width: 500px !important;
              min-width: 350px !important;
            }
          }
          
          @media (max-width: 768px) {
            .hero-desktop {
              display: none !important;
            }
            .hero-mobile {
              display: flex !important;
            }
          }
          
          /* 确保组件不被压缩 */
          .hero-desktop > div:first-child,
          .hero-desktop .upload-showcase {
            flex-shrink: 0 !important;
          }
          
          /* 覆盖StaticHero中的移动端图片样式 - 使用更高优先级选择器 */
          @media (max-width: 768px) {
            .hero-main.hero-mobile > div:first-child {
              width: calc(100% - 20px) !important;
              margin: 0px 10px 0 10px !important;
              max-width: none !important;
            }
          }
          
        `
      }} />
      
      {/* Desktop Layout */}
      <div className="hero-main hero-desktop" style={{ 
        paddingBottom: 0,
        position: 'relative',
        width: '100vw',
        height: '100vh',
        margin: '0',
        paddingLeft: 'clamp(20px, 3vw, 50px)',
        paddingRight: 'clamp(20px, 3vw, 50px)',
        display: 'flex',
        alignItems: shouldStickToBottom ? 'flex-end' : 'center',
        justifyContent: 'space-between',
        gap: 'clamp(25px, 3vw, 70px)',
        paddingTop: 'calc(var(--hero-nav-height, 75px) + 20px)',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          position: 'relative', 
          alignSelf: shouldStickToBottom ? 'flex-end' : 'center',
          marginBottom: '0', 
          transform: shouldStickToBottom ? getLeftImageTransform() : 'none',
          flex: '0 0 auto', // 不缩放，保持固定尺寸
          flexShrink: 0 // 明确禁止压缩
        }}>
          <div className="sample-image sample-1" style={{
            position: 'relative',
            width: imageSizeStyles.width,
            minWidth: imageSizeStyles.minWidth,
            maxWidth: imageSizeStyles.maxWidth,
            aspectRatio: getImageAspectRatio(),
            borderRadius: '12px',
            overflow: 'hidden',
            flexShrink: 0,
            marginBottom: '0'
          }}>
            <Image
              src={heroMain.mainImage}
              alt={`${heroMain.title} sample image`}
              fill
              className="sample-img"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
            {/* 标题和描述容器 - 统一管理间距 */}
            <div style={{
              position: 'absolute',
              bottom: shouldStickToBottom ? '20%' : (shouldMoveUp ? (heroMain.imageSize === 'medium' ? '20%' : '25%') : (heroMain.imageSize === 'medium' ? '15%' : '20%')),
              left: shouldStickToBottom ? '-20%' : '0%',
              right: shouldStickToBottom ? '-20%' : '0%',
              color: 'white',
              zIndex: 10,
              pointerEvents: 'none',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: 'clamp(42px, 6vw, 72px)',
                fontWeight: '500',
                margin: '0 0 16px 0', // 标题底部16px间距
                fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif",
                lineHeight: '1.1',
                color: 'white',
                width: '100%'
              }}>
                {heroMain.title}
              </h2>
              <p style={{
                fontSize: 'clamp(12px, 1.5vw, 16px)',
                lineHeight: '1.5',
                margin: '0',
                fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif",
                opacity: '0.95',
                maxWidth: '90%',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                {heroMain.subtitle}
              </p>
            </div>
          </div>
        </div>
        
        <div className="upload-showcase" style={{
          flex: '0 0 auto', // 不缩放，保持固定尺寸
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'clamp(350px, 35vw, 500px)', // 进一步减少视窗百分比
          maxWidth: '500px',
          minWidth: '350px',
          alignSelf: 'center',
          flexShrink: 0 // 明确禁止压缩
        }}>
          <div className="upload-demo-area" style={{
            background: 'rgba(0, 0, 0, 0.55)',
            padding: '80px 40px',
            width: '100%',
            textAlign: 'center'
          }}>
            {/* Upload Image Component */}
            <div style={{
              width: '100px',
              height: '100px',
              position: 'relative',
              margin: '0 auto auto'
            }}>
              {/* Background frame - rotated */}
              <div style={{
                width: '50px',
                height: '50px',
                left: '42px',
                top: '10px',
                position: 'absolute',
                transform: 'rotate(20deg)',
                transformOrigin: 'top left',
                opacity: 0.5,
                background: 'rgba(255, 255, 255, 0.35)',
                boxShadow: '-1px 3px 5px rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                border: '2px white solid'
              }} />
              
              {/* Main frame with image */}
              <div style={{
                width: '76.7px',
                height: '76.7px',
                left: '5.4px',
                top: '0px',
                position: 'absolute',
                transform: 'rotate(4deg)',
                transformOrigin: 'top left',
               
                overflow: 'hidden'
              }}>
                <Image
                  src="/marketing/images/hero/upload_img.png"
                  alt="Upload preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            
            <Link 
              href={saasUrl} 
              className="upload-demo-btn"
              style={{
                padding: '18px 32px',
                fontSize: '20px',
                fontWeight: '600',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                minWidth: '200px',
                marginTop: '-15px'
              }}
            >
              <Image
                src="/marketing/images/upload.svg"
                alt="Upload icon"
                width={28}
                height={28}
                className="upload-icon"
              />
              {heroMain.uploadText}
            </Link>
            
            {/* <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              marginTop: '18px', 
              marginBottom: '25px',
              fontSize: '18px'
            }}>
              {heroMain.uploadSubText}
            </p> */}
            
            {/* <button style={{
              background: 'rgba(128, 128, 128, 0.6)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '15px',
              cursor: 'pointer',
              marginBottom: '20px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Image
                src="/marketing/images/light.svg"
                alt="Light icon"
                width={16}
                height={16}
              />
              Upload Tips
            </button> */}
            
            <div style={{
              width: '80%',
              height: '1px',
              background: 'rgba(128, 128, 128, 0.5)',
              margin: '0 auto'
            }}></div>
            
            <div className="demo-suggestions">
              <p style={{ color: 'white', marginBottom: '18px', fontSize: '16px' }}>No image? Try one of these:</p>
              <div className="demo-thumbnails">
                {heroMain.demoImages.map((imageSrc, index) => (
                  <DemoThumbnail 
                    key={index}
                    imageSrc={imageSrc}
                    index={index}
                    title={heroMain.title}
                    saasUrl={saasUrl}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="hero-main hero-mobile" style={{
        paddingTop: 'calc(var(--hero-nav-height, 75px) + 20px)',
        paddingBottom: '0px',
        position: 'relative',
        minHeight: '80vh',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        boxSizing: 'border-box',
        maxHeight: 'none'
      }}>
        {/* Centered Image with Overlay Text */}
        <div style={{
          // width和margin由CSS媒体查询控制
          aspectRatio: '4/5', // 调整宽高比以更好适应图片
          overflow: 'visible', // 改为visible让背景渐变层突破限制
          position: 'relative',
          // borderRadius: '16px',
          flexShrink: 0
        }}>
          {/* 图片内层裁剪容器 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden', // 内层容器负责图片裁剪
            borderRadius: '16px',
            marginBottom: '20px'
          }}>
            <Image
              src={heroMain.mainImage}
              alt={`${heroMain.title} sample image`}
              fill
              className="sample-img"
              style={{ 
                objectFit: 'contain', // 改为contain以完整显示图片
                objectPosition: 'center center',
                
                // 移除遮罩效果，确保图片完整可见
              }}
            />
          </div>
          
          {/* All Content Inside Image */}
          <div style={{
            position: 'absolute',
            bottom: '0px',
            left: '50%', // 居中定位
            transform: 'translateX(-50%)', // 居中偏移
            width: '100vw', // 使用视窗宽度
            color: 'white',
            background: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
             marginBottom: '20px'
          }}>
            {/* 内容容器，保持内边距 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '20px 20px 0 20px' // 顶部和左右有padding，底部无padding
            }}>
            {/* Title and Description */}
            <div style={{
              textAlign: 'left'
            }}>
              <h2 style={{
                fontSize: 'clamp(42px, 6vw, 72px)',
                fontWeight: '500',
                margin: '0 0 12px 0',
                fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif",
                lineHeight: '1.1'
              }}>
                {heroMain.title}
              </h2>
              <p style={{
                fontSize: 'clamp(12px, 1.5vw, 16px)',
                lineHeight: '1.5',
                margin: '0',
                fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif",
                opacity: '0.95',
                maxWidth: '90%'
              }}>
                {heroMain.subtitle}
              </p>
            </div>

            {/* Action Button */}
            <div style={{
              display: 'flex',
              width: '100%',
             
            }}>
              <Link 
                href={saasUrl}
                style={{
                  width: '100%',
                  background: '#6b4ff6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif",
               
                }}
              >
                <Image
                  src="/marketing/images/upload.svg"
                  alt="Upload icon"
                  width={24}
                  height={24}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                {heroMain.uploadText}
              </Link>
            </div>
            </div> {/* 关闭内容容器 */}
          </div> {/* 关闭背景渐变容器 */}
        </div>

        {/* Content Below Image */}
        <div style={{
          width: '100%',
          padding: '24px 20px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '20px'
        }}>

          {/* Demo Images */}
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              color: 'white',
             
              marginBottom: '8px',
              fontSize: '12px',
              fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif"
            }}>
              No image? Try one of these:
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {heroMain.demoImages.map((imageSrc, index) => (
                <DemoThumbnail 
                  key={index}
                  imageSrc={imageSrc}
                  index={index}
                  title={heroMain.title}
                  saasUrl={saasUrl}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Remove bottom spacing */}
      </div>


    </>
  );
}
