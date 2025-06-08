'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ImageCard } from './ImageCard';
import ImageDetail from './ImageDetail';

import { showErrorDialog, deleteImage, downloadImage } from '@/utils';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { useVariationFormStore } from '@/stores/useMagicKitStore';
import { community } from '@/lib/api';

// 图片类型接口
export interface ImageItem {
  genImgId: number;
  genId: number;
  genBatchId?: string | number; // 从代码中看出有这个属性
  type: number;
  status: number;
  resultPic: string;
  picUrl?: string;
  createTime: string;
  isCollected: boolean;
  seoImgUid?: string;
}

export type SEO_Image_Type = {
  genImgId: number;
  genType: string[];
  prompt: string;
  originalImgUrl: string;
  materials: any[];
  trendStyles: any[];
  description: string;
  isLike: number;
  likeCount: number;
  isCollected: number;
  picUrl: string;
  creator: {
    uid: number;
    name: string;
    email: string;
    headPic?: string;
  };
};

const PAGE_SIZE = 10000; // 请求的图片数量

export function ImageGrid() {
  // 图片列表
  const [images, setImages] = useState<ImageItem[]>([]);
  // 查看图片详情相关state
  const [selectedImage, setSelectedImage] = useState<SEO_Image_Type | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const { setGenerating } = useGenerationStore();
  const { updateImageUrl } = useVariationFormStore();
  const router = useRouter();

  // 加载图片数据
  const fetchImages = useCallback(
    async (currentPage: number) => {
      try {
        const data = await community.queryImageList(currentPage, PAGE_SIZE);

        if (data.code === 0) {
          const imageList = data.data.list;

          if (currentPage === 1) {
            setImages(imageList);
          } else {
            setImages(prev => [...prev, ...imageList]);
          }
        }
      } catch (error) {
        showErrorDialog('Something went wrong. Please try again later or contact support if the issue persists');
      }
    },
    [setGenerating]
  );

  // 图片点击事件，标记当前点击的图片，然后打开详情
  const handleImageClick = useCallback(async (image: ImageItem) => {
    const data = await community.queryImageDetail(image.seoImgUid as string);

    if (data.code === 0) {
      const imageDetail = data.data as SEO_Image_Type;
      imageDetail.picUrl = image.picUrl ?? '';

      setSelectedImage(imageDetail);
    }
    setDetailVisible(true);
  }, []);

  const handleActionButtonClick = (text: string, image: SEO_Image_Type) => {
    if (text === 'Download') {
      downloadImage(image?.picUrl ?? '', 'image.jpg');
    } else if (text === 'Delete') {
      const imageId = image?.genImgId ?? 0;

      deleteImage(imageId, () => {
        setImages(prev => prev.filter(img => img.genImgId !== imageId));

        setDetailVisible(false);
      });
    } else if (text === 'Magic Kit') {
      updateImageUrl(image?.picUrl ?? '');
      router.push('/magic-kit');
    } else if (text === 'Virtual Try-On') {
      router.push(`/virtual-try-on?imageUrl=${encodeURIComponent(image?.picUrl ?? '')}`);
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, []);

  return (
    <>
      <div className="w-full h-full p-4 z-20 bg-[#fff] rounded-[20px] overflow-hidden shadow-card-shadow">
        <div className="h-full overflow-y-auto">
          <div
            className="image-grid-container grid gap-4 auto-rows-max
      grid-cols-1
      sm:grid-cols-2 
      min-[800px]:grid-cols-3 
      min-[1200px]:grid-cols-4 
      min-[1440px]:grid-cols-5 
      min-[1680px]:grid-cols-6 
      min-[1920px]:grid-cols-7
      min-[2560px]:grid-cols-8
      min-[3440px]:grid-cols-9
      min-[3840px]:grid-cols-10"
          >
            {images.map((image, index) => (
              <ImageCard key={image.genImgId || index} image={image} onClick={() => handleImageClick(image)} />
            ))}
          </div>
        </div>
      </div>
      <ImageDetail
        image={selectedImage}
        isOpen={detailVisible}
        onClose={() => {
          setDetailVisible(false);
        }}
        handleActionButtonClick={handleActionButtonClick}
      />
    </>
  );
}
