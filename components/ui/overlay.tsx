import { cn } from '@/utils';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface OverlayProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  isVisible?: boolean;
}

export function Overlay({ children, className, onClick, isVisible = true }: OverlayProps) {
  if (!isVisible) return null;

  return createPortal(
    <div
      className={cn('fixed inset-0 bg-gray-40 z-[5000] flex items-center justify-center', className)}
      onClick={onClick}
    >
      {children}
    </div>,
    document.body
  );
}
