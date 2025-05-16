import { useErrorDialogStore } from '@/components/ErrorDialog';

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
