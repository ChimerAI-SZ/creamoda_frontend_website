import { memo } from 'react';
import { Label } from '@/components/ui/label';

const StyledLabel = memo(({ content, htmlFor }: { content: string; htmlFor?: string }) => (
  <Label htmlFor={htmlFor} className="text-[#0A1532] text-[14px] font-bold leading-[20px] py-[6px]">
    {content}
  </Label>
));

StyledLabel.displayName = 'StyledLabel';

export { StyledLabel };
