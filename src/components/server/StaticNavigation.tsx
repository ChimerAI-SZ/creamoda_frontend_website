import Image from 'next/image';
import Link from 'next/link';
import DynamicCreateButton from '../client/DynamicCreateButton';
import MobileMenuToggle from '../client/MobileMenuToggle';


interface StaticNavigationProps {
  currentSaasUrl?: string;
}

export default function StaticNavigation({ currentSaasUrl }: StaticNavigationProps) {
  return (
    <>
      <nav className="hero-nav">
        {/* Desktop Navigation */}
        <div className="hidden md:contents">
          <Link href="/" className="hero-logo">
            <Image
              src="/marketing/images/logo/Union.svg"
              alt="CREAMODA"
              width={140}
              height={45}
              className="logo-image logo-default"
            />
            <Image
              src="/marketing/images/logo/Union.svg"
              alt="CREAMODA"
              width={140}
              height={45}
              className="logo-image logo-light"
            />
          </Link>
          
          <div className="hero-nav-links">
            {/* Design Tools 静态导航 */}
            <div className="nav-dropdown">
              <button className="nav-link tools-link" style={{ color: 'white' }}>
                Design Tools
                <svg 
                  className="dropdown-arrow"
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none"
                  style={{ color: 'white' }}
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Fashion Agent 静态导航 - 直接跳转 */}
            <Link href="/fashion-agent" className="nav-link" style={{ color: 'white' }}>
              Fashion Agent
            </Link>

            {/* Design Ideas 静态导航 */}
            <Link href="/designs" className="nav-link" style={{ color: 'white' }}>
              Design Ideas
            </Link>

            {/* Pricing 静态导航 - 直接跳转 */}
            {/* <Link href="/pricing" className="nav-link" style={{ color: 'white' }}>
              Pricing
            </Link> */}
          </div>
          
          {/* 如果有传入的URL就使用传入的，否则使用动态Create按钮 */}
          {currentSaasUrl ? (
            <a 
              href={currentSaasUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              Get Started
            </a>
          ) : (
            <DynamicCreateButton />
          )}
        </div>

        {/* Mobile Navigation */}

        <div className="md:hidden flex items-center justify-between w-full px-4">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/marketing/images/logo/Union.svg"
              alt="CHIMERI AI"
              width={50}
              height={16}
              className="h-4 w-auto"
            />
          </Link>
          
          {/* Mobile Menu Toggle */}
          <MobileMenuToggle />
        </div>
      </nav>

      {/* Static Mobile Menu Content for SEO */}
      <div className="md:hidden hidden">
        <div className="mobile-menu-content">
          <h3>Design Tools</h3>
          <Link href="#">AI Sketch to Image Converter</Link>
          <Link href="#">AI outfit generator</Link>
          <Link href="#">Virtual Try-on</Link>
          <Link href="#">Image Background Remover</Link>
          <Link href="#">Image Background Changer</Link>
          <Link href="#">Image Enhancer</Link>
          <Link href="#">AI Image Changer</Link>
          <Link href="#">Image Color Changer</Link>
          
          <Link href="/fashion-agent">Fashion Agent</Link>
          
          <Link href="/designs">Design Ideas</Link>
          
          {/* <h3>Pricing</h3>
          <Link href="/pricing">View Plans</Link> */}
        </div>
      </div>
    </>
  );
}
