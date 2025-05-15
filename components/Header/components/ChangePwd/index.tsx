import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PasswordRequirements } from '@/app/app-components/Login/components/PasswordRequirements';

const ChangePwd = React.memo(({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 密码输入框是否聚焦，用于展示密码格式规范
  const [isPwdFocused, setIsPwdFocused] = useState(false);

  const [error, setError] = useState('');

  // 提交修改密码
  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-w-none flex flex-col">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="w-full leading-[48px] h-[48px]">
            <span className="text-[#000] font-inter text-[20px] font-bold text-center">Create a new password</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 my-[32px] mx-[56px]">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setIsPwdFocused(true)}
            onBlur={() => setIsPwdFocused(false)}
          />
          {isPwdFocused && <PasswordRequirements password={password} />}
          <input
            type="password"
            placeholder="Re-type new password"
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
          {error && <p className="mt-1 text-[#E50000] text-xs font-inter">{error}</p>}
        </div>
        <div className="flex items-center justify-center">
          <Button
            className="w-[168px] bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
            disabled={!password || !confirmPassword || password !== confirmPassword}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default ChangePwd;
