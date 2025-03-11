'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react'; // 引入 X 图标
import { create } from 'zustand';

// 创建一个状态管理 store
interface ErrorDialogStore {
  isOpen: boolean;
  message: string;
  openDialog: (message: string) => void;
  closeDialog: () => void;
}

export const useErrorDialogStore = create<ErrorDialogStore>(set => ({
  isOpen: false,
  message: '',
  openDialog: message => set({ isOpen: true, message }),
  closeDialog: () => set({ isOpen: false })
}));

export function ErrorDialog() {
  const { isOpen, message, closeDialog } = useErrorDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-center w-full">
            <span className="text-[#121316] text-center font-inter text-2xl font-semibold leading-8">Hint</span>
          </DialogTitle>
          <button
            onClick={closeDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">关闭</span>
          </button>
        </DialogHeader>
        <div className="text-center">
          <span className="text-black text-center font-inter text-[14px] font-normal leading-6">{message}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
