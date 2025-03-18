import { useErrorDialogStore } from '@/components/ErrorDialog';

export const showErrorDialog = (message: string) => {
  useErrorDialogStore.getState().openDialog(message);
};
