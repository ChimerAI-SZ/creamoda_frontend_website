'use client';
import Logo from './components/Logo';
import Avatar from './components/Avatar';
import ComingSoonDialog from '@/components/ComingSoonDialog';

// 定义导航项类型
type NavItem = {
  text: string;
  href?: string;
  isComingSoon?: boolean;
};

export function Header() {
  // 将导航项抽取为配置数组
  const navItems: NavItem[] = [
    { text: 'Design', href: '/design' },
    { text: 'Production', isComingSoon: true },
    { text: 'Online shop', isComingSoon: true }
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[56px] border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <Logo />

        <nav className="flex items-center gap-[28px]">
          {navItems.map(item => (
            <NavItem key={item.text} {...item} />
          ))}
        </nav>

        <Avatar />
      </div>
    </header>
  );
}

// 抽取导航项为独立组件
function NavItem({ text, href, isComingSoon }: NavItem) {
  const navLinkClasses =
    'text-[#999] font-inter text-[14px] font-semibold leading-[20px] text-center cursor-pointer hover:text-[#FF7B0D] transition-colors inline-block py-[6px] px-[10px]';

  const content = <span className={navLinkClasses}>{text}</span>;

  if (isComingSoon) {
    return <ComingSoonDialog trigger={content} />;
  }

  return href ? (
    <a href={href} className={navLinkClasses}>
      {text}
    </a>
  ) : (
    content
  );
}
