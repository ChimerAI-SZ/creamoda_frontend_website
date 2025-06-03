import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils';

// 定义导航项类型
type NavItem = {
  text: string;
  href?: string;
};

// 将导航项抽取为配置数组
const navItems: NavItem[] = [
  { text: 'Design', href: '/' },
  { text: 'Virtual Try-on', href: '/virtual-try-on' },
  { text: 'Magic Kit', href: '/magic-kit' }
];

function NavItem({ text, href }: NavItem) {
  const pathname = usePathname();
  const isActive = href && pathname === href;

  const navLinkClasses = cn(
    'text-[rgba(10,21,50,0.40)] font-inter text-[14px] leading-[20px] relative',
    'text-center cursor-pointer transition-colors',
    'inline-block py-[5px] px-[6px]',
    {
      'text-[#0A1532] font-bold': isActive,
      'hover:text-[#0A1532]': !isActive,
      'after:content-[""] after:absolute after:bottom-0 after:left-[50%] after:translate-x-[-50%] after:w-[44px] after:h-[2px] after:bg-[#0A1532]':
        isActive
    }
  );

  const content = <span className={navLinkClasses}>{text}</span>;

  return href ? (
    <Link href={href} className={navLinkClasses}>
      {text}
    </Link>
  ) : (
    content
  );
}

export default function NavTabs() {
  return (
    <nav className="flex items-center gap-[28px]">
      {navItems.map(item => (
        <NavItem key={item.text} {...item} />
      ))}
    </nav>
  );
}
