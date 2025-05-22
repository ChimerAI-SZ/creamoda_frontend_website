'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import AccountSetting from './AccountSettings';
import AvatarMenu from './AvatarMenu';
import Membership from '@/components/Membership';
import OrdersAndPayment from './OrdersAndPayment';

import { logout } from '@/lib/api';
import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { showErrorDialog } from '@/utils/index';
import { eventBus } from '@/utils/events';

export type AvatarActionType = 'membership' | 'payment' | 'setting';

export default function Avatar() {
  const [isMenuVisible, setIsMenuVisible] = useState(false); // 个人详情菜单弹窗是否展示
  const [settingVisible, setSettingVisible] = useState(false); // account settings 弹窗是否展示
  const [membershipVisible, setMembershipVisible] = useState(false); // membership 弹窗是否展示
  const [paymentVisible, setPaymentVisible] = useState(false); // payment 弹窗是否展示
  // 获取用户信息
  const { username, email, headPic, fetchUserInfo } = usePersonalInfoStore();

  const handleOpenMenu = () => {
    const token = localStorage.getItem('auth_token');

    // 已经登录了就打开详情，没有登录就出发登录弹窗
    if (token) {
      setIsMenuVisible(true);
    } else {
      eventBus.emit('auth:login', { isOpen: true });
    }
  };

  // log out
  const handleLogout = () => {
    setIsMenuVisible(false);
    setSettingVisible(false);

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

  const handleAction = (key: AvatarActionType) => {
    const visibilityMap = {
      setting: setSettingVisible,
      membership: setMembershipVisible,
      payment: setPaymentVisible
    };

    // 隐藏菜单并打开对应的 dialog
    setIsMenuVisible(false);
    visibilityMap[key]?.(true);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    // 如果已经登录了，但是没有用户信息，则获取用户信息
    if (token && (!username || !email)) {
      fetchUserInfo();
    }
  }, [username, email, fetchUserInfo]);

  return (
    <div className="relative">
      <div className="flex items-center justify-start gap-3">
        <div
          onClick={() => {
            setMembershipVisible(true);
          }}
          className="flex items-center gap-1 rounded-full px-2 py-1 bg-gradient-to-r from-[rgba(0,143,247,0.40)] via-[rgba(160,144,249,0.40)] via-[42.97%] to-[rgba(249,121,23,0.40)] to-[82.53%] cursor-pointer"
        >
          <Image src="/images/menu/start.svg" alt="sparkles" width={16} height={16} className="object-cover" />
          <span className="text-[#FFF] text-center font-inter text-[14px] font-semibold leading-[20px]">100 Cr</span>
        </div>
        <div
          className="w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF7B0D] focus:ring-offset-2 cursor-pointer"
          onClick={handleOpenMenu}
        >
          <Image
            src={headPic || '/images/defaultAvatar.svg'}
            alt="用户头像"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {isMenuVisible && <AvatarMenu closeMenu={closeMenu} handleAction={handleAction} handleLogout={handleLogout} />}

      <AccountSetting
        handleLogout={handleLogout}
        open={settingVisible}
        onOpenChange={setSettingVisible}
        setIsMenuVisible={setIsMenuVisible}
      />

      {membershipVisible && <Membership onClose={() => setMembershipVisible(false)} />}

      <OrdersAndPayment
        handleLogout={handleLogout}
        open={paymentVisible}
        onOpenChange={setPaymentVisible}
        setIsMenuVisible={setIsMenuVisible}
      />
    </div>
  );
}
