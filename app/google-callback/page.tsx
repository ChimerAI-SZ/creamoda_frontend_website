'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function GoogleCallback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing Google login...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (!window.opener) {
      setStatus('Error: Unable to communicate with the main window. Please close this window and try again.');
      return;
    }

    const processCallback = async () => {
      try {
        if (code) {
          // 后端已经处理了回调，这里只需通知父窗口登录成功
          window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS' }, window.location.origin);
          setStatus('Login successful! You can close this window now.');
        } else if (error) {
          // 向父窗口发送错误消息
          window.opener.postMessage({ type: 'GOOGLE_LOGIN_ERROR', error }, window.location.origin);
          setStatus('Login failed. You can close this window now.');
        } else {
          setStatus('No authentication data received. You can close this window now.');
        }

        // 3秒后自动关闭窗口
        setTimeout(() => {
          window.close();
        }, 3000);
      } catch (err) {
        console.error('Error in callback processing:', err);
        setStatus('An error occurred. Please close this window and try again.');
      }
    };

    processCallback();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-4">
        {status.includes('successful') ? (
          <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : status.includes('failed') || status.includes('Error') ? (
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="w-16 h-16 border-4 border-gray-300 border-t-[#F97917] rounded-full animate-spin mx-auto"></div>
        )}
      </div>
      <p className="text-lg">{status}</p>
    </div>
  );
}
