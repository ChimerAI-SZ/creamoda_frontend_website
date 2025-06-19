import React, { useState } from 'react';
import Image from 'next/image';
import { Info } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const ChangePwd = React.memo(
  ({
    open,
    onOpenChange,
    handleUpdateUserInfo
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    handleUpdateUserInfo: (updates: { headPic?: string | null; username?: string | null; pwd?: string | null }) => void;
  }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    // 提交修改密码
    const handleConfirm = () => {
      onOpenChange(false);
      handleUpdateUserInfo({ pwd: password });
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[408px] max-w-none flex flex-col gap-0">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="w-full leading-[48px] flex flex-col items-center justify-center mb-6">
              <Image src={'/images/menu/change_pwd.svg'} alt="close" width={40} height={40} />
              <span className="text-[#000] font-inter text-[20px] font-bold text-center">Create a new password</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mb-[32px] flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-[rgba(10,21,50,0.80)] text-sm font-inter font-medium">
                <span>New Password</span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to library</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="password"
                placeholder="Enter your new password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => {}}
                onBlur={() => {}}
              />
            </div>
            {/* {isPwdFocused && <Pass/wordRequirements password={password} />} */}
            <div className="flex flex-col gap-2">
              <div className="text-[rgba(10,21,50,0.80)] text-sm font-inter font-medium">Confirm Password</div>
              <Input
                type="password"
                placeholder="Enter your new password again"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onBlur={() => {
                  if (password !== confirmPassword) {
                    setError('Passwords do not match');
                  } else {
                    setError('');
                  }
                }}
              />
              {error && <p className="mt-1 text-error text-xs font-inter">{error}</p>}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <DialogTrigger className="flex-1">
              <Button className="w-full text-[rgba(10,21,50,0.80)]" variant="primarySecondary" onClick={handleConfirm}>
                Cancel
              </Button>
            </DialogTrigger>
            <Button
              className="flex-1"
              variant="primary"
              disabled={!password || !confirmPassword || password !== confirmPassword}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

ChangePwd.displayName = 'ChangePwd';

export default ChangePwd;
