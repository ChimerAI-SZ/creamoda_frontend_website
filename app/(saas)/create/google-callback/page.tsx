'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getGoogleCallback, saveAuthToken } from '@/lib/api';

// Add dynamic import to disable pre-rendering
export const dynamic = 'force-dynamic';
// Specify runtime as edge only
export const runtime = 'edge';

// 包裹 useSearchParams 的组件
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('No authorization code received from Google');
        }
        // Exchange the code for a token
        const response = await getGoogleCallback(code);

        // Check if we have a token in the response
        // The backend returns token as 'authorization' in the data object
        if (response.data && response.data.authorization) {
          // Save the token
          saveAuthToken(response.data.authorization);

          // Send success message to parent window
          if (window.opener) {
            window.opener.postMessage(
              { type: 'GOOGLE_LOGIN_SUCCESS', token: response.data.authorization },
              window.location.origin
            );
          }

          // Close this window if it was opened by another window
          if (window.opener) {
            // window.close();
          } else {
            // If opened directly, redirect to home
            router.push('/fashion-design/create');
          }
        } else {
          throw new Error('No token received from server');
        }
      } catch (error) {
        console.error('Google callback error:', error);

        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_LOGIN_ERROR',
              error: error instanceof Error ? error.message : 'Failed to complete Google login'
            },
            window.location.origin
          );
          // window.close();
        } else {
          // If opened directly, redirect to login page with error
          router.push('/login?error=google-login-failed');
        }
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return null; // 这个组件只处理副作用，不渲染任何内容
}

export default function GoogleCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
        </div>
      }>
        <CallbackHandler />
      </Suspense>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">Completing Google login...</h2>
        <p className="text-gray-500 mt-2">Please wait while we process your login.</p>
      </div>
    </div>
  );
}
