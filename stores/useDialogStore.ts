// stores/dialogStore.ts
import { create } from 'zustand';
import { ReactNode } from 'react';

interface ConfirmDialogOptions {
  title: string;
  content?: ReactNode;
  icon?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogState extends ConfirmDialogOptions {
  open: boolean;
  showConfirm: (options: ConfirmDialogOptions) => void;
  close: () => void;
}

export const useDialogStore = create<DialogState>(set => ({
  open: false,
  title: '',
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  onConfirm: () => {},
  onCancel: () => {},
  showConfirm: options => {
    set({ ...options, open: true });
  },
  close: () => set({ open: false })
}));
