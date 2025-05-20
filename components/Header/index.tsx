'use client';

import NavTabs from './NavTabs';
import Logo from './Logo';
import Avatar from './Avatar';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-[56px] border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <Logo />
        <NavTabs />
        <Avatar />
      </div>
    </header>
  );
}
