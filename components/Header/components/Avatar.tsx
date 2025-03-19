'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { logout } from '@/lib/api';
import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { showErrorDialog } from '@/utils/index';
import { eventBus } from '@/utils/events';

export default function Avatar() {
  const [isOpen, setIsOpen] = useState(false);

  // 获取用户信息
  const { username, email, headPic, fetchUserInfo } = usePersonalInfoStore();

  // Check if user data needs to be fetched
  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    // If we have a token but no user data, fetch the user info
    if (token && (!username || !email)) {
      fetchUserInfo();
    }
  }, [username, email, fetchUserInfo]);

  const handleViewDetail = () => {
    const token = localStorage.getItem('auth_token');

    // 已经登录了就打开详情，没有登录就出发登录弹窗
    if (token) {
      setIsOpen(true);
    } else {
      eventBus.emit('auth:login', { isOpen: true });
    }
  };

  const handleLogout = () => {
    setIsOpen(false);

    // 调用登出接口
    logout()
      .then(() => {
        // 登出触发登陆弹窗
        eventBus.emit('auth:login', { isOpen: true });
        // 登出登出
        eventBus.emit('auth:logout', void 0);
      })
      .catch(error => {
        showErrorDialog('Something went wrong. Please try again later or contact support if the issue persists');
      })
      .finally(() => {
        localStorage.removeItem('auth_token');
      });
  };

  return (
    <div className="relative">
      <div
        className="w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF7B0D] focus:ring-offset-2 cursor-pointer"
        onClick={handleViewDetail}
      >
        <Image
          src={headPic || '/images/defaultAvatar.svg'}
          alt="用户头像"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>

      {isOpen && (
        <div className="fixed top-[48px] right-6 bg-white z-50 flex flex-col items-center p-6 w-[480px] rounded-[6px] shadow-[-2px_4px_10px_0px_rgba(0,0,0,0.05)]">
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <Image src={'/images/menu/closeBtn.svg'} alt="close btn" width={20} height={20} className="object-cover" />
          </button>

          <div className="mt-[12px] mb-8">
            <div className="w-[60px] h-[60px] mx-auto overflow-hidden rounded-[50%] border-[#666] border-[1px]">
              <Image
                src={headPic || '/images/defaultAvatar.svg'}
                alt="用户头像"
                width={60}
                height={60}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full max-w-md space-y-8">
            <div>
              <div className="mb-[24px]">
                <h3 className="text-[#121316] font-inter text-sm font-medium leading-5 mb-[6px]">Username</h3>
                <div className="p-[10px] w-full border rounded-sm">
                  <p className="text-[#141414] font-inter text-sm font-normal leading-5 h-[20px]">{username}</p>
                </div>
              </div>

              <div>
                <h3 className="text-[#121316] font-inter text-sm font-medium leading-5 mb-[6px]">Email</h3>
                <div className="mt-1 p-[10px] w-full border rounded-sm">
                  <p className="text-[#141414] font-inter text-sm font-normal leading-5 h-[20px]">{email}</p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-6 w-full sm:w-auto px-[16px] py-[12px] border border-[#DCDCDC] text-[#FF7B0D] rounded-sm hover:bg-orange-50 transition-colors"
              onClick={handleLogout}
            >
              <span className="text-[#F97917] font-inter text-sm font-medium leading-5">Log out</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
