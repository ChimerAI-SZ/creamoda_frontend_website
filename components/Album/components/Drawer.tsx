import React, { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import ImageCard from './ImageCard';

import { useAlbumListStore } from '@/stores/useAlbumListStore';
import { getCollectList } from '@/lib/api';
import { showErrorDialog } from '@/utils/index';
import { collectImage } from '@/lib/api/album';

export interface AlbumItem {
  genImgId: number;
  createTime: string;
  resultPic: string;
}

export function AlbumDrawer({ children }: { children: React.ReactNode }) {
  const { imageList, resetImageList } = useAlbumListStore();

  const queryCollectList = async () => {
    const res = await getCollectList(1, 10);

    if (res.code === 0) {
      resetImageList(res.data.list);
    } else {
      showErrorDialog(res.msg);
    }
  };

  const handleOpenChange = (openState: boolean) => {
    if (openState) {
      queryCollectList();
    }
  };

  const handleDislike = async (imageId: number) => {
    const res = await collectImage({ genImgId: imageId, action: 2 });

    if (res.code === 0) {
      resetImageList(imageList.filter(image => image.genImgId !== imageId));
    } else {
      showErrorDialog(res.msg);
    }
  };

  useEffect(() => {
    queryCollectList();
  }, []);

  return (
    <Drawer onOpenChange={handleOpenChange}>
      <DrawerTrigger>{children}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="px-[18px]">
          <DrawerTitle className="flex items-center justify-between">
            <div className="w-full h-[80px] flex items-center justify-center border-b border-[#E5E5E5]">
              <Image src="/images/album/star.svg" alt="album" width={30} height={30} />
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <div className="w-[340px] h-full bg-[#fff] p-3 overflow-y-auto">
          {imageList.length > 0 ? (
            <div className="columns-2 gap-3">
              {imageList.map((image: AlbumItem) => (
                <ImageCard key={image.genImgId || image.resultPic} image={image} handleDislike={handleDislike} />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-start mt-[52px]">
              <Image src="/images/album/empty_placeholder.svg" alt="empty" width={100} height={100} />
              <div className="text-gray-40 text-center text-[14px] font-normal leading-5 mt-[16px]">
                No favorites yet
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
