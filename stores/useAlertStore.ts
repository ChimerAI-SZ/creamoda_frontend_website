import { create } from 'zustand';
import { ReactNode } from 'react';

export type AlertType = 'success' | 'warning' | 'error' | 'custom';

export interface AlertState {
  open: boolean;
  type: AlertType;
  content: string;
  title?: string;
  icon?: ReactNode;
}

interface AlertStore extends AlertState {
  showAlert: (params: AlertParams) => void;
  close: () => void;
}

type AlertParams = {
  type: AlertType;
  content: string;
  title?: string;
  icon?: ReactNode;
};

export const useAlertStore = create<AlertStore>(set => ({
  open: false,
  type: 'success',
  content: '',
  title: '',
  icon: undefined,
  showAlert: ({ type, content, title = '', icon }) => {
    console.log('alert visble');
    set({ open: true, type, content, title, icon });
  },
  close: () => set({ open: false })
}));
