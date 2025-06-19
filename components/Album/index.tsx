'use client';

import Image from 'next/image';

import { AlbumDrawer } from './components/Drawer';

export function Album() {
  return (
    <>
      <AlbumDrawer>
        <div
          className="album-drawer-trigger absolute top-[86px] right-[10px] h-[50px] w-[50px] bg-white shadow-[0px_4.762px_23.81px_rgba(112,77,255,0.40)] flex items-center justify-center rounded-full cursor-pointer z-50"
          style={{ fill: 'var(--100, #FFF)', filter: 'drop-shadow(0px 4.762px 23.81px rgba(112, 77, 255, 0.40))' }}
        >
          <Image src="/images/album/star.svg" alt="star" width={30} height={30} />
        </div>
      </AlbumDrawer>
    </>
  );
}
