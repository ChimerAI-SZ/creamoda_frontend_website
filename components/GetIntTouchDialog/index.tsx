import React, { ReactNode, useState } from 'react';

import {
  Dialog,
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
import { contactUs } from '@/lib/api';
interface GetIntTouchDialogProps {
  trigger: ReactNode;
  genImgId: number;
  source: '3d_making' | 'human_tuning';
}

const GetIntTouchDialog: React.FC<GetIntTouchDialogProps> = ({ trigger, genImgId, source }) => {
  // 获取登录用户的邮箱
  const { email: userEmail } = usePersonalInfoStore();
  const [email, setEmail] = useState(userEmail);
  // 添加一个状态来控制对话框的开关
  const [open, setOpen] = useState(false);
  // 添加邮箱错误状态
  const [emailError, setEmailError] = useState<string>('');

  // 留言成功后显示的确认对话框
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // 当用户输入时清除错误信息
    setEmailError('');
  };

  // 邮箱验证函数
  const validateEmail = (email: string): boolean => {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return EMAIL_REGEX.test(email);
  };

  const handleSubmit = () => {
    // 验证邮箱
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // 这里可以添加API调用或其他处理逻辑
    contactUs(email, genImgId, source)
      .then(() => {
        // API调用成功后关闭对话框
        setOpen(false);
        setConfirmDialogVisible(true);
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent closeBtnUnvisible={false} className="w-[420px] h-[260px] p-6 gap-0">
          <DialogHeader>
            <DialogTitle className="text-[#121316] font-inter text-2xl font-semibold leading-8">
              Get in touch
            </DialogTitle>

            <DialogDescription className="text-[#737373] font-inter text-sm font-normal leading-5 mt-2">
              Leave your email address so we can contact you ASAP.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <div className="relative">
              <Label
                htmlFor="email"
                className="text-[#121316] font-inter text-sm font-medium leading-5 mb-[6px] inline-block"
              >
                Email address
              </Label>
              {/* 自动带入用户登陆用的邮箱 */}
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`h-[40px] text-base ${emailError ? 'border-red-500' : ''}`}
              />
              {/* 显示邮箱错误信息 */}
              {emailError && <div className="text-red-500 text-xs mt-1 absolute bottom-[-18px]">{emailError}</div>}
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
      <Dialog open={confirmDialogVisible}>
        <DialogContent className="w-[386px] p-[24px] gap-[12px]">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="text-center w-full">
              <span className="text-[#121316] text-center font-inter text-2xl font-semibold leading-8">
                Message Received!
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <span className="text-[#121316] text-center font-inter text-[12px] font-normal leading-5">
              Thank you for reaching out to us. We have received your message and will get back to you shortly.
            </span>
          </div>
          <div className="flex justify-center mt-3">
            <Button
              variant="outline"
              className="w-[142px] h-[40px] px-0 py-[10px] justify-center items-center rounded-1"
              onClick={() => {
                // 同时关闭两个弹窗
                setConfirmDialogVisible(false);
                setOpen(false);
              }}
            >
              <span className="text-primary font-inter text-[14px] font-medium leading-[20px]">OK</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GetIntTouchDialog;
