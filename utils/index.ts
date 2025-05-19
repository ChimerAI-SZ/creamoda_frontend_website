import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useErrorDialogStore } from '@/components/ErrorDialog';
import { Modal } from '@/utils/modal';

import { deleteImage as deleteImageApi } from '@/lib/api/generate';

export const showErrorDialog = (message: string) => {
  useErrorDialogStore.getState().openDialog(message);
};

export function downloadImage(url: string, filename: string) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      const blobUrl = URL.createObjectURL(blob);
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    })
    .catch(error => console.error('Error downloading image:', error));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deleteImage(imageId: number, onSuccess: () => void) {
  Modal.confirm(
    'Are you sure you want to delete this image?',
    async () => {
      const res = await deleteImageApi(imageId);
      console.log(res);

      if (res.code === 0) {
        onSuccess();
      } else {
        Modal.error('Delete failed');
      }
    },
    () => {}
  );
}
