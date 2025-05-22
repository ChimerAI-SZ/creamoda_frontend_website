import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Modal from './Modal';
import { Button } from '@/components/ui/button';
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
        title: 'Current subscription',
        content: (
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-start gap-4">
                <Image
                  src="/images/membership/basic_plan.svg"
                  alt="sparkles"
                  width={80}
                  height={80}
                  className="object-cover"
                />
                <span className="text-[#000] text-center font-inter text-[20px] font-light leading-[20px]">
                  Basic plan - $ 19.9 per month
                </span>
              </div>
              <div className="text-[#000] font-inter text-[14px] font-light leading-[20px]">
                Your subscription will renew on May 14,2025
              </div>
            </div>
            <div>
              <Button variant="outline" className="p-2 py-0 h-[28px] w-[233px]">
                Cancel subscription
              </Button>
            </div>
          </div>
        )
      },
      {
        title: 'Billing information',
        content: (
          <div className="flex items-center flex-col">
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
                        onClick={() => setIsEditingUsername(false)}
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
                      className="p-2 py-0 h-[28px] w-[233px]"
                      onClick={() => setIsEditingUsername(true)}
                    >
                      Update information
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Billing history',
        content: (
          <div className="space-y-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">May 4, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap">Basic plan</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">$19.9</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">May 1, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap">100 credits</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">$10</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Apr. 1, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap">100 credits</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Unpaid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">$10</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      }
    ];

    return <Modal title="Orders & Payment" open={open} onOpenChange={onOpenChange} sections={sections} />;
  }
);

AccountSettingsDrawer.displayName = 'AccountSettingsDrawer';
export default AccountSettingsDrawer;
