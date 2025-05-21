import React, { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Overlay } from '@/components/ui/overlay';

import { cn } from '@/utils';

const paymentList = [
  {
    title: 'Credit',
    type: [
      {
        title: '40 Credit',
        description: [
          'Create 40 designs & other creations',
          '50 images / every 4 hours',
          'Simultaneous generations: 1'
        ],
        logo: 'credit_log_1.svg',
        price: 5,
        alert: 'One-time payment'
      },
      {
        title: '100 Credit',
        description: [
          'Create 100 designs & other creations',
          '50 images / every 4 hours',
          'Simultaneous generations: 1'
        ],
        logo: 'credit_log_2.svg',
        price: 10,
        alert: 'One-time payment'
      },
      {
        title: '200 Credit',
        description: [
          'Create 200 designs & other creations',
          '50 images / every 4 hours',
          'Simultaneous generations: 1'
        ],
        logo: 'credit_log_3.svg',
        price: 30,
        alert: 'One-time payment'
      }
    ]
  },
  {
    title: 'Plan',
    type: [
      {
        title: 'Basic Plan',
        description: ['200 credits', '100 images every 4 hours', 'Simultaneous generations: 2'],
        logo: 'basic_plan.svg',
        price: '19.9 per month',
        alert: 'Cancel anytime'
      },
      {
        title: 'Pro Plan',
        description: ['400 credits', '200 images every 4 hours', 'Simultaneous generations: 4'],
        logo: 'pro_plan.svg',
        price: '39.9 per month',
        alert: 'Cancel anytime'
      },
      {
        title: 'Enterprise Plan',
        description: [
          'Unlimited generation rate',
          'Simultaneous generations: 8',
          'Priority customer support',
          'Custom AI model training'
        ],
        price: '59.9 per month',
        logo: 'enterprise_plan.svg',
        alert: 'Cancel anytime'
      }
    ]
  }
];

const Membership: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<'Credit' | 'Plan'>('Credit');

  return (
    <Overlay onClick={onClose}>
      <div>
        <div className="relative flex gap-4 bg-[#f5f5f5] p-2 mx-auto mb-[48px] w-[344px] rounded-[36px]">
          <div
            className={cn(
              'absolute w-1/2 bg-[#F97917] h-[calc(100%-16px)] rounded-full transition-transform duration-500 ease-in-out transform z-0',
              selectedType === 'Credit' ? 'translate-x-0' : 'translate-x-[90%]'
            )}
          ></div>
          {paymentList.map(item => (
            <div key={item.title} className="flex-grow text-center z-10 cursor-pointer">
              <div
                onClick={e => {
                  e.stopPropagation();
                  setSelectedType(item.title as 'Credit' | 'Plan');
                }}
                className={cn(
                  'text-[14px] font-medium h-[24px] leading-[24px] rounded-full text-[#999] font-inter transition-colors duration-500 ease-in-out',
                  selectedType === item.title && 'text-[#fff]'
                )}
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-[72px]">
          {paymentList
            .find(item => item.title === selectedType)
            ?.type.map(type => (
              <div
                onClick={e => {
                  e.stopPropagation();
                }}
                key={type.title}
                className="bg-white rounded-lg p-4 py-[40px] w-[320px] h-[572px] flex flex-col items-center justify-between"
              >
                <div className="text-black text-center font-inter text-[30px] font-medium leading-[20px]">
                  {type.title}
                </div>
                <div className="w-[200px] h-[200px] flex items-center justify-center">
                  <Image src={`/images/membership/${type.logo}`} alt={type.title} width={200} height={200} />
                </div>
                <div>
                  {type.description.map(desc => (
                    <div
                      key={desc}
                      className="text-black font-inter text-[15px] font-medium leading-[34px] flex items-center"
                    >
                      <span className="text-[#000] text-[24px] mr-2">·</span>
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <div>
                    <Button variant="default" className="min-w-[168px] rounded-[100px]">
                      ${type.price}
                    </Button>
                  </div>
                  <div className="text-[#999] text-center font-inter text-[14px] font-medium leading-[20px]">
                    {type.alert}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Overlay>
  );
};

export default Membership;
