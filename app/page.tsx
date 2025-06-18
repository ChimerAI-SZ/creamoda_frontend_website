'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ImageGrid } from '../components/ImageGrid/index';

import { Album as AlbumDrawer } from '@/components/Album';
import { useAlertStore } from '@/stores/useAlertStore';

export default function Page() {
  const { showAlert } = useAlertStore();

  // useEffect(() => {
  //   // console.log('Page');
  //   showAlert({
  //     type: 'error',
  //     content: 'Something went wrong. Please try again later or contact support if the issue persists'
  //   });
  // }, []);

  return (
    <div className="flex p-6 pt-[30px] z-0">
      <Sidebar />
      <main className="flex-1 pl-6 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
