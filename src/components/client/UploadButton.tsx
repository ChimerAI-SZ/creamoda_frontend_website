'use client';

import { useState } from 'react';
import Image from 'next/image';
import UploadUrlDialog from './UploadUrlDialog';

interface UploadButtonProps {
  uploadText: string;
  saasUrl: string;
  tab?: string;
  variationType?: string;
}

export default function UploadButton({ uploadText, saasUrl, tab, variationType }: UploadButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="upload-demo-btn w-full"
        style={{
          padding: '18px 32px',
          fontSize: '20px',
          fontWeight: '600',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          minWidth: '200px',
          marginTop: '-15px',
          border: 'none',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <Image
          src="/marketing/images/upload.svg"
          alt="Upload icon"
          width={28}
          height={28}
          className="upload-icon"
        />
        {uploadText}
      </button>

      <UploadUrlDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        saasUrl={saasUrl}
        tab={tab}
        variationType={variationType}
      />
    </>
  );
}

