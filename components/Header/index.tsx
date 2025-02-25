'use client';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import Logo from './components/Logo';
import Avatar from './components/Avatar';

const inter = Inter({ subsets: ['latin'] });

function Popup({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p>{message}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-[#FF7B0D] text-white rounded hover:bg-[#FF7B0D]/80">
          Close
        </button>
      </div>
    </div>
  );
}

export function Header() {
  const [popup, setPopup] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setPopup(`${tag} is not available yet`);
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-6">
          <span className="text-[#FF7B0D] font-semibold text-sm text-center cursor-default">Design</span>
          <span className="text-[#999999] font-semibold text-sm text-center cursor-pointer hover:text-[#FF7B0D]" onClick={() => handleTagClick('Production')}>
            Production
          </span>
          <span className="text-[#999999] font-semibold text-sm text-center cursor-pointer hover:text-[#FF7B0D]" onClick={() => handleTagClick('Online shop')}>
            Online shop
          </span>
        </nav>
        <Avatar />
      </div>
      {popup && <Popup message={popup} onClose={() => setPopup(null)} />}
    </header>
  );
}
