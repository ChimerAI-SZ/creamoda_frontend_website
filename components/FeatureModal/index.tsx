import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { cn } from '@/utils';

import designFeatures from '@/public/design_features.json';

// 定义类型
type DesignFeaturesType = {
  [key: string]: {
    [subcategory: string]: string[];
  };
};

const DefaultTrigger = (
  <div className="flex items-center gap-2">
    <div className="cursor-pointer flex h-[20px] px-[8px] justify-center items-center content-center flex-shrink-0 flex-wrap text-primary font-inter text-[12px] font-semibold leading-[20px] border border-primary bg-[#FFF] rounded-[20px] text-center">
      Design Features
    </div>
  </div>
);

export default function FeatureModal({
  children = DefaultTrigger,
  handleConfirm
}: {
  children?: React.ReactNode;
  handleConfirm: (features: string[]) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featureListRef = useRef<HTMLDivElement>(null);

  // 一级 nav 的左右阴影显影控制
  const [showBefore, setShowBefore] = useState(false);
  const [showAfter, setShowAfter] = useState(false);

  // 选中的一级
  const [activeCategory, setActiveCategory] = useState('Style'); // 一级分类选中状态
  const [activeSubcategory, setActiveSubcategory] = useState('Style'); // 二级分类选中状态
  const [activeFeature, setActiveFeature] = useState<string[]>([]); // 选中的词条

  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowBefore(scrollLeft > 0);
      setShowAfter(scrollLeft + clientWidth < scrollWidth);
    }
  };

  // 切换一级分类之后，重置二级分类
  useEffect(() => {
    const subcategories = (designFeatures as DesignFeaturesType)[activeCategory];

    if (subcategories) {
      setActiveSubcategory(Object.keys(subcategories)[0]);
    }
  }, [activeCategory]);

  useEffect(() => {
    const activeElement = document.querySelector('.active-category');
    activeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  useEffect(() => {
    if (featureListRef.current) {
      // 通过判断子元素的offset来判断是否存在换行。如果有换行的话需要展示下拉按钮。
      function hasFlexWrapped(container: HTMLDivElement) {
        const children = Array.from(container.children) as HTMLElement[];
        if (children.length <= 1) return false;

        const firstTop = (children[0] as HTMLElement)?.offsetTop;

        console.log(
          children,
          children.map(child => (child as HTMLElement).offsetTop)
        );
        return children.some(child => (child as HTMLElement).offsetTop !== firstTop);
      }

      const currentShowArrow = hasFlexWrapped(featureListRef.current);

      setShowArrow(currentShowArrow);
    }
  }, [activeFeature]);

  const toggleFeature = (feature: string) => {
    setActiveFeature(prev => (prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        overlayVisible={false}
        className="w-[60vw] max-w-[calc(100vw-32px)] border-0 h-[calc(100vh-86px-24px)] top-[86px] left-[426px] translate-x-0 translate-y-0 gap-0 shadow-[0px_4px_30px_0px_rgba(10,21,50,0.12)] flex flex-col px-0 py-[24px] rounded-[20px] sm:rounded-[20px]"
      >
        <DialogHeader className="px-[24px]">
          <DialogTitle className="flex justify-between items-center h-[28px]">
            <span>Design Features</span>
            <DialogTrigger asChild>
              <X className="w-[24px] h-[24px]" />
            </DialogTrigger>
          </DialogTitle>
        </DialogHeader>

        <div className="w-full flex flex-col overflow-y-auto relative">
          <div className="sticky top-0 bg-white z-10 px-[24px]">
            <div className="flex justify-between items-start min-h-[64px] shrink-0">
              <div className="flex justify-start items-start gap-2 my-[20px]">
                <div
                  className={`relative flex justify-start items-center flex-wrap ${!showAllFeatures && 'max-h-[64px]'}`}
                >
                  {activeFeature.length > 0 ? (
                    <div
                      ref={featureListRef}
                      className={cn(
                        'flex justify-start items-center flex-wrap max-h-[24px] overflow-hidden',
                        showAllFeatures && 'max-h-none h-auto'
                      )}
                    >
                      {activeFeature.map(feature => (
                        <div
                          key={feature}
                          className="pr-[6px] pl-[10px] h-6 py-[2px] mb-2 mr-2 border border-primary rounded-[16px] flex items-center justify-start gap-1 shrink-0 text-primary font-medium text-[14px] leading-[20px] cursor-default"
                        >
                          <span className="max-w-[120px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {feature}
                          </span>
                          <X
                            className="w-[12px] h-[12px] hover:text-black cursor-pointer shrink-0"
                            onClick={() => toggleFeature(feature)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-60 font-normal leading-5 text-[16px]">
                      Select design features (multiple choices)
                    </div>
                  )}
                  {showArrow && (
                    <div
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="absolute top-0 right-[-8px] h-6 flex items-center justify-center text-primary leading-[20px] cursor-pointer"
                    >
                      <Image
                        src={'/images/generate/expand.svg'}
                        alt="feature-modal-bg"
                        width={16}
                        height={16}
                        className={cn('rounded-full', showAllFeatures ? 'rotate-180' : '')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={cn(
                'relative overflow-hidden flex gap-2 items-start justify-start shrink-0',
                showBefore &&
                  'before:absolute before:inset-y-0 before:left-0 before:w-[20px] before:shadow-[inset_10px_0_8px_-8px_rgba(0,0,0,0.12)]',
                showAfter &&
                  'after:absolute after:inset-y-0 after:right-0 after:w-[20px] after:shadow-[inset_-10px_0_8px_-8px_rgba(0,0,0,0.12)]'
              )}
            >
              <div
                className="flex justify-start items-center overflow-x-auto"
                style={{
                  scrollbarWidth: 'none'
                }}
                ref={scrollRef}
                onScroll={handleScroll}
              >
                {Object.keys(designFeatures).map(category => (
                  <div
                    className={cn(
                      `relative shrink-0 font-inter text-base font-bold text-[14px] cursor-pointer py-[6px] px-[10px] text-gray-40`,
                      category === activeCategory
                        ? 'text-primary after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-[44px] after:bg-primary'
                        : ''
                    )}
                    onClick={() => {
                      setActiveCategory(category);
                    }}
                    key={category}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-12 gap-x-[24px] overflow-y-auto pt-4 pl-[24px]">
            <div className="col-span-3 h-full flex flex-col gap-4">
              {Object.keys((designFeatures as DesignFeaturesType)[activeCategory]).map(subcategory => (
                <div
                  key={subcategory}
                  className={cn(
                    'flex justify-start items-center text-center rounded-[8px]',
                    subcategory === activeSubcategory && 'text-primary bg-primary/15'
                  )}
                >
                  <div
                    className="p-[6px] cursor-pointer leading-[20px] w-full font-medium"
                    onClick={() => {
                      setActiveSubcategory(subcategory);
                    }}
                  >
                    {subcategory}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-9 h-full pr-[24px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(designFeatures as DesignFeaturesType)[activeCategory][activeSubcategory]?.map((feature, index) => (
                  <div
                    key={feature}
                    className={cn(
                      'relative p-[1px] border border-border rounded-[16px] w-full',
                      activeFeature.includes(feature) && 'bg-gradient-primary'
                    )}
                  >
                    <div
                      key={feature + new Date().getTime() + index}
                      className={cn(
                        'flex justify-start items-center cursor-pointer h-[80px] font-medium rounded-[14px] bg-white text-gray-40',
                        activeFeature.includes(feature) && 'text-primary'
                      )}
                      onClick={() => toggleFeature(feature)}
                    >
                      <div className="p-3 leading-[20px] text-center w-full font-bold">{feature}</div>
                    </div>
                    {activeFeature.includes(feature) && (
                      <div className="absolute top-[-8px] right-[-8px] w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center">
                        <div className="w-[18px] h-[18px] bg-primary rounded-full flex items-center justify-center">
                          <Image
                            src={'/images/generate/correct.svg'}
                            alt="feature-modal-bg"
                            width={16}
                            height={16}
                            className="bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="justify-center sm:justify-center pt-4">
          <DialogClose
            className={cn(
              'rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-0'
            )}
          >
            <Button
              variant="default"
              className="flex px-0 py-[10px] justify-center items-center rounded-1 bg-primary hover:bg-primary-hover w-[346px]"
              onClick={() => {
                handleConfirm(activeFeature);
              }}
            >
              <span className="font-inter text-sm text-white leading-[28px] font-medium text-[20px]">
                <span>Complete</span>
                {activeFeature.length > 0 && <span> ({activeFeature.length})</span>}
              </span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
