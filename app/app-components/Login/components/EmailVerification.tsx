import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/api';

interface EmailVerificationProps {
  email?: string;
  onBackToLogin: () => void;
  onVerificationComplete?: () => void;
  onClose?: () => void;
  skipInitialSend?: boolean;
}

export const EmailVerification = ({
  email,
  onBackToLogin,
  onVerificationComplete,
  onClose,
  skipInitialSend = true
}: EmailVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const initialSendRef = useRef(false);

  useEffect(() => {
    if (!email || initialSendRef.current || skipInitialSend) return;

    const sendInitialVerificationCode = async () => {
      initialSendRef.current = true;
      setIsResending(true);

      try {
        const data = await auth.resendVerificationCode(email);

        if (data.code !== 0) {
          setErrorMessage(data.msg || 'Failed to send verification code. Please try again.');
        }
      } catch (error) {
        setErrorMessage('Failed to send verification code. Please try again.');
      } finally {
        setIsResending(false);
      }
    };

    sendInitialVerificationCode();
  }, [email, skipInitialSend]);

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setTimeout(() => {
      setResendCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleResendEmail = async () => {
    if (!email || resendCountdown > 0) return;

    setIsResending(true);
    setErrorMessage('');

    try {
      const data = await auth.resendVerificationCode(email);

      if (data.code !== 0) {
        setErrorMessage(data.msg || 'Failed to resend verification code. Please try again.');
      } else {
        setResendCountdown(60);
      }
    } catch (error) {
      setErrorMessage('Failed to resend verification code. Please try again.');
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
      const data = await auth.verifyEmail(verificationCode, email || '');

      if (data.code === 0) {
        if (onVerificationComplete) {
          onVerificationComplete();
        }
      } else {
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

  return (
    <>
      <p className="text-gray-500 text-sm mb-6">We sent a verification code to {email}. Please enter it below.</p>
      <div className="space-y-4 w-full">
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-error text-sm">{errorMessage}</p>
          </div>
        )}
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-sm font-medium text-[#121316]">
              Verification Code
            </label>
            <div className="relative">
              <Input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="123456"
                className="h-[52px] w-full px-4 py-3 border border-[#E4E4E7] rounded-md pr-24"
              />
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendCountdown > 0 || isResending}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-normal leading-[20px] font-inter ${
                  resendCountdown > 0 || isResending
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[rgba(249,121,23)] hover:text-[rgba(249,121,23,0.7)]'
                }`}
              >
                {isResending ? 'Sending...' : resendCountdown > 0 ? `Resend(${resendCountdown}s)` : 'Resend'}
              </button>
            </div>
          </div>

          <p className="text-sm text-[#666]">For demo purposes, use code: 123456</p>

          <Button
            type="submit"
            disabled={isVerifying || !verificationCode.trim()}
            className={`h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] ${
              !isVerifying && verificationCode.trim()
                ? 'bg-primary hover:bg-gradient-to-r hover:from-[#F9BE60] hover:to-primary hover:shadow-[0px_4px_4px_0px_rgba(252,182,61,0.25)]'
                : 'bg-[rgba(249,121,23,0.5)] cursor-not-allowed'
            } text-white font-medium leading-5 transition-all`}
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <div className="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.97066 1.35674C1.86145 3.16592 -0.0364277 6.50565 0.000530086 10.1027C0.0568573 15.585 4.51691 19.9997 9.99945 20C15.482 20.0003 19.9426 15.5861 19.9995 10.1038C20.0368 6.50674 18.1393 3.16679 15.0302 1.35728C11.9212 -0.452232 8.07987 -0.452441 4.97066 1.35674ZM2.6461 5.87626C4.16759 3.2633 6.97594 1.66968 9.99938 1.70355C14.6015 1.75512 18.3052 5.50029 18.3055 10.1027C18.3058 14.705 14.6026 18.4507 10.0005 18.5028C6.977 18.5371 4.16842 16.9438 2.64661 14.331C1.12479 11.7183 1.12462 8.48921 2.6461 5.87626Z"
                fill="#007AFF"
                fill-opacity="0.8"
              />
              <path
                d="M7.80029 8.7035C7.80029 8.26172 8.15844 7.90356 8.60023 7.90356H10.2C10.6418 7.90356 11 8.26172 11 8.7035V14.5024C11 14.9441 10.6418 15.3023 10.2 15.3023C9.75824 15.3023 9.40013 14.9441 9.40013 14.5024V9.50231H8.60023C8.15844 9.50231 7.80029 9.14419 7.80029 8.70241V8.7035Z"
                fill="#007AFF"
                fill-opacity="0.8"
              />
              <path
                d="M7.19971 14.7028C7.19971 14.261 7.55786 13.9028 7.99964 13.9028H12.3992C12.8409 13.9028 13.1991 14.261 13.1991 14.7028C13.1991 15.1445 12.8409 15.5027 12.3992 15.5027H7.99964C7.55786 15.5027 7.19971 15.1445 7.19971 14.7028Z"
                fill="#007AFF"
                fill-opacity="0.8"
              />
              <path
                d="M9.99947 4.20366C9.5263 4.1901 9.08314 4.43479 8.84255 4.84246C8.60196 5.25013 8.60196 5.75637 8.84255 6.16404C9.08314 6.57172 9.5263 6.81641 9.99947 6.80284C10.7027 6.7827 11.2624 6.20678 11.2624 5.50324C11.2624 4.7997 10.7027 4.22381 9.99947 4.20366Z"
                fill="#007AFF"
                fill-opacity="0.8"
              />
            </svg>
            <span className="text-[rgba(0,122,255,0.8)] font-inter text-xs font-medium leading-5">
              Can&apos;t find the email? Check your spam folder or try resending the code.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
