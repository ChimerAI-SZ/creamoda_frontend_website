'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import AccountSetting from './AccountSettings';
import AvatarMenu from './AvatarMenu';

import { logout } from '@/lib/api';
import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { showErrorDialog } from '@/utils/index';
import { eventBus } from '@/utils/events';

export type AvatarActionType = 'membership' | 'payment' | 'setting';

export default function Avatar() {
  const [isMenuVisible, setIsMenuVisible] = useState(false); // 个人详情菜单弹窗是否展示
  const [settingVisible, setSettingVisible] = useState(false); // account settings 弹窗是否展示

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
    if (key === 'setting') {
      setSettingVisible(true);
    }
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

      {isMenuVisible && <AvatarMenu closeMenu={closeMenu} handleAction={handleAction} handleLogout={handleLogout} />}

      <AccountSetting
        handleLogout={handleLogout}
        open={settingVisible}
        onOpenChange={setSettingVisible}
        setIsMenuVisible={setIsMenuVisible}
      />
    </div>
  );
}
