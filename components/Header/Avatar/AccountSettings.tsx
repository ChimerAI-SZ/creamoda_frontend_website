import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Modal from './Modal';
import { Button } from '@/components/ui/button';
import ChangePwd from './ChangePwdDialog';
import { UsernameRequirements } from '@/app/app-components/Login/components/UsernameRequirements';
import { Input } from '@/components/ui/input';

import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { updateUserInfo, uploadImage } from '@/lib/api';
import { showErrorDialog } from '@/utils/index';
import { LegalList } from './const';

const AccountSettingsDrawer = React.memo(
  ({
    handleLogout,
    open,
    onOpenChange,
    setIsMenuVisible
  }: {
    handleLogout: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setIsMenuVisible: (open: boolean) => void;
  }) => {
    const { username, email, headPic, hasPwd, updateUsername, updateHeadPic } = usePersonalInfoStore();

    // 编辑用户名的输入框的值
    const [newUsername, setNewUsername] = useState(username);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [changePwdOpen, setChangePwdOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [usernameTooltipVisible, setUsernameTooltipVisible] = useState(false);

    const router = useRouter();

    /**
     * 将图片上传到服务器
     * @param {File} file - 要上传的图片文件
     */
    const uploadImageToServer = async (file: File) => {
      try {
        const url = await uploadImage(file);
        updateHeadPic(url);

        handleUpdateUserInfo({ headPic: url });
      } catch (error) {
        console.error('Image upload error:', error);
        showErrorDialog(error instanceof Error ? error.message : 'Failed to upload image');
      }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        await uploadImageToServer(file);
      }
    };

    const handleUpdateUserInfo = useCallback(
      (updates: { headPic?: string | null; username?: string | null; pwd?: string | null }) => {
        const updatePayload: { headPic: string | null; username: string | null; pwd: string | null } = {
          headPic: null,
          username: null,
          pwd: null
        };

        if (updates.headPic) {
          updatePayload.headPic = updates.headPic;
          setSelectedImage(updates.headPic);
        }
        if (updates.username) {
          updatePayload.username = updates.username;
        }
        if (updates.pwd) {
          updatePayload.pwd = updates.pwd;
        }

        updateUserInfo(updatePayload)
          .then(res => {
            // 处理响应
            if (res.code === 0) {
              setIsEditingUsername(false);
              updateUsername(newUsername);
            } else {
              showErrorDialog(res.message || 'Failed to update username');
            }
          })
          .catch(error => {
            // 处理错误
            showErrorDialog(error.message || 'Failed to update username');
          });
      },
      []
    );

    const navigateAndCloseDialogs = (path: string) => {
      router.push(path);

      onOpenChange(false);
      setIsMenuVisible(false);
    };

    // 保存新用户名
    const handleSaveUsername = () => {
      if (newUsername.length < 3 || newUsername.length > 20 || !/^[\p{L}\p{N}_\-\.]*$/u.test(username)) {
        setUsernameTooltipVisible(true);
        return;
      }

      handleUpdateUserInfo({ username: newUsername });
    };

    const sections = [
      {
        title: 'Profile',
        content: (
          <div className="flex items-center flex-col">
            <div className="w-full">
              <label htmlFor="upload-button" className="w-full">
                <div className="w-full h-[64px] mb-4 focus:primarySecondary-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer relative">
                  <div className="w-[64px] h-[64px] rounded-full overflow-hidden">
                    <Image
                      src={selectedImage || headPic || '/images/defaultAvatar.svg'}
                      alt="用户头像"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </label>
              <input id="upload-button" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between w-full mb-4 relative gap-3">
                <div className="text-[#0A1532] text-base font-medium w-[100px]">Username</div>
                <div className="flex-grow text-[#999] text-[20px] leading-[20px] font-light">
                  {isEditingUsername ? (
                    <div className="max-w-[280px]">
                      {/* <UsernameRequirements username={newUsername} tooltipVisible={usernameTooltipVisible}> */}
                      <Input
                        type="text"
                        placeholder="New Username"
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        className="h-[42px]"
                      />
                      {/* </UsernameRequirements> */}
                    </div>
                  ) : (
                    <span className="text-primary text-base font-medium">{username}</span>
                  )}
                </div>
                <div className="absolute right-0">
                  {isEditingUsername ? (
                    <div className="flex items-center justify-start gap-2">
                      <Button
                        variant="primarySecondary"
                        className="p-2 py-0 h-[32px] w-[90px]"
                        onClick={() => {
                          setNewUsername('');
                          setIsEditingUsername(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" className="p-2 py-0 h-[32px] w-[90px]" onClick={handleSaveUsername}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primarySecondary"
                      className="p-2 py-0 h-[28px] w-[180px]"
                      onClick={() => setIsEditingUsername(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-start w-ful relative gap-3">
                <div className="text-[#0A1532] text-base font-medium w-[100px]">E-mail</div>
                <div className="text-gray-60 text-base font-medium">{email}</div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Account management',
        content: (
          <div className="flex flex-col gap-3">
            {hasPwd && (
              <div className="relative flex items-center justify-start">
                <div className="text-[#0A1532] text-base font-normal">Update your login password</div>
                <div className="absolute right-0 w-[180px]">
                  <Button
                    variant="primarySecondary"
                    className="w-full p-2 py-0 h-[28px]"
                    onClick={() => setChangePwdOpen(true)}
                  >
                    Change password
                  </Button>
                </div>
              </div>
            )}

            <div className="relative flex items-center justify-start">
              <div className="text-[#0A1532] text-base font-normal">Safely sign out of your account</div>
              <div className="absolute right-0 w-[180px]">
                <Button variant="primarySecondary" className="w-full p-2 py-0 h-[28px]" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </div>

            <div className="relative flex items-center justify-start">
              <div className="text-[#0A1532] text-base font-normal">Permanently delete your account and all data</div>
              <div className="absolute right-0 w-[180px]">
                <Button variant="primarySecondary" className="w-full p-2 py-0 h-[28px]" disabled>
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Legal',
        content: (
          <div className="space-y-2">
            {LegalList.map(item => (
              <div className="relative flex items-center justify-between" key={item.title}>
                <div className="text-[#0A1532] text-base font-normal">{item.title}</div>
                <div className="flex items-center justify-start gap-2">
                  <div
                    className="flex items-center justify-start gap-1"
                    onClick={() => {
                      navigateAndCloseDialogs(item.route);
                    }}
                  >
                    <span className="text-primary text-base font-medium">Read</span>
                    <Image src={'/images/menu/jump.svg'} alt="pdf" width={16} height={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    ];

    return (
      <>
        <Modal title="Account Settings" open={open} onOpenChange={onOpenChange} sections={sections} />

        {/* 修改密码的弹窗 */}
        <ChangePwd open={changePwdOpen} onOpenChange={setChangePwdOpen} handleUpdateUserInfo={handleUpdateUserInfo} />
      </>
    );
  }
);

AccountSettingsDrawer.displayName = 'AccountSettingsDrawer';
export default AccountSettingsDrawer;
