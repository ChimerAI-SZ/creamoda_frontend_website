'use client';

import { Star } from 'lucide-react';

import { AlbumDrawer } from './components/Drawer';

export function Album() {
  return (
    <>
      <AlbumDrawer>
        <div className="album-drawer-trigger absolute top-[80px] right-0 h-[40px] w-[40px] bg-[#F97917] shadow-[0px_0px_10px_0px_rgba(80,87,102,0.2)] flex items-center justify-center rounded-[4px_0_0_4px] cursor-pointer">
          <Star className="w-5 h-5 text-white" />
        </div>
      </AlbumDrawer>
    </>
  );
}
