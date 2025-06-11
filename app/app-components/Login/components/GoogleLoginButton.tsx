import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getGoogleAuthUrl, saveAuthToken } from '@/lib/api';

import google from '@/images/login/google.svg';

interface GoogleLoginButtonProps {
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export const GoogleLoginButton = ({ onError, onSuccess }: GoogleLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Get Google authorization URL from backend
      const googleAuthUrl = await getGoogleAuthUrl();
      console.log('Opening Google login with URL:', googleAuthUrl);

      // Open a new window for Google login
      const googleLoginWindow = window.open(googleAuthUrl, 'Google Login', 'width=500,height=600,left=0,top=0');

      if (!googleLoginWindow) {
        throw new Error('Failed to open Google login window. Please check your popup blocker settings.');
      }

      // Listen for messages from the popup window
      const messageHandler = async (event: MessageEvent) => {
        // Ensure the message is from a trusted source
        if (event.origin !== window.location.origin) return;

        if (event.data && event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
          // Remove event listener to prevent memory leaks
          window.removeEventListener('message', messageHandler);

          // Close Google login window if still open
          if (googleLoginWindow && !googleLoginWindow.closed) {
            googleLoginWindow.close();
          }

          console.log('Google login successful');

          // Save the token received from the callback
          if (event.data.token) {
            saveAuthToken(event.data.token);
          }

          // Call success callback
          if (onSuccess) onSuccess();
          setIsLoading(false);

          // Refresh the page or redirect as needed
          router.refresh();
        } else if (event.data && event.data.type === 'GOOGLE_LOGIN_ERROR') {
          // Remove event listener
          window.removeEventListener('message', messageHandler);

          // Handle error
          const errorMsg = event.data.error || 'Google login was cancelled or failed';
          console.error('Google login error:', errorMsg);
          if (onError) onError(errorMsg);
          setIsLoading(false);
        }
      };

      window.addEventListener('message', messageHandler);

      // Set timeout in case user doesn't complete login flow
      setTimeout(() => {
        // Check if window is still open
        if (googleLoginWindow && !googleLoginWindow.closed) {
          // Remove event listener
          window.removeEventListener('message', messageHandler);
          setIsLoading(false);
          if (onError) onError('Login timeout. Please try again.');
        }
      }, 120000); // 2 minute timeout
    } catch (error) {
      console.error('Google login error:', error);
      if (error instanceof Error) {
        // Show detailed error message
        const errorMessage = `Google login failed: ${error.message}`;
        console.error(errorMessage);
        if (onError) onError(errorMessage);
      } else {
        if (onError) onError('Failed to initiate Google login');
      }
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="primarySecondary"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="h-[44px] w-full flex items-center justify-center gap-[6px] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
      ) : (
        <Image src={google.src} alt="Google Logo" width={20} height={20} className="cursor-pointer" />
      )}
      <span className="text-sm font-medium text-[#121316] font-inter">
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </span>
    </Button>
  );
};
