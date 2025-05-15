import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';

import ChangePwd from '../ChangePwd';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import usePersonalInfoStore from '@/stores/usePersonalInfoStore';

import { Modal } from '@/utils/modal';

const AccountSettingsDrawer = React.memo(
  ({
    handleLogout,
    open,
    onOpenChange
  }: {
    handleLogout: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => {
    const { username, email, headPic, fetchUserInfo } = usePersonalInfoStore();

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [changePwdOpen, setChangePwdOpen] = useState(false);

    const onLogout = useCallback(() => {
      handleLogout();
    }, [handleLogout]);

    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="w-[841px] h-[680px] max-w-none flex flex-col">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle className="w-full leading-[48px] h-[48px]">
                <span className="text-[#000] font-inter text-[32px] font-bold">Account Settings</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div className="text-black font-inter text-[24px] font-medium leading-[32px] h-[32px] pb-2 border-b border-[#E0E0E0] box-content">
                  Profile
                </div>
              </div>

              <div className="flex items-center flex-col">
                <div className="w-[56px] h-[56px] mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF7B0D] focus:ring-offset-2 cursor-pointer relative">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={headPic || '/images/defaultAvatar.svg'}
                      alt="用户头像"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-[16px] h-[16px] bg-gray-300 rounded-full flex items-center justify-center">
                    <Upload className="w-[12px] h-[12px] text-black" />
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between w-full mb-4 relative gap-4">
                    <div className="min-w-[240px] text-[20px] leading-[20px] font-light">Username</div>
                    <div className="flex-grow text-[#999] text-[20px] leading-[20px] font-light">{username}</div>
                    <div className="absolute right-0">
                      {isEditingUsername ? (
                        <div className="flex items-center justify-start gap-4">
                          <Button
                            variant="outline"
                            className="p-2 py-0 h-[28px] w-[90px]"
                            onClick={() => setIsEditingUsername(false)}
                          >
                            Cancel
                          </Button>
                          <Button variant="outline" className="p-2 py-0 h-[28px] w-[90px]">
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

              <div>
                <div className="text-black font-inter text-[24px] font-medium leading-[32px] h-[32px] pb-2 border-b border-[#E0E0E0] box-content">
                  Account management
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative flex items-center justify-start">
                  <div className="text-[#000] font-inter text-[20px] font-light ">Update your login password</div>
                  <div className="absolute right-0 w-[180px]">
                    <Button
                      variant="outline"
                      className="w-full p-2 py-0 h-[28px]"
                      onClick={() => setChangePwdOpen(true)}
                    >
                      Change password
                    </Button>
                  </div>
                </div>
                <div className="relative flex items-center justify-start">
                  <div className="text-[#000] font-inter text-[20px] font-light ">Safely sign out of your account</div>
                  <div className="absolute right-0 w-[180px]">
                    <Button
                      variant="outline"
                      className="w-full p-2 py-0 h-[28px]"
                      onClick={
                        // onLogout
                        () => Modal.confirm('Are you sure you want to delete this image?')
                      }
                    >
                      Log out
                    </Button>
                  </div>
                </div>
                <div className="relative flex items-center justify-start">
                  <div className="text-[#000] font-inter text-[20px] font-light ">
                    Permanently delete your account and all data
                  </div>
                  <div className="absolute right-0 w-[180px]">
                    <Button
                      variant="outline"
                      className="w-full p-2 py-0 h-[28px]"
                      onClick={() => Modal.info('Are you sure you want to delete this image?')}
                    >
                      Delete account
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-black font-inter text-[24px] font-medium leading-[32px] h-[32px] pb-2 border-b border-[#E0E0E0] box-content">
                  Legal
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative flex items-center justify-start">
                  <div className="text-[#000] font-inter text-[20px] font-light ">Terms of service</div>
                  <div className="absolute right-0 w-[90px]">
                    <Button variant="outline" className="w-full p-2 py-0 h-[28px]">
                      Read
                    </Button>
                  </div>
                </div>
                <div className="relative flex items-center justify-start">
                  <div className="text-[#000] font-inter text-[20px] font-light ">Privacy policy</div>
                  <div className="absolute right-0 w-[90px]">
                    <Button variant="outline" className="w-full p-2 py-0 h-[28px]">
                      Read
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <ChangePwd open={changePwdOpen} onOpenChange={setChangePwdOpen} />
      </>
    );
  }
);

export default AccountSettingsDrawer;
