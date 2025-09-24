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
          transform: shouldStickToBottom ? getLeftImageTransform() : 'none'
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
            <div style={{
              position: 'absolute',
              bottom: shouldStickToBottom ? '20%' : (heroMain.imageSize === 'medium' ? '10%' : '20%'),
              left: '0px',
              right: '0px',
              color: 'white',
              overflow: 'visible'
            }}>
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
            
            {/* 标题直接在图片内部 */}
            <div style={{
              position: 'absolute',
              bottom: shouldStickToBottom ? '30%' : (heroMain.imageSize === 'medium' ? '20%' : '30%'),
              left: shouldStickToBottom ? '-20%' : '0%',
              right: shouldStickToBottom ? '-20%' : '0%',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <h2 style={{
                fontSize: 'clamp(42px, 6vw, 72px)',
                fontWeight: '500',
                margin: '0',
                fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif",
                lineHeight: '1.1',
                color: 'white',
                textAlign: 'center',
                width: '100%'
              }}>
                {heroMain.title}
              </h2>
            </div>
          </div>
        </div>
        
        <div className="upload-showcase" style={{
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'clamp(400px, 40vw, 540px)',
          maxWidth: '540px',
          alignSelf: 'center'
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
        minHeight: '85vh',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box'
      }}>
        {/* Centered Image with Overlay Text */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '3/4',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '16px',
          margin: '20px auto 0 auto',
          flexShrink: 0
        }}>
          <Image
            src={heroMain.mainImage}
            alt={`${heroMain.title} sample image`}
            fill
            className="sample-img"
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
          
          {/* All Content Inside Image */}
          <div style={{
            position: 'absolute',
            bottom: '0px',
            left: '20px',
            right: '20px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
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
              width: '100%'
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
                  fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif"
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
          </div>
        </div>

        {/* Content Below Image */}
        <div style={{
          width: '100%',
          padding: '24px 20px',
          textAlign: 'center',
          color: 'white'
        }}>

          {/* Demo Images */}
          <div style={{
            textAlign: 'center'
          }}>
            <p style={{
              color: 'white',
              marginBottom: '12px',
              fontSize: '16px',
              fontFamily: "'Instrument Sans', system-ui, -apple-system, sans-serif"
            }}>
              No image? Try one of these:
            </p>
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
