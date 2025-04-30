import { useState, useCallback } from 'react';
import Image from 'next/image';
import { RotateCcw } from 'lucide-react';

const randomPrompt = [
  'A Chinese lady wears a charcoal cropped blazer and wide-leg pants, styled with a ribbed white turtleneck and sleek gold earrings—minimalist and refined.',
  'On a beach, a woman wears a cream silk dress that flows with the breeze. The deep square neckline and textured fabric evoke soft romance.',
  'A man in a silver puffer jacket and black cargo pants stands on a rooftop. The futuristic cut and reflective finish make a bold statement.',
  'A woman wears a dove-gray oversized coat over a slate turtleneck dress. Tonal, minimal, and elegant.',
  'In studio light, a young lady wears a mesh top with constellation embroidery and a midnight blue satin skirt—cosmic and mysterious.',
  'A stylish young man leans casually against a concrete wall, wearing a sage green utility jacket with oversized pockets and a belted waist. His cream trousers are cropped just above the ankle, revealing a pair of vintage-inspired loafers. The overall aesthetic blends modern tailoring with workwear nostalgia.',
  "A woman with curly hair walks across a crosswalk in Tokyo at dusk, wearing a neon pink trench coat that glows under the city lights. The coat's glossy surface and cinched waist create a bold silhouette, effortlessly grabbing attention among the muted tones of the street.",
  'Inside an empty greenhouse, a model in an ethereal sheer white blouse with puff sleeves and hand-stitched floral accents moves delicately between beams of filtered sunlight. The mood is soft, romantic, and slightly surreal, evoking classic European countryside nostalgia.',
  'A high-fashion editorial shot features a close-up of a model wearing a sharply tailored beige wool suit. The jacket has exaggerated lapels and is paired with no shirt underneath, offering a bold reinterpretation of traditional menswear. The lighting is moody, casting soft shadows on her angular features.',
  'A street-style snapshot of a fashion-forward woman in Berlin. She wears a cropped leather biker jacket over a graphic tee, paired with metallic silver pants and knee-high boots. Her asymmetrical bob and statement sunglasses complete the edgy, rebellious look.'
];

export default function RandomPrompt({
  handleQueryRandomPrompt
}: {
  handleQueryRandomPrompt: (prompt: string) => void;
}) {
  const [isRotating, setIsRotating] = useState(false); // refresh icon rotating

  const handleRefresh = useCallback(() => {
    setIsRotating(!isRotating);

    const randomIndex = Math.floor(Math.random() * randomPrompt.length);

    handleQueryRandomPrompt(randomPrompt[randomIndex]);
  }, [isRotating]);

  const handleAnimationEnd = () => {
    setIsRotating(false);
  };

  return (
    <div>
      <div className="flex items-start justify-start">
        <Image
          src="/images/generate/surprise_me.svg"
          alt="Surprise me"
          width={16}
          height={16}
          className="absolute left-[16px]"
        />
        <span
          style={{
            textIndent: '20px',
            color: '#999',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '20px'
          }}
        >
          <span className="text-[#000] font-inter text-[14px] font-normal leading-[20px]">Surprise me：</span>A
          fashionable Chinese model in a flowing long dress, neo-Chinese style, low-saturation clothing, prints in the
          ...
        </span>
        <span className="w-[16px] h-[16px] shrink-0">
          <RotateCcw
            className={`w-full fas fa-sync-alt cursor-pointer ${isRotating ? 'animate-rotateOneCircle' : ''}`}
            onAnimationEnd={handleAnimationEnd}
            onClick={handleRefresh}
          />
        </span>
      </div>
    </div>
  );
}
