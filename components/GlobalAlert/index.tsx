'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { useAlertStore } from '@/stores/useAlertStore';

const GlobalAlert: React.FC = () => {
  const { isOpen, type, message, onConfirm, onCancel, closeAlert } = useAlertStore();

  const getTitle = () => {
    switch (type) {
      case 'error':
        return 'Error';
      case 'confirm':
        return 'Confirm';
      case 'info':
        return 'Information';
      default:
        return '';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeAlert}>
      <AlertDialogContent className="w-[400px]">
        <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
        <AlertDialogDescription>{message}</AlertDialogDescription>
        {type === 'confirm' ? (
          <div className="flex items-center justify-center gap-8">
            <AlertDialogCancel
              onClick={() => {
                onCancel();
                closeAlert();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onConfirm();
                closeAlert();
              }}
            >
              Confirm
            </AlertDialogAction>
          </div>
        ) : (
          <AlertDialogAction onClick={closeAlert}>OK</AlertDialogAction>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GlobalAlert;
