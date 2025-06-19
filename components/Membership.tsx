import React, { useState } from 'react';
import Image from 'next/image';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { DollarSign } from 'lucide-react';

import { Overlay } from '@/components/ui/overlay';

import { cn } from '@/utils';
import { handlePurchaseCredit, handleSubscribe, handleCaptureOrder } from '@/lib/api';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

export const paymentList = [
  {
    title: 'Credit',
    type: [
      {
        key: 'credit_40',
        title: '40 Credit',
        description: [
          'Create 40 designs & other creations',
          '50 images / every 4 hours',
          'Simultaneous generations: 1'
        ],
        logo: 'credit_log_1.svg',
        price: 5,
        alert: 'One-time payment',
        subscribeLevel: 0
      },
      {
        key: 'credit_100',
        title: '100 Credit',
        description: [
          'Create 100 designs & other creations',
          '50 images / every 4 hours',
          'Simultaneous generations: 1'
        ],
        logo: 'credit_log_2.svg',
        price: 10,
        alert: 'One-time payment',
        subscribeLevel: 0
      },
      {
        key: 'credit_200',
        title: '200 Credit',
        description: [
          'Create 200 designs & other creations',
          '50 images / every 4 hours',
          'Simultaneous generations: 1'
        ],
        logo: 'credit_log_3.svg',
        price: 30,
        alert: 'One-time payment',
        subscribeLevel: 0
      }
    ]
  },
  {
    title: 'Plan',
    type: [
      {
        key: 'plan_basic',
        title: 'Basic Plan',
        description: ['200 credits', '100 images every 4 hours', 'Simultaneous generations: 2'],
        logo: 'basic_plan.svg',
        price: '19.9',
        alert: 'Cancel anytime',
        subscribeLevel: 1
      },
      {
        key: 'plan_pro',
        title: 'Pro Plan',
        description: ['400 credits', '200 images every 4 hours', 'Simultaneous generations: 4'],
        logo: 'pro_plan.svg',
        price: '39.9',
        alert: 'Cancel anytime',
        subscribeLevel: 2
      },
      {
        key: 'plan_enterprise',
        title: 'Enterprise Plan',
        description: [
          'Unlimited generation rate',
          'Simultaneous generations: 8',
          'Priority customer support',
          'Custom AI model training'
        ],
        price: '59.9',
        logo: 'enterprise_plan.svg',
        alert: 'Cancel anytime',
        subscribeLevel: 3
      }
    ]
  }
];

export type PaymentType = 'Credit' | 'Plan';

const Membership: React.FC<{ onClose: () => void; defaultType?: PaymentType }> = ({
  onClose,
  defaultType = 'Credit'
}) => {
  const [selectedType, setSelectedType] = useState<PaymentType>(defaultType);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  return (
    <Overlay onClick={onClose}>
      <div>
        <div className="relative flex bg-[#EFF3F6] p-1 mx-auto mb-5 w-[247px] h-[40px] rounded-[12px]">
          <div
            className={cn(
              'absolute w-1/2 bg-white h-[calc(100%-8px)] rounded-[12px] transition-transform duration-500 ease-in-out transform z-0 shadow-[0px_8px_40px_0px_rgba(10,21,50,0.06)]',
              selectedType === 'Credit' ? 'translate-x-0' : 'translate-x-[94%]'
            )}
          ></div>
          {paymentList.map(item => (
            <div key={item.title} className="flex-1 text-center flex items-center justify-center z-10 cursor-pointer">
              <div
                onClick={e => {
                  e.stopPropagation();
                  setSelectedType(item.title as PaymentType);
                }}
                className={cn(
                  'px-4 leading-[22px] text-gray-40 font-inter font-bold text-[16px] transition-colors duration-500 ease-in-out',
                  selectedType === item.title && 'text-primary'
                )}
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <PayPalScriptProvider options={{ clientId, vault: true }}>
          <div className="flex gap-5">
            {paymentList
              .find(item => item.title === selectedType)
              ?.type.map((type, index, arr) => (
                <div
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  key={type.key}
                  className={cn(
                    'bg-gradient-card rounded-[16px] w-[274px] h-[490px] relative shadow-card-shadow flex items-center justify-center overflow-hidden'
                  )}
                >
                  {index === arr.length - 1 && (
                    <div className="absolute top-0 right-0 h-[40px] bg-[#D0C4FF] px-2 py-[6px] flex items-center justify-center gap-1 z-10 rounded-bl-[16px]">
                      <Image src="/images/membership/best_value.svg" alt="best value" width={16} height={16} />
                      <span className="text-[#0A1532] text-xs font-bold leading-[22px]">Best Value</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      'bg-white relative p-4 pt-[50px] pb-[24px] rounded-[14px]',
                      index === arr.length - 1 ? 'h-[calc(100%-6px)] w-[calc(100%-6px)]' : 'h-full w-full'
                    )}
                  >
                    <div>
                      <div className="text-[#0A1532] text-center font-inter text-[24px] font-bold leading-[34px] mb-6">
                        {type.title}
                      </div>
                      <div className="flex items-start justify-center gap-1 mb-1 h-[32px]">
                        <DollarSign className="h-5 w-5" />
                        <div className="flex items-end justify-start leading-[32px] gap-1">
                          <span className="text-[28px] font-bold">{type.price}</span>
                          {selectedType === 'Plan' && (
                            <span className="text-[14px] font-normal leading-[24px]">per month</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-[96px] h-[96px] flex items-center justify-center shrink-1 mx-auto mb-8">
                      <Image src={`/images/membership/${type.logo}`} alt={type.title} width={96} height={96} />
                    </div>
                    <div>
                      {type.description.map(desc => (
                        <div key={desc} className="flex items-center gap-1 mb-3">
                          <span className="w-[16px] h-[16px]">
                            <Image src={`/images/membership/correct.svg`} alt="check" width={16} height={16} />
                          </span>
                          <span className="text-[#0A1532] text-xs font-medium">{desc}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col items-center absolute bottom-6 left-0 right-0">
                      <div className="h-[40px] max-h-[40px] overflow-hidden">
                        <PayPalButtons
                          createOrder={
                            selectedType === 'Credit'
                              ? async () => {
                                  const value = +type.key.split('_')[1];

                                  const res = await handlePurchaseCredit(value as 40 | 100 | 200);
                                  if (res.code === 0) {
                                    return res.data.id;
                                  } else {
                                    console.log(res);
                                  }
                                }
                              : undefined
                          }
                          createSubscription={
                            selectedType === 'Plan'
                              ? async () => {
                                  const levelMap = new Map([
                                    ['plan_basic', 1],
                                    ['plan_pro', 2],
                                    ['plan_enterprise', 3]
                                  ]);

                                  const res = await handleSubscribe(
                                    levelMap.get(type.key as 'plan_basic' | 'plan_pro' | 'plan_enterprise') as 1 | 2 | 3
                                  );

                                  if (res.code === 0) {
                                    return res.data.id;
                                  } else {
                                    console.log(res);
                                  }
                                }
                              : undefined
                          }
                          onApprove={async data => {
                            const res = await handleCaptureOrder(
                              data.orderID,
                              selectedType === 'Plan' ? data.subscriptionID || '' : undefined
                            );

                            if (res.code === 0) {
                              onClose();
                              await usePersonalInfoStore.getState().fetchUserInfo();
                            } else {
                              console.log(res);
                            }
                          }}
                        />
                      </div>
                      <div className="text-[#999] text-center font-inter text-[14px] font-medium leading-[20px]">
                        {type.alert}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </PayPalScriptProvider>
      </div>
    </Overlay>
  );
};

export default Membership;
