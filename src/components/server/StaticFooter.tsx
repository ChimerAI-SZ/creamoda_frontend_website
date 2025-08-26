import Image from 'next/image';
import Link from 'next/link';

export default function StaticFooter() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Left section */}
        <div className="footer-left">
          {/* Logo */}
          <div className="footer-logo">
            <Image
              src="/marketing/images/bottom_logo.png"
              alt="CREAMODA"
              width={200}
              height={60}
              style={{ objectFit: 'contain' }}
            />
          </div>
          
          {/* Description */}
          <p className="footer-description">
            CREAMODA is an AI-powered clothing design and supply chain platform, offering a comprehensive end-to-end service for independent fashion brands and retailers, from design to wholesale.
          </p>
          
          {/* Social icons */}
          <div className="footer-social">
            <a 
              href="https://youtube.com/@chimer-ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-button"
            >
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                <path d="M21.67 2.369C21.505 1.742 21.024 1.261 20.397 1.096C18.646 0.625 11.5 0.625 11.5 0.625C11.5 0.625 4.354 0.625 2.603 1.096C1.976 1.261 1.495 1.742 1.33 2.369C0.859 4.12 0.859 7.75 0.859 7.75C0.859 7.75 0.859 11.38 1.33 13.131C1.495 13.758 1.976 14.239 2.603 14.404C4.354 14.875 11.5 14.875 11.5 14.875C11.5 14.875 18.646 14.875 20.397 14.404C21.024 14.239 21.505 13.758 21.67 13.131C22.141 11.38 22.141 7.75 22.141 7.75C22.141 7.75 22.141 4.12 21.67 2.369ZM9.167 11.083V4.417L15.083 7.75L9.167 11.083Z" fill="currentColor"/>
              </svg>
            </a>

            <a 
              href="https://www.instagram.com/creamoda.ai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-button"
            >
              <svg width="23" height="22" viewBox="0 0 23 22" fill="none">
                <path d="M11.25 5.5C8.487 5.5 6.25 7.737 6.25 10.5C6.25 13.263 8.487 15.5 11.25 15.5C14.013 15.5 16.25 13.263 16.25 10.5C16.25 7.737 14.013 5.5 11.25 5.5ZM11.25 13.667C9.498 13.667 8.083 12.252 8.083 10.5C8.083 8.748 9.498 7.333 11.25 7.333C13.002 7.333 14.417 8.748 14.417 10.5C14.417 12.252 13.002 13.667 11.25 13.667ZM18.542 5.292C18.542 6.042 17.958 6.625 17.208 6.625C16.458 6.625 15.875 6.042 15.875 5.292C15.875 4.542 16.458 3.958 17.208 3.958C17.958 3.958 18.542 4.542 18.542 5.292ZM22.417 6.625C22.333 5.042 21.958 3.625 20.792 2.458C19.625 1.292 18.208 0.917 16.625 0.833C15 0.75 7.5 0.75 5.875 0.833C4.292 0.917 2.875 1.292 1.708 2.458C0.542 3.625 0.167 5.042 0.083 6.625C0 8.25 0 15.75 0.083 17.375C0.167 18.958 0.542 20.375 1.708 21.542C2.875 22.708 4.292 23.083 5.875 23.167C7.5 23.25 15 23.25 16.625 23.167C18.208 23.083 19.625 22.708 20.792 21.542C21.958 20.375 22.333 18.958 22.417 17.375C22.5 15.75 22.5 8.25 22.417 6.625ZM20 19.042C19.667 19.958 18.958 20.667 18.042 21C16.708 21.542 13.125 21.375 11.25 21.375C9.375 21.375 5.792 21.542 4.458 21C3.542 20.667 2.833 19.958 2.5 19.042C1.958 17.708 2.125 14.125 2.125 12.25C2.125 10.375 1.958 6.792 2.5 5.458C2.833 4.542 3.542 3.833 4.458 3.5C5.792 2.958 9.375 3.125 11.25 3.125C13.125 3.125 16.708 2.958 18.042 3.5C18.958 3.833 19.667 4.542 20 5.458C20.542 6.792 20.375 10.375 20.375 12.25C20.375 14.125 20.542 17.708 20 19.042Z" fill="currentColor"/>
              </svg>
            </a>

            <a 
              href="https://x.com/ai_creamoda" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
              </svg>
            </a>
            
            <a 
              href="https://www.tiktok.com/@creamoda.ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Right section */}
        <div className="footer-right">
          {/* AI Features Section */}
          <div className="footer-ai-features">
            <h3 className="footer-section-title">AI Features</h3>
            <div className="footer-features">
              <div className="feature-group">
                <Link href="/outfit-generator" className="feature-item">Text to Image</Link>
                <a href="https://create.creamoda.ai/" className="feature-item">Copy Style</a>
                <a href="https://create.creamoda.ai/" className="feature-item">Mix 2 Images</a>
                <a href="https://create.creamoda.ai/" className="feature-item">Change Clothes</a>
                <a href="https://create.creamoda.ai/" className="feature-item">Fabric to Design</a>
                <Link href="/sketch-to-image" className="feature-item">Sketch to Design</Link>
              </div>
              
              <div className="feature-group">
                <a href="https://create.creamoda.ai/" className="feature-item">Change Style</a>
                <a href="https://create.creamoda.ai/" className="feature-item">Change Fabric</a>
                <a href="https://create.creamoda.ai/" className="feature-item">Change Printing</a>
                <a href="https://create.creamoda.ai/" className="feature-item">Style Fusion</a>
              </div>
              
              <div className="feature-group">
                <Link href="/virtual-try-on" className="feature-item">Virtual Try-on</Link>
                <a href="https://create.creamoda.ai/virtual-try-on" className="feature-item">Change Pose</a>
              </div>

              <div className="feature-group">
                <Link href="/image-color-changer" className="feature-item">Change Color</Link>
                <Link href="/image-background-changer" className="feature-item">Change Background</Link>
                <Link href="/image-background-remover" className="feature-item">Remove Background</Link>
                <Link href="/image-changer" className="feature-item">Partial Modification</Link>
                <Link href="/image-enhancer" className="feature-item">Upscale</Link>
                <a href="https://create.creamoda.ai/magic-kit" className="feature-item">Pattern Extraction</a>
                <a href="https://create.creamoda.ai/magic-kit" className="feature-item">Pattern Application</a>
              </div>
            </div>
          </div>
          
          {/* Other Links Section */}
          <div className="footer-other-links">
            {/* Contact Us Column */}
            <div className="footer-column">
              <h3 className="footer-section-title">Contact Us</h3>
              <div className="footer-links">
                <a href="mailto:contact@creamoda.ai" className="footer-link">contact@creamoda.ai</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="footer-copyright">
        <p>©2025 CHIMER AI PTE.LTD</p>
      </div>
    </footer>
  );
}
