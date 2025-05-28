'use client';

import Image from 'next/image';
import { useDebounceFn } from 'ahooks';

import { eventBus } from '@/utils/events';

export type GenerateButtonState = 'disabled' | 'ready' | 'generating';

interface GenerateButtonProps {
  onClick: () => void;
  state?: GenerateButtonState;
  className?: string;
  autoOpenLogin?: boolean;
}

export function GenerateButton({ onClick, state = 'disabled', className = '' }: GenerateButtonProps) {
  const { run: handleClick } = useDebounceFn(
    () => {
      const token = localStorage.getItem('auth_token');
      const isAuthenticated = !!token;
      if (isAuthenticated) {
        onClick();
      } else {
        eventBus.emit('auth:login', { isOpen: true });
      }
    },
    {
      wait: 500
    }
  );

  // Button text based on state
  const buttonText = state === 'generating' ? 'Generating...' : 'Generate';

  // Button styles based on state
  const buttonStyles = {
    disabled: 'bg-[#CECECE] text-white cursor-not-allowed',
    ready: 'bg-primary text-white hover:bg-primary-hover cursor-pointer',
    generating: 'bg-[rgba(249,121,23,0.5)] text-white cursor-not-allowed'
  };

  return (
    <div className="px-4">
      <button
        type="submit"
        className={`w-full px-4 py-2.5 flex items-center justify-center gap-1.5 rounded text-sm font-medium font-inter leading-5 ${buttonStyles[state]} ${className}`}
        disabled={state === 'disabled' || state === 'generating'}
        onClick={() => {
          handleClick();
        }}
      >
        <Image src="/images/operation/generate.svg" alt="Generate" width={16} height={16} />
        <span className="text-white font-inter text-[14px] font-medium leading-[20px]">{buttonText}</span>
      </button>
    </div>
  );
}
