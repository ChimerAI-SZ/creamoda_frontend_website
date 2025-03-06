import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NavDialogProps {
  trigger: ReactNode;
}

const NavDialog: React.FC<NavDialogProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[360px] h-[168px] p-[24px] pb-[16px]">
        <DialogHeader>
          <DialogDescription>
            <div className="flex flex-col items-center justify-center text-[#121316] text-center font-inter text-base font-medium leading-[32px]">
              We are creating
              <br />
              something amazing! 🎉
            </div>
            <div className="flex justify-center mt-[16px]">
              <Button
                variant="outline"
                className="flex w-[142px] h-[40px] px-0 py-[10px] justify-center items-center rounded-1"
              >
                <span className="text-[#F97917] font-inter text-sm font-medium leading-5">OK</span>
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NavDialog;
