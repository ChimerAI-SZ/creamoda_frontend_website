'use client';

import { useEffect, useState, useCallback } from 'react';

import { ImageCard } from './ImageCard';
import ImageDetail from './ImageDetail';

import { useAlertStore } from '@/stores/useAlertStore';
import { useGenerationStore } from '@/stores/useGenerationStore';
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
  const { showAlert } = useAlertStore();

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
        showAlert({
          type: 'error',
          content: 'Something went wrong. Please try again later or contact support if the issue persists'
        });
      }
    },
    [setGenerating]
  );

  // 图片点击事件，标记当前点击的图片，然后打开详情
  const handleImageClick = useCallback(async (image: ImageItem) => {
    try {
      const data = await community.queryImageDetail(image.seoImgUid as string);

      if (data.code === 0) {
        const imageDetail = data.data as SEO_Image_Type;
        imageDetail.picUrl = image.picUrl ?? '';

        setSelectedImage(imageDetail);
      }
      setDetailVisible(true);
    } catch (error: any) {
      showAlert({
        type: 'error',
        content:
          error.message || 'Something went wrong. Please try again later or contact support if the issue persists'
      });
    }
  }, []);

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
      />
    </>
  );
}
