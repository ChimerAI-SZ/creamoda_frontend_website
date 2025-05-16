import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import mockData from './mockData';

import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import ImageCard from '../ImageCard';

import { useAlbumListStore } from '@/stores/useAlbumListStore';

import type { ImageItem } from '@/components/ImageGrid';

export function AlbumDrawer({ children }: { children: React.ReactNode }) {
  const { imageList, resetImageList } = useAlbumListStore();

  useEffect(() => {
    resetImageList(mockData.list);
  }, []);

  return (
    <Drawer>
      <DrawerTrigger>{children}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Album</DrawerTitle>
          <DrawerTrigger>
            <X />
          </DrawerTrigger>
        </DrawerHeader>

        <div className="w-[340px] h-full bg-[#fff] p-3 overflow-y-auto">
          <div className="columns-2 gap-3">
            {imageList.map((image: ImageItem) => (
              <ImageCard key={image.genImgId || image.resultPic} image={image} />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
