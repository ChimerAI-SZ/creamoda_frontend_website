import { create } from 'zustand';

type AlertType = 'error' | 'confirm' | 'info';

interface AlertState {
  isOpen: boolean;
  type: AlertType;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  openAlert: (type: AlertType, message: string, onConfirm?: () => void, onCancel?: () => void) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>(set => ({
  isOpen: false,
  type: 'info',
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
  openAlert: (type, message, onConfirm, onCancel) => set({ isOpen: true, type, message, onConfirm, onCancel }),
  closeAlert: () => set({ isOpen: false, message: '' })
}));
