import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Modal from './Modal';
import { Button } from '@/components/ui/button';
import ChangePwd from './ChangePwdDialog';
import { UsernameRequirements } from '@/app/app-components/Login/components/UsernameRequirements';

import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { updateUserInfo, uploadImage } from '@/lib/api/common';
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

    const sections = [
      {
        title: 'Profile',
        content: (
          <div className="flex items-center flex-col">
            <label htmlFor="upload-button">
              <div className="w-[56px] h-[56px] mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer relative">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={selectedImage || headPic || '/images/defaultAvatar.svg'}
                    alt="用户头像"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-[16px] h-[16px] bg-gray-300 rounded-full flex items-center justify-center">
                  <Upload className="w-[12px] h-[12px] text-black cursor-pointer" />
                  <input
                    id="upload-button"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </label>
            <div className="w-full">
              <div className="flex items-start justify-between w-full mb-4 relative gap-4">
                <div className="min-w-[240px] text-[20px] leading-[28px] font-light">Username</div>
                <div className="flex-grow text-[#999] text-[20px] leading-[20px] font-light">
                  {isEditingUsername ? (
                    <div className="max-w-[280px]">
                      <input
                        type="text"
                        placeholder="New UserName"
                        className="w-full p-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                      />
                      {<UsernameRequirements username={newUsername} />}
                    </div>
                  ) : (
                    username
                  )}
                </div>
                <div className="absolute right-0">
                  {isEditingUsername ? (
                    <div className="flex items-center justify-start gap-2">
                      <Button
                        variant="outline"
                        className="p-2 py-0 h-[28px] w-[90px]"
                        onClick={() => {
                          setNewUsername('');
                          setIsEditingUsername(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        className="p-2 py-0 h-[28px] w-[90px]"
                        onClick={() => handleUpdateUserInfo({ username: newUsername })}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="p-2 py-0 h-[28px] w-[90px]"
                      onClick={() => setIsEditingUsername(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between w-ful relative gap-4">
                <div className="min-w-[240px] text-[20px] leading-[20px] font-light">E-mail</div>
                <div className="flex-grow text-[#999] text-[20px] leading-[20px] font-light">{email}</div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Account management',
        content: (
          <div className="space-y-2">
            {hasPwd && (
              <div className="relative flex items-center justify-start">
                <div className="text-[#000] font-inter text-[20px] font-light ">Update your login password</div>
                <div className="absolute right-0 w-[180px]">
                  <Button variant="outline" className="w-full p-2 py-0 h-[28px]" onClick={() => setChangePwdOpen(true)}>
                    Change password
                  </Button>
                </div>
              </div>
            )}

            <div className="relative flex items-center justify-start">
              <div className="text-[#000] font-inter text-[20px] font-light ">Safely sign out of your account</div>
              <div className="absolute right-0 w-[180px]">
                <Button variant="outline" className="w-full p-2 py-0 h-[28px]" onClick={handleLogout}>
                  Log out
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
              <div className="relative flex items-center justify-start" key={item.title}>
                <div className="text-[#000] font-inter text-[20px] font-light ">{item.title}</div>
                <div className="absolute right-0 w-[90px]">
                  <Button
                    variant="outline"
                    className="w-full p-2 py-0 h-[28px]"
                    onClick={() => {
                      navigateAndCloseDialogs(item.route);
                    }}
                  >
                    Read
                  </Button>
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
