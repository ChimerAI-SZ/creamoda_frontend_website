import React, { ReactNode, useState, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GetIntTouchDialogProps {
  trigger: ReactNode;
}

const GetIntTouchDialog: React.FC<GetIntTouchDialogProps> = ({ trigger }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    // 处理提交逻辑
    console.log('提交的邮箱:', email);
    // 这里可以添加API调用或其他处理逻辑
  };

  // 组件挂载时从 localStorage 获取邮箱
  React.useEffect(() => {
    // 确保代码在浏览器环境中运行
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent closeBtnUnvisible={false} className="w-[420px] h-[260px] p-6 gap-0">
        <DialogHeader>
          <DialogTitle className="text-[#121316] font-inter text-2xl font-semibold leading-8">Get in touch</DialogTitle>

          <DialogDescription className="text-[#737373] font-inter text-sm font-normal leading-5 mt-2">
            Leave your email address so we can contact you ASAP.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <div>
            <Label
              htmlFor="email"
              className="text-[#121316] font-inter text-sm font-medium leading-5 mb-[6px] inline-block"
            >
              Email address
            </Label>
            {/* 自动带入用户登陆用的邮箱 */}
            <Input id="email" type="email" value={email} onChange={handleEmailChange} className="h-[40px] text-base" />
          </div>

          <div className="flex justify-center items-center gap-[24px] mt-[24px]">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-[96px] h-[40px] py-[10px] px-[16px] text-base font-medium border-[#DCDCDC]"
              >
                <span className="text-[#121316] font-inter text-sm font-medium leading-5">Cancel</span>
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="default"
                onClick={handleSubmit}
                className="w-[96px] h-[40px] py-[10px] px-[16px] text-base font-medium"
              >
                <span className="text-white font-inter text-sm font-medium leading-5">Confirm</span>
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetIntTouchDialog;
