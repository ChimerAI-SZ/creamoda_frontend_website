import type React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import crown from '@/images/menu/crown.svg';
import wand from '@/images/menu/wand.svg';
import home from '@/images/menu/home.svg';
import ComingSoonDialog from '@/components/ComingSoonDialog';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

function MenuItem({ icon, title, isActive, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center rounded-lg transition-all duration-200  group mt-[12px] h-[30px]',
        isActive ? 'bg-[#FF7B0D] text-[#fff] flex-shrink-0' : 'text-[#999] hover:bg-gray-100 hover:text-gray-700 w-full'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-[30px] h-[30px] flex-shrink-0',
          isActive && ' rounded-[9999px]'
        )}
      >
        <div className={cn('flex items-center justify-center', isActive && 'bg-[#FF7B0D] rounded-full ')}>{icon}</div>
      </div>
      <span className=" whitespace-nowrap overflow-hidden transition-all duration-200 opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto">
        {title}
      </span>
    </button>
  );
}

export function MenuBar() {
  return (
    <div
      className={cn(
        'group bg-white border-r border-gray-200 h-[calc(100vh-64px)] flex flex-col px-2 transition-all duration-200 ',
        'hover:w-[128px] '
      )}
    >
      <MenuItem icon={<Image src={home.src} alt="home" width={16} height={16} />} title="Home" isActive />
      <ComingSoonDialog
        trigger={<MenuItem icon={<Image src={crown.src} alt="second" width={16} height={16} />} title="My style" />}
      />
      {/* <MenuItem icon={<Image src={wand.src} alt="third" width={16} height={16} />} title="Premium" /> */}
    </div>
  );
}
