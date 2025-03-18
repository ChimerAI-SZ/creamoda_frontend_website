import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleTagProps {
  icon?: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function ToggleTag({ icon, label, isActive, onClick }: ToggleTagProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 py-4 rounded-t-lg transition-colors relative',
        isActive ? 'text-[#F97917] bg-white' : 'text-[#999] hover:text-[#F97917]',
        'font-inter text-sm font-medium leading-5'
      )}
    >
      {icon}
      <span>{label}</span>
      {isActive && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#F97917]" />}
    </button>
  );
}
