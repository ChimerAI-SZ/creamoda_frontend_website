import React, { useRef, useEffect, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import designFeatures from '@/public/design_features.json';

// 定义类型
type DesignFeaturesType = {
  [key: string]: {
    [subcategory: string]: string[];
  };
};

const DefaultTrigger = (
  <div className="flex items-center gap-2">
    <div className="cursor-pointer flex h-[20px] px-[8px] justify-center items-center content-center flex-shrink-0 flex-wrap text-[#F97917] font-inter text-[12px] font-semibold leading-[20px] border border-[#F97917] bg-[#FFF] rounded-[20px] text-center">
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

  // 一级 nav 的左右阴影显影控制
  const [showBefore, setShowBefore] = useState(false);
  const [showAfter, setShowAfter] = useState(false);

  // 选中的一级
  const [activeCategory, setActiveCategory] = useState('Style'); // 一级分类选中状态
  const [activeSubcategory, setActiveSubcategory] = useState('Style'); // 二级分类选中状态
  const [activeFeature, setActiveFeature] = useState<string[]>([]); // 选中的词条

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

  const toggleFeature = (feature: string) => {
    setActiveFeature(prev => (prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[60vw] max-w-[calc(100vw-32px)] p-[24px] pb-[16px] gap-0">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center h-[32px] mb-[16px]">
            <span>Design Features</span>
            <X className="w-[24px] h-[24px]" />
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-[16px]">
          <div className="flex justify-start items-start gap-2">
            <span className="shrink-0">Selected Features:</span>
            <div className="flex justify-start items-center flex-wrap px-[12px] max-h-[76px] overflow-y-auto">
              {activeFeature.map(feature => (
                <div
                  key={feature}
                  className="px-[8px] py-[2px] mb-[4px] mr-[8px] border border-border rounded-sm flex items-center justify-start gap-1 shrink-0"
                >
                  {feature}
                  <X
                    className="w-[12px] h-[12px] text-gray-400 hover:text-black cursor-pointer shrink-0"
                    onClick={() => toggleFeature(feature)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className={cn(
            'relative overflow-hidden flex gap-2 items-start justify-start',
            showBefore &&
              'before:absolute before:inset-y-0 before:left-0 before:w-[20px] before:shadow-[inset_10px_0_8px_-8px_rgba(0,0,0,0.12)]',
            showAfter &&
              'after:absolute after:inset-y-0 after:right-0 after:w-[20px] after:shadow-[inset_-10px_0_8px_-8px_rgba(0,0,0,0.12)]'
          )}
        >
          <div
            className="flex justify-start items-center overflow-x-auto space-x-[36px]"
            style={{
              scrollbarWidth: 'none'
            }}
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {Object.keys(designFeatures).map(category => (
              <div
                className={cn(
                  `shrink-0 font-inter text-base font-normal cursor-pointer py-[6px]`,
                  category === activeCategory ? 'text-primary border-b-2 border-primary active-category' : ''
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

        <div className="w-full grid grid-cols-12 gap-x-2.5 h-[500px]">
          <div className="col-span-3 overflow-y-auto h-full">
            {Object.keys((designFeatures as DesignFeaturesType)[activeCategory]).map(subcategory => (
              <div
                key={subcategory}
                className={cn(
                  'flex justify-start items-center border-b border-b-border mr-4',
                  subcategory === activeSubcategory && 'text-primary'
                )}
              >
                <div
                  className="px-[12px] py-[6px] cursor-pointer"
                  onClick={() => {
                    setActiveSubcategory(subcategory);
                  }}
                >
                  {subcategory}
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-9 overflow-y-auto h-full">
            <div className="grid grid-cols-4 gap-2.5">
              {(designFeatures as DesignFeaturesType)[activeCategory][activeSubcategory]?.map((feature, index) => (
                <div
                  key={feature + new Date().getTime()}
                  className={cn(
                    'flex justify-start items-center border border-border rounded-sm cursor-pointer',
                    activeFeature.includes(feature) && 'bg-primary/50 text-white'
                  )}
                  onClick={() => toggleFeature(feature)}
                >
                  <div className="px-[12px] py-[6px]">{feature}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-[16px]">
          <DialogClose
            className={cn(
              'rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-0'
            )}
          >
            <Button
              variant="outline"
              className="flex w-[142px] h-[40px] px-0 py-[10px] justify-center items-center rounded-1"
              onClick={() => {
                handleConfirm(activeFeature);
              }}
            >
              <span className="text-[#F97917] font-inter text-sm font-medium leading-5">
                <span>OK</span>
                {activeFeature.length > 0 && <span className="text-[#F97917]"> ({activeFeature.length})</span>}
              </span>
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
