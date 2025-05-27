import React, { useState } from 'react';
import Image from 'next/image';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { DollarSign } from 'lucide-react';

import { Overlay } from '@/components/ui/overlay';

import { cn } from '@/utils';
import { handlePurchaseCredit, handleSubscribe, handleCaptureOrder } from '@/lib/api/payment';

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
        <div className="relative flex gap-4 bg-[#f5f5f5] p-2 mx-auto mb-[48px] w-[344px] rounded-[36px]">
          <div
            className={cn(
              'absolute w-1/2 bg-primary h-[calc(100%-16px)] rounded-full transition-transform duration-500 ease-in-out transform z-0',
              selectedType === 'Credit' ? 'translate-x-0' : 'translate-x-[90%]'
            )}
          ></div>
          {paymentList.map(item => (
            <div key={item.title} className="flex-grow text-center z-10 cursor-pointer">
              <div
                onClick={e => {
                  e.stopPropagation();
                  setSelectedType(item.title as PaymentType);
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

        <PayPalScriptProvider options={{ clientId, vault: true }}>
          <div className="flex gap-[72px]">
            {paymentList
              .find(item => item.title === selectedType)
              ?.type.map(type => (
                <div
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  key={type.key}
                  className="bg-white rounded-lg p-4 py-[40px] w-[320px] h-[572px] flex flex-col items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-black text-center font-inter text-[30px] font-medium leading-[32px] mb-3">
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
                  <div className="w-[200px] h-[200px] flex items-center justify-center shrink-1">
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
                          await handleCaptureOrder(
                            data.orderID,
                            selectedType === 'Plan' ? data.subscriptionID || '' : undefined
                          );
                        }}
                      />
                    </div>
                    <div className="text-[#999] text-center font-inter text-[14px] font-medium leading-[20px]">
                      {type.alert}
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
