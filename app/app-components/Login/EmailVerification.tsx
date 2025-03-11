import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { GoogleLoginButton } from './GoogleLoginButton';
import { Input } from '@/components/ui/input';

interface EmailVerificationProps {
  email?: string;
  onBackToLogin: () => void;
  onVerificationComplete?: () => void;
  onClose?: () => void;
}

export const EmailVerification = ({
  email,
  onBackToLogin,
  onVerificationComplete,
  onClose
}: EmailVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [googleLoginError, setGoogleLoginError] = useState('');

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setErrorMessage('');

    try {
      // API call to resend verification email
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/email/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.code !== 0) {
        setErrorMessage(data.msg || 'Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setErrorMessage('Please enter the verification code');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      // Call the verification API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/email/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verifyCode: verificationCode })
      });

      const data = await response.json();

      if (data.code === 0) {
        // Verification successful
        if (onVerificationComplete) {
          onVerificationComplete();
        }

        // Close the modal after successful verification
        if (onClose) {
          onClose();
        }
      } else {
        // Verification failed
        setErrorMessage(data.msg || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleGoogleLoginSuccess = () => {
    // Close the modal after successful Google login
    if (onClose) {
      onClose();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-[#F97917]/10 rounded-full flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
              stroke="#F97917"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M22 6L12 13L2 6" stroke="#F97917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-center text-[#121316] font-inter">Enter the verification code</h2>
        <p className="text-sm text-center text-[#666] font-inter">
          Please enter the verification code received in your email to prove that the email address belongs to you
        </p>
      </div>

      {(errorMessage || googleLoginError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-[#E50000] text-sm font-inter">{errorMessage || googleLoginError}</p>
        </div>
      )}

      <form onSubmit={handleVerifyCode} className="space-y-4">
        {email && (
          <div className="w-full">
            <Input
              type="text"
              value={email}
              disabled
              className="h-[52px] w-full px-4 py-3 border border-[#E4E4E7] rounded-md bg-gray-50 text-gray-500"
            />
            <button type="button" onClick={handleResendEmail} className="text-[#F97917] text-sm mt-2 hover:underline">
              Send email again
            </button>
          </div>
        )}

        <Input
          type="text"
          value={verificationCode}
          onChange={handleCodeChange}
          placeholder="Enter verification code"
          className="h-[52px] w-full px-4 py-3 border border-[#E4E4E7] rounded-md"
        />

        <Button
          type="submit"
          disabled={isVerifying || !verificationCode.trim()}
          className={`h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] ${
            !isVerifying && verificationCode.trim()
              ? 'bg-[#F97917] hover:bg-[#F97917]/90'
              : 'bg-[rgba(249,121,23,0.5)] cursor-not-allowed'
          } text-white font-inter text-sm font-medium leading-5`}
        >
          {isVerifying ? 'Verifying...' : 'Next'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#666]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-[#666] font-inter text-sm font-medium leading-5">OR</span>
        </div>
      </div>

      <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} onError={error => setGoogleLoginError(error)} />

      <div className="text-center">
        <Button
          type="button"
          onClick={onBackToLogin}
          variant="outline"
          className="h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] border border-[#E4E4E7] text-[#121316] font-inter text-sm font-medium leading-5"
        >
          Update contact details
        </Button>
      </div>
    </div>
  );
};
