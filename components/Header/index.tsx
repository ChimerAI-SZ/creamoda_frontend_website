'use client';
import Logo from './components/Logo';
import Avatar from './components/Avatar';
import ComingSoonDialog from '@/components/ComingSoonDialog';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-6">
          <span className="text-[#FF7B0D] font-semibold text-sm text-center cursor-default">Design</span>
          {['Production', 'Online shop'].map(text => (
            <ComingSoonDialog
              key={text}
              trigger={
                <span className="text-[#999999] font-semibold text-sm text-center cursor-pointer hover:text-[#FF7B0D] transition-colors">
                  {text}
                </span>
              }
            />
          ))}
        </nav>
        <Avatar />
      </div>
    </header>
  );
}
