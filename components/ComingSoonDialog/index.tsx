import React, { ReactNode } from 'react';
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

interface NavDialogProps {
  trigger: ReactNode;
}

const NavDialog: React.FC<NavDialogProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[360px] h-[168px] p-[24px] pb-[16px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Coming Soon</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center justify-center text-[#121316] text-center font-inter text-base font-medium leading-[32px]">
              We are creating
              <br />
              something amazing ! 🎉
            </div>
            <div className="flex justify-center mt-[16px]">
              <DialogClose
                className={cn(
                  'rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
                  'focus-visible:outline-none focus-visible:ring-0'
                )}
              >
                <Button
                  variant="outline"
                  className="flex w-[142px] h-[40px] px-0 py-[10px] justify-center items-center rounded-1"
                >
                  <span className="text-[#F97917] font-inter text-sm font-medium leading-5">OK</span>
                </Button>
              </DialogClose>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NavDialog;
