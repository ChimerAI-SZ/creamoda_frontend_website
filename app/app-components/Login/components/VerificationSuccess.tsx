import { Button } from '@/components/ui/button';
import celebration from '@/images/login/celebration.png';
import right from '@/images/login/right.svg';
import Image from 'next/image';

interface VerificationSuccessProps {
  onBackToLogin: () => void;
}

export const VerificationSuccess = ({ onBackToLogin }: VerificationSuccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-center">
        <h2 className="flex items-center justify-center gap-2 text-[#121316] text-center font-inter text-2xl font-medium leading-8">
          Congratulations! <Image src={celebration.src} alt="Celebration" width={21} height={21} />
        </h2>
        <p className="text-[#999] font-inter text-xs font-normal ">You have successfully authenticated</p>
      </div>
      <Image src={right.src} alt="Right" className="mt-[12px]" width={44} height={44} />

      <p className="text-center mt-[12px] text-[14px] font-normal text-[#121316] max-w-md font-inter leading-6">
        You are now logged in to your account. You can now access all the features of the application.
      </p>
      <Button
        onClick={onBackToLogin}
        className="h-[52px] w-[200px] py-[10px] px-4 mt-[16px] flex justify-center items-center gap-[6px] rounded-[4px] bg-[#FFFFFF] border border-primary hover:bg-[#FFFFFF] hover:text-primary/80 hover:border-primary/80 text-primary font-medium text-sm leading-5"
      >
        Back to Login
      </Button>
    </div>
  );
};
