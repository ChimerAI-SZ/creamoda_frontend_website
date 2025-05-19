import { useAlertStore } from '@/stores/useAlertStore';

export const Modal = {
  error: (message: string) => useAlertStore.getState().openAlert('error', message),
  info: (message: string) => useAlertStore.getState().openAlert('info', message),
  confirm: (message: string, onConfirm?: () => void, onCancel?: () => void) =>
    useAlertStore.getState().openAlert('confirm', message, onConfirm, onCancel)
};
