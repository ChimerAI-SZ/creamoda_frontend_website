import React from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

import usePersonalInfoStore from '@/stores/usePersonalInfoStore';

import type { AvatarActionType } from '.';

const actionList = [
  {
    id: 0,
    key: 'membership',
    label: 'Membership'
  },
  {
    id: 1,
    key: 'payment',
    label: 'Orders & Payments'
  },
  {
    id: 2,
    key: 'setting',
    label: 'Account Settings'
  }
];

const AvatarMenu: React.FC<{
  closeMenu: () => void;
  handleAction: (key: AvatarActionType) => void;
  handleLogout: () => void;
}> = ({ closeMenu, handleAction, handleLogout }) => {
  const { username, email, headPic } = usePersonalInfoStore();

  return (
    <div className="fixed inset-0 top-[56px] bg-black/30 z-40" onClick={closeMenu}>
      <div
        className="fixed top-[70px] right-3 bg-white z-50 flex flex-col items-center p-5 w-[386px] rounded-[6px] shadow-[-2px_4px_10px_0px_rgba(0,0,0,0.05)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-start gap-3 mb-4">
            <div className="w-[32px] h-[32px] overflow-hidden rounded-[50%] border-[#666] border-[1px]">
              <Image
                src={headPic || '/images/defaultAvatar.svg'}
                alt="用户头像"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-[#000] text-[16px] font-inter font-semibold leading-5">{username}</div>
              <div className="text-[#B3B3B3] text-[16px] font-inter font-normal leading-5">{email}</div>
            </div>
          </div>

          <div>
            {actionList.map(item => (
              <div
                className="flex items-center justify-between px-3 h-[42px] leading-[42px] font-semibold text-[#000305] cursor-pointer"
                key={item.id}
                onClick={() => {
                  handleAction(item.key as AvatarActionType);
                }}
              >
                <div>{item.label}</div>
                <div>
                  <Image src="/images/menu/avatar_right_arrow.svg" alt="arrow right" width={24} height={24} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <Button
              variant="secondary"
              className="mt-6 w-[233px] px-[16px] py-[12px] border border-[#DCDCDC] text-[#fff] rounded-[30px] transition-colors"
              onClick={handleLogout}
            >
              <span className=" font-inter text-sm font-medium leading-5">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AvatarMenu);
