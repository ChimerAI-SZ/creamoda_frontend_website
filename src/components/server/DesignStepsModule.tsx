interface DesignStepsModuleProps {
  className?: string;
}

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
}

function StepCard({ stepNumber, title, description }: StepCardProps) {
  return (
    <div 
      className="flex-1 flex flex-col items-center gap-4 p-8 rounded-3xl"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.48)',
        minHeight: '200px'
      }}
    >
      {/* Step Number */}
      <div className="flex items-center justify-center mb-2">
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: "'Neue Machina', system-ui, -apple-system, sans-serif",
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '1.25',
            background: 'linear-gradient(90deg, rgba(68, 18, 186, 1) 0%, rgba(149, 0, 255, 1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {stepNumber}
        </span>
      </div>

      {/* Content Container */}
      <div className="flex-1 w-full max-w-[320px]">
        {/* Title */}
        <h3 
          className="text-white mb-4"
          style={{
            fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif",
            fontWeight: '800',
            fontSize: '24px',
            lineHeight: '1.375',
            textAlign: 'left'
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p 
          className="text-white/60"
          style={{
            fontFamily: "'Neue Machina', system-ui, -apple-system, sans-serif",
            fontWeight: '400',
            fontSize: '20px',
            lineHeight: '0.965',
            textAlign: 'left'
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default function DesignStepsModule({ className = '' }: DesignStepsModuleProps) {
  const steps = [
    {
      stepNumber: 'Step 1',
      title: 'Visit Designs Page',
      description: 'Explore a wide range of AI-generated outfits across casualwear, couture, sportswear, and more.'
    },
    {
      stepNumber: 'Step 2', 
      title: 'Find the Perfect Idea',
      description: 'Filter by style or category to discover looks that fit your vision or upcoming collection.'
    },
    {
      stepNumber: 'Step 3',
      title: 'Create Similar Designs', 
      description: 'Use our AI fashion design tools to instantly produce variations and turn inspiration into new designs.'
    }
  ];

  return (
    <section className={`py-16 px-4 bg-black ${className}`}>
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        {/* Title */}
        <div className="mb-6 text-center">
          <h2 
            className="text-white"
            style={{
              fontFamily: "'PP Neue Machina', 'Neue Machina', system-ui, -apple-system, sans-serif",
              fontWeight: '800',
              fontSize: '48px',
              lineHeight: '1.25',
              textAlign: 'center'
            }}
          >
            How to Get Your Fashion Design Ideas
          </h2>
        </div>

        {/* Steps Container */}
        <div className="flex gap-6 mt-6">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
