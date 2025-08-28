import Image from 'next/image';
import Link from 'next/link';

interface StaticNavigationProps {
  currentSaasUrl?: string;
}

export default function StaticNavigation({ currentSaasUrl = 'https://www.creamoda.ai/fashion-design/create' }: StaticNavigationProps) {
  return (
    <nav className="hero-nav">
      <Link href="/" className="hero-logo">
        <Image
          src="/marketing/images/logo.png"
          alt="CREAMODA"
          width={140}
          height={45}
          className="logo-image logo-default"
        />
        <Image
          src="/marketing/images/logo_light.png"
          alt="CREAMODA"
          width={140}
          height={45}
          className="logo-image logo-light"
        />
      </Link>
      
      <div className="hero-nav-links">
        {/* Fashion Design 静态导航 */}
        <div className="nav-dropdown">
          <button className="nav-link tools-link">
            Fashion Design
            <svg 
              className="dropdown-arrow"
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none"
            >
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Virtual Try-on 静态导航 */}
        <div className="nav-dropdown">
          <button className="nav-link tools-link">
            Virtual Try-on
            <svg 
              className="dropdown-arrow"
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none"
            >
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Magic Kit 静态导航 */}
        <div className="nav-dropdown">
          <button className="nav-link tools-link">
            Magic Kit
            <svg 
              className="dropdown-arrow"
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none"
            >
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <a 
        href={currentSaasUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="create-btn"
      >
        Create
      </a>
    </nav>
  );
}
