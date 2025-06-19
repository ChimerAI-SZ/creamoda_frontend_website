'use client';

import NavTabs from './NavTabs';
import Logo from './Logo';
import Avatar from './Avatar';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full h-[56px] bg-transparent">
      <div className="flex h-full items-center justify-between px-6">
        <Logo />
        <NavTabs />
        <Avatar />
      </div>
    </header>
  );
}
