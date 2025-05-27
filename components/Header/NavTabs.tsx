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
    'text-[#999] font-inter text-[14px] font-semibold leading-[20px]',
    'text-center cursor-pointer transition-colors',
    'inline-block py-[6px] px-[10px]',
    {
      'text-primary': isActive,
      'hover:text-primary': !isActive
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
