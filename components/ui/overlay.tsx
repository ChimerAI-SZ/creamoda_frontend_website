import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface OverlayProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  isVisible?: boolean;
}

export function Overlay({ children, className, onClick, isVisible = true }: OverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn('fixed inset-0 bg-black/50 z-[5000] flex items-center justify-center', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
