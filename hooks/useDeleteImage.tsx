import { TriangleAlert } from 'lucide-react';

import { useDialogStore } from '@/stores/useDialogStore';
import { deleteImage as deleteImageApi } from '@/lib/api';

export function useDeleteImage() {
  const { showConfirm } = useDialogStore();

  return (imageId: number, onSuccess: () => void) => {
    showConfirm({
      icon: (
        <div className="w-full h-full rounded-full bg-[#f9f5ff] flex items-center justify-center">
          <TriangleAlert color="#ff3c2e" className="w-full h-full" />
        </div>
      ),
      title: 'Confirm deletion',
      content: 'Are you sure you want to delete this image? This action cannot be undone.',
      onConfirm: async () => {
        const res = await deleteImageApi(imageId);
        console.log(res);
        if (res.code === 0) {
          onSuccess();
        } else {
          // Modal.error('Delete failed');
        }
      }
    });
  };
}
