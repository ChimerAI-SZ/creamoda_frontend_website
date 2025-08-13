'use client';

import { useEffect, useState, useCallback } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { ImageCard } from './ImageCard';
import ImageDetail from './ImageDetail';

import { useAlertStore } from '@/stores/useAlertStore';
import { useGenerationStore } from '@/stores/useGenerationStore';
import { album, community } from '@/lib/api';

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
  seoImgUid?: string;
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
  const [images, setImages] = useState<SEO_Image_Type[]>([]);
  // 查看图片详情相关state
  const [selectedImage, setSelectedImage] = useState<SEO_Image_Type | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const [mounted, setMounted] = useState(false);

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
    [showAlert]
  );

  // 收藏图片
  const handleCollectImage = useCallback(
    (imageId: number, currentIsCollected: number) => {
      const newIsCollected: number = currentIsCollected === 1 ? 0 : 1;

      setImages(prevImages =>
        prevImages.map((img: SEO_Image_Type) =>
          img.genImgId === imageId ? { ...img, isCollected: newIsCollected } : img
        )
      );
      if (selectedImage?.genImgId === imageId) {
        setSelectedImage(prev => (prev ? { ...prev, isCollected: newIsCollected } : null));
      }

      const promise = album
        .collectImage({
          genImgId: imageId,
          action: newIsCollected ? 1 : 2
        })
        .catch(error => {
          console.error(error);
          return { code: -1, message: error.message || 'A network error occurred' };
        });

      promise.then(res => {
        if (res.code !== 0) {
          setImages(prevImages =>
            prevImages.map((img: SEO_Image_Type) =>
              img.genImgId === imageId ? { ...img, isCollected: currentIsCollected } : img
            )
          );
          if (selectedImage?.genImgId === imageId) {
            setSelectedImage(prev => (prev ? { ...prev, isCollected: currentIsCollected ? 1 : 0 } : null));
          }
        } else {
          showAlert({
            type: 'success',
            content: `${newIsCollected ? 'Add to' : 'Remove from'} album successfully`
          });
        }
      });

      return promise;
    },
    [selectedImage, showAlert]
  );

  // 点赞图片
  const handleLikeImage = useCallback(
    async (imageId: number, currentIsLike: number) => {
      // 乐观更新
      setImages(prevImages =>
        prevImages.map(img => (img.genImgId === imageId ? { ...img, isLike: currentIsLike === 1 ? 0 : 1 } : img))
      );
      if (selectedImage?.genImgId === imageId) {
        setSelectedImage(prev => (prev ? { ...prev, isLike: currentIsLike === 1 ? 0 : 1 } : null));
      }
      try {
        let res;

        if (currentIsLike) {
          res = await community.cancelLikeImage(imageId);
        } else {
          res = await community.likeImage(imageId);
        }

        if (res.code !== 0) {
          // 失败回滚
          setImages(prevImages =>
            prevImages.map(img => (img.genImgId === imageId ? { ...img, isLike: currentIsLike } : img))
          );
          if (selectedImage?.genImgId === imageId) {
            setSelectedImage(prev => (prev ? { ...prev, isLike: currentIsLike } : null));
          }
        } else {
          showAlert({
            type: 'success',
            content: currentIsLike ? 'Image unliked successfully' : 'Image liked successfully'
          });
        }
      } catch (error: any) {
        setImages(prevImages =>
          prevImages.map(img => (img.genImgId === imageId ? { ...img, isLike: currentIsLike } : img))
        );
        if (selectedImage?.genImgId === imageId) {
          setSelectedImage(prev => (prev ? { ...prev, isLike: currentIsLike } : null));
        }
      }
    },
    [selectedImage, showAlert]
  );

  // 图片点击事件，标记当前点击的图片，然后打开详情
  const handleImageClick = useCallback(async (image: SEO_Image_Type) => {
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
  }, [showAlert]);

  useEffect(() => {
    fetchImages(1);
    setMounted(true);
  }, [fetchImages]);

  return (
    <>
      <div className="w-full h-full p-4 z-20 bg-[#fff] rounded-[20px] overflow-hidden shadow-card-shadow">
        <div className="h-full overflow-y-auto">
          {mounted && (
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                350: 2,
                800: 3,
                1200: 4,
                1440: 5,
                1680: 6,
                1920: 7,
                2560: 8,
                3440: 9,
                3840: 10
              }}
            >
              <Masonry>
                {images.map((image, index) => (
                  <ImageCard
                    key={image.genImgId || index}
                    image={image}
                    onClick={() => handleImageClick(image)}
                    handleCollectImage={(id, isCollected) => handleCollectImage(id, isCollected)}
                    handleLikeImage={(id, isLike) => handleLikeImage(id, isLike)}
                  />
                ))}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </div>
      </div>
      <ImageDetail
        image={selectedImage}
        isOpen={detailVisible}
        onClose={() => {
          setDetailVisible(false);
        }}
        handleCollectImage={(id, isCollected) => handleCollectImage(id, isCollected)}
        handleLikeImage={(id, isLike) => handleLikeImage(id, isLike)}
      />
    </>
  );
}
