interface DesignAboutModuleProps {
  className?: string;
}

export default function DesignAboutModule({ className = '' }: DesignAboutModuleProps) {
  return (
    <section className={`relative overflow-hidden ${className}`} style={{ minHeight: '750px' }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/marketing/images/design/about.png)'
        }}
      />
      
      {/* Dark Gradient Overlay from top and bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.8) 100%)'
        }}
      />
      
      {/* Center spotlight effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 70%)'
        }}
      />
      
      {/* Subtle color overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(112, 77, 255, 0.1) 0%, rgba(20, 5, 78, 0.2) 100%)',
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-full px-4 py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col justify-center items-center gap-16">
            {/* Title */}
            <div className="w-full">
              <h2 
                className="text-white text-center"
                style={{
                  fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif",
                  fontWeight: '800',
                  fontSize: '48px',
                  lineHeight: '1.125'
                }}
              >
                About Discovering Design Ideas
              </h2>
            </div>
            
            {/* Description */}
            <div className="w-full max-w-[1037px]">
              <p 
                className="text-white text-center"
                style={{
                  fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
                  fontWeight: '600',
                  fontSize: '24px',
                  lineHeight: '1.7'
                }}
              >
                This page showcases a curated collection of AI-generated fashion ideas, designed to inspire designers, brands, and creators. From casualwear and evening gowns to professional attire and sportswear, each outfit serves as a starting point to spark creativity and explore new design directions.
                <br /><br />
                Our vision at Creamoda is to empower everyone in the fashion industry to turn inspiration into meaningful, valuable designs. By providing AI-powered fashion ideas in one accessible gallery, we help designers experiment faster, iterate on concepts more efficiently, and bring innovative collections to life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
