'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

import AccountSetting from './AccountSetting';
import { Button } from '@/components/ui/button';

import { logout } from '@/lib/api';
import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { showErrorDialog } from '@/utils/index';
import { eventBus } from '@/utils/events';

type actionType = 'membership' | 'payment' | 'setting';

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

export default function Avatar() {
  const [isOpen, setIsOpen] = useState(false);

  const [settingVisible, setSettingVisible] = useState(false);

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

  // log out
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

  const handleAction = (key: actionType) => {
    if (key === 'setting') {
      setSettingVisible(true);
    }
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
        <div className="fixed inset-0 top-[56px] bg-black/30 z-40" onClick={() => setIsOpen(false)}>
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
                    className="flex items-center justify-between px-3 h-[42px] leading-[42px] font-semibold text-[#000305]"
                    key={item.id}
                    onClick={() => {
                      handleAction(item.key as actionType);
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
      )}

      <AccountSetting handleLogout={handleLogout} open={settingVisible} onOpenChange={setSettingVisible} />
    </div>
  );
}
