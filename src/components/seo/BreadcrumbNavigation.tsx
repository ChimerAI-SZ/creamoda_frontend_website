import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  url: string;
  isActive?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbNavigation({ items, className = '' }: BreadcrumbNavigationProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      className={`breadcrumb-navigation ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index > 0 && (
              <svg 
                className="breadcrumb-separator" 
                width="14" 
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            )}
            {item.isActive || index === items.length - 1 ? (
              <span 
                className="breadcrumb-current"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.url}
                className="breadcrumb-link"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
