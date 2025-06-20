// components/dialog/GlobalConfirm.tsx
'use client';

import { useDialogStore } from '@/stores/useDialogStore';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

export const GlobalConfirm = () => {
  const { open, title, content, icon, close, cancelText, confirmText, onConfirm, onCancel } = useDialogStore();

  return (
    <Dialog open={open} onOpenChange={v => !v && close()}>
      <DialogContent className="w-[360px] p-6 rounded-xl text-center gap-0 z-[9999]">
        {icon && (
          <div className="mx-auto mb-[20px] h-[40px] w-[40px] rounded-full flex items-center justify-center">
            {icon}
          </div>
        )}
        <h2 className="text-lg font-bold text-[#181D27]">{title}</h2>
        {content && <p className="text-[#535862] text-sm font-normal mt-2">{content}</p>}
        <div className={cn('flex justify-center gap-3 mt-8')}>
          <Button
            onClick={() => {
              onCancel?.();
              close();
            }}
            variant="primarySecondary"
            className="flex-1"
          >
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              onClick={() => {
                onConfirm?.();
                close();
              }}
              variant="primary"
              className="flex-1"
            >
              {confirmText}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
