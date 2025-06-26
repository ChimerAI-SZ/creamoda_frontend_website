import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

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
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [currentFullPrompt, setCurrentFullPrompt] = useState('');

  const getRandomPrompt = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * randomPrompt.length);
    return randomPrompt[randomIndex];
  }, []);

  // Approximately 45-50 characters per line, 3 lines = ~150 characters
  const formatPromptForDisplay = useCallback((prompt: string) => {
    const maxChars = 100;

    if (prompt.length <= maxChars) {
      return prompt;
    }

    // Find the last space before the character limit to avoid cutting words
    let cutoffIndex = prompt.lastIndexOf(' ', maxChars);
    if (cutoffIndex === -1) cutoffIndex = maxChars; // Fallback if no space found

    return prompt.substring(0, cutoffIndex) + '...';
  }, []);

  useEffect(() => {
    const initialPrompt = getRandomPrompt();
    setCurrentFullPrompt(initialPrompt);
    setDisplayedPrompt(formatPromptForDisplay(initialPrompt));
  }, [formatPromptForDisplay, getRandomPrompt]);

  const handleRefresh = useCallback(() => {
    const newPrompt = getRandomPrompt();
    setCurrentFullPrompt(newPrompt);
    setDisplayedPrompt(formatPromptForDisplay(newPrompt));
  }, [getRandomPrompt, formatPromptForDisplay]);

  const handleTextClick = useCallback(() => {
    handleQueryRandomPrompt(currentFullPrompt);
  }, [currentFullPrompt, handleQueryRandomPrompt]);

  return (
    <div className="relative">
      <div className="flex items-center justify-start gap-1">
        <Image src="/images/generate/surprise_me.svg" alt="Surprise me" width={20} height={20} className="" />
        <span
          onClick={handleTextClick}
          className="box cursor-pointer text-[#999] font-inter text-[14px] font-normal leading-[20px] overflow-hidden text-ellipsis"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            boxOrient: 'vertical', // Firefox fallback
            lineClamp: 2 // Firefox fallback
          }}
        >
          {displayedPrompt}
        </span>
        <span className="w-[20px] h-[20px] shrink-0" onClick={handleRefresh}>
          <Image
            src="/images/generate/refresh.svg"
            alt="Surprise me"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleRefresh}
          />
        </span>
      </div>
    </div>
  );
}
