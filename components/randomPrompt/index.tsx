import { useState, useCallback, useEffect } from 'react';
import { PROMPT_MAX_LEN } from '@/utils';
import Image from 'next/image';

const randomPrompt = [
  'A Chinese lady wears a charcoal cropped blazer and wide-leg pants, styled with a ribbed white turtleneck and sleek gold earrings—minimalist and refined.',
  'On a beach, a woman wears a cream silk dress that flows with the breeze. The deep square neckline and textured fabric evoke soft romance.',
  'A man in a silver puffer jacket and black cargo pants stands on a rooftop. The futuristic cut and reflective finish make a bold statement.',
  'A woman wears a dove-gray oversized coat over a slate turtleneck dress. Tonal, minimal, and elegant.',
  'In studio light, a young lady wears a mesh top with constellation embroidery and a midnight blue satin skirt—cosmic and mysterious.',
  'A stylish young man against a wall wears a sage green utility jacket with oversized pockets and belted waist. His cream cropped trousers reveal vintage loafers.',
  "A woman with curly hair walks across a Tokyo crosswalk at dusk, wearing a neon pink trench coat that glows under city lights. Bold and striking silhouette.",
  'Inside a greenhouse, a model in an ethereal sheer white blouse with puff sleeves moves between beams of sunlight. Soft, romantic, and surreal.',
  'A high-fashion close-up of a model wearing a sharply tailored beige wool suit. The jacket has exaggerated lapels with no shirt underneath.',
  'A street-style woman in Berlin wears a cropped leather biker jacket over a graphic tee, paired with metallic silver pants and knee-high boots. Edgy and rebellious.'
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

  // Format prompt for display, using the full PROMPT_MAX_LEN limit
  const formatPromptForDisplay = useCallback((prompt: string) => {
    const maxChars = PROMPT_MAX_LEN;

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
    handleQueryRandomPrompt(currentFullPrompt.slice(0, PROMPT_MAX_LEN));
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
