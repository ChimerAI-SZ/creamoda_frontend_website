import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import google from '@/images/login/google.svg';

interface EmailVerificationProps {
  email?: string;
  onBackToLogin: () => void;
}

export const EmailVerification = ({ email, onBackToLogin }: EmailVerificationProps) => {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    // 这里可以添加重新发送邮件的逻辑
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-[#F97917]/10 rounded-full flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
              stroke="#F97917"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M22 6L12 13L2 6" stroke="#F97917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-center text-[#121316] font-inter">Check your email</h2>
      </div>

      <button className="h-[52px] w-full py-[10px] px-4 flex items-center justify-center gap-[6px] rounded-[4px] border border-[rgba(249,121,23,0.3)] bg-white hover:bg-gray-50 transition-colors">
        <Image src={google.src} alt="Google Logo" width={20} height={20} className="cursor-pointer" />
        <span className="text-sm font-medium text-[#121316] font-inter">Continue with Google</span>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#666]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-[#666] font-inter text-sm font-medium leading-5">OR</span>
        </div>
      </div>

      <div className="text-center space-y-6">
        <p className="text-sm text-[#121316] font-inter">
          We just sent you an E-mail.
          <br />
          Click the link inside.
        </p>

        {email && <p className="text-sm font-medium text-[#121316] font-inter">{email}</p>}

        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleResendEmail}
            disabled={isResending}
            className={`h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] ${
              !isResending ? 'bg-[#F97917] hover:bg-[#F97917]/90' : 'bg-[rgba(249,121,23,0.5)] cursor-not-allowed'
            } text-white font-inter text-sm font-medium leading-5`}
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </Button>

          <Button
            type="button"
            onClick={onBackToLogin}
            variant="outline"
            className="h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] border border-[#E4E4E7] text-[#121316] font-inter text-sm font-medium leading-5"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};
