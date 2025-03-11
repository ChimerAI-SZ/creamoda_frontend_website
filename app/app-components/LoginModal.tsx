'use client';

import { useState } from 'react';
import Image from 'next/image';
import x from '@/images/login/x.svg';
import { LoginForm } from './Login/LoginForm';
import { SignUpForm } from './Login/SignUpForm';
import { EmailVerification } from './Login/EmailVerification';
import { GoogleLoginButton } from './Login/GoogleLoginButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define possible modal view states
type ModalView = 'login' | 'signup' | 'email-verification';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [currentView, setCurrentView] = useState<ModalView>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [googleLoginError, setGoogleLoginError] = useState('');

  if (!isOpen) return null;

  const handleToggleView = (view: ModalView) => {
    setCurrentView(view);
    // Clear previous errors
    setGoogleLoginError('');
  };

  const handleSignupSuccess = (email: string) => {
    setVerificationEmail(email);
    setCurrentView('email-verification');
  };

  const handleGoogleLoginSuccess = () => {
    // Close modal after successful login
    onClose();
    // Optional: redirect to homepage or dashboard
    // window.location.href = '/dashboard';
  };

  const handleGoogleLoginError = (error: string) => {
    setGoogleLoginError(error);
  };

  // Determine title based on current view
  const getTitle = () => {
    switch (currentView) {
      case 'login':
        return 'Login';
      case 'signup':
        return 'Create an account';
      case 'email-verification':
        return 'Check your email';
      default:
        return 'Login';
    }
  };

  // Get subtitle based on current view
  const getSubtitle = () => {
    switch (currentView) {
      case 'login':
        return 'Enter your credentials to access your account';
      case 'signup':
        return 'Enter your information to create an account';
      case 'email-verification':
        return '';
      default:
        return '';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]"
      style={{ isolation: 'isolate' }}
    >
      <div className="bg-white rounded-lg p-6 w-[480px] flex flex-col items-start relative z-[100000]">
        <div className="w-full flex justify-between items-center relative mb-2">
          <h1 className="text-2xl font-semibold text-[#121316] font-inter">{getTitle()}</h1>
          <Image src={x.src} alt="Close" width={24} height={24} className="cursor-pointer" onClick={onClose} />
        </div>

        {getSubtitle() && <p className="text-gray-500 text-sm mb-6">{getSubtitle()}</p>}

        {currentView === 'email-verification' ? (
          <EmailVerification
            email={verificationEmail}
            onBackToLogin={() => handleToggleView('login')}
            onClose={onClose}
          />
        ) : (
          <div className="space-y-6 w-full">
            {googleLoginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-[#E50000] text-sm font-inter">{googleLoginError}</p>
              </div>
            )}

            {currentView === 'login' ? (
              <LoginForm onToggleView={() => handleToggleView('signup')} onSuccess={handleGoogleLoginSuccess} />
            ) : (
              <SignUpForm onToggleView={() => handleToggleView('login')} onSignupSuccess={handleSignupSuccess} />
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-inter">OR CONTINUE WITH</span>
              </div>
            </div>

            <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />

            <div className="text-center mt-4">
              {currentView === 'login' ? (
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <span
                    className="text-black font-medium cursor-pointer hover:underline"
                    onClick={() => handleToggleView('signup')}
                  >
                    Sign up here
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <span
                    className="text-black font-medium cursor-pointer hover:underline"
                    onClick={() => handleToggleView('login')}
                  >
                    Log in here
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
