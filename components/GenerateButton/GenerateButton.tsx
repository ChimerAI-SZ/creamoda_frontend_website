'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { emitter } from '@/utils/events';
export type GenerateButtonState = 'disabled' | 'ready' | 'generating';

interface GenerateButtonProps {
  onClick: () => void;
  state?: GenerateButtonState;
  className?: string;
  autoOpenLogin?: boolean;
}

export function GenerateButton({ onClick, state = 'disabled', className = '' }: GenerateButtonProps) {
  const handleClick = () => {
    const token = localStorage.getItem('auth_token');
    const isAuthenticated = !!token;
    if (isAuthenticated) {
      onClick();
    } else {
      emitter.emit('auth:login', { isOpen: true });
    }
  };

  // Button text based on state
  const buttonText = state === 'generating' ? 'Generating...' : 'Generate';

  // Button styles based on state
  const buttonStyles = {
    disabled: 'bg-[#CECECE] text-white cursor-not-allowed',
    ready: 'bg-[#F97917] text-white hover:bg-[#E86806] cursor-pointer',
    generating: 'bg-[rgba(249,121,23,0.5)] text-white cursor-not-allowed'
  };

  return (
    <>
      <button
        type="submit"
        className={`w-full px-4 py-2.5 flex items-center justify-center gap-1.5 rounded text-sm font-medium font-inter leading-5 ${buttonStyles[state]} ${className}`}
        disabled={state === 'disabled' || state === 'generating'}
        onClick={handleClick}
      >
        <Image src="/images/operation/generate.svg" alt="Generate" width={16} height={16} />
        {buttonText}
      </button>
    </>
  );
}
