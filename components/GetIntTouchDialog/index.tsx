import React, { ReactNode, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { localAPI } from '@/lib/axios';

interface GetIntTouchDialogProps {
  trigger: ReactNode;
  genImgId: string;
  source: string;
}

const GetIntTouchDialog: React.FC<GetIntTouchDialogProps> = ({ trigger, genImgId, source }) => {
  // 获取登录用户的邮箱
  const { email: userEmail } = usePersonalInfoStore();
  const [email, setEmail] = useState(userEmail);
  // 添加一个状态来控制对话框的开关
  const [open, setOpen] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    // 处理提交逻辑
    console.log('提交的邮箱:', email);
    // 这里可以添加API调用或其他处理逻辑
    localAPI
      .post('/api/v1/common/contact', {
        contactEmail: email,
        genImgId,
        source
      })
      .then(res => {
        console.log(res);
        // API调用成功后关闭对话框
        setOpen(false);
      })
      .catch(err => {
        console.error('提交失败:', err);
        // 可以在这里添加错误处理逻辑
      });
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
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-[96px] h-[40px] py-[10px] px-[16px] text-base font-medium border-[#DCDCDC]"
            >
              <span className="text-[#121316] font-inter text-sm font-medium leading-5">Cancel</span>
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              className="w-[96px] h-[40px] py-[10px] px-[16px] text-base font-medium"
            >
              <span className="text-white font-inter text-sm font-medium leading-5">Confirm</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetIntTouchDialog;
