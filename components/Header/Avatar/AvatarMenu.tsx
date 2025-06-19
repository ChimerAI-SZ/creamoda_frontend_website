import React from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { actionList } from './const';

import type { AvatarActionType } from '.';

const AvatarMenu: React.FC<{
  closeMenu: () => void;
  handleAction: (key: AvatarActionType) => void;
  handleLogout: () => void;
}> = ({ closeMenu, handleAction, handleLogout }) => {
  const { username, email, headPic } = usePersonalInfoStore();

  return (
    <div className="fixed inset-0 top-[56px] z-40" onClick={closeMenu}>
      <div
        className="fixed top-[56px] right-6 bg-white z-50 flex px-6 flex-col items-center w-[300px] rounded-[16px] shadow-[-2px_4px_10px_0px_rgba(0,0,0,0.05)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full">
          <div className="flex items-center justify-start gap-3 py-4 border-b border-[#F5F5F5]">
            <div className="w-[40px] h-[40px] overflow-hidden rounded-[50%] border-[#666] border-[1px]">
              <Image
                src={headPic || '/images/defaultAvatar.svg'}
                alt="用户头像"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-[#000] text-[16px] font-inter font-semibold leading-5">{username}</div>
              <div className="text-[#B3B3B3] text-[16px] font-inter font-normal leading-5">{email}</div>
            </div>
          </div>

          <div className="py-3 border-b border-[#F5F5F5]">
            {actionList.map(item => (
              <div
                className="flex items-center justify-start gap-3 px-4 h-[42px] leading-[42px] font-semibold text-[#000305] cursor-pointer"
                key={item.id}
                onClick={() => {
                  handleAction(item.key as AvatarActionType);
                }}
              >
                <div>
                  <Image src={`/images/menu/${item.iconName}.svg`} alt={item.iconName} width={24} height={24} />
                </div>
                <div className="text-[#0A1532] text-[16px] font-inter font-medium leading-[22px]">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-start py-3 px-4">
            <div className="flex items-center justify-start gap-4 cursor-pointer" onClick={handleLogout}>
              <Image src="/images/menu/log_out.svg" alt="logout" width={24} height={24} />
              <span className="text-gray-60 text-[16px] font-inter font-medium leading-[22px]">Log out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AvatarMenu);
