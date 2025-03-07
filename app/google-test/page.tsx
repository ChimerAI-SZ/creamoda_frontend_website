'use client';

import { useState } from 'react';
import { authApi } from '@/app/services/api';

export default function GoogleTest() {
  const [authUrl, setAuthUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testGoogleAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 从后端获取 Google 授权 URL
      const googleAuthUrl = await authApi.getGoogleAuthUrl();
      setAuthUrl(googleAuthUrl);
    } catch (error) {
      console.error('Error testing Google auth:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google OAuth Configuration Test</h1>

      <button
        onClick={testGoogleAuth}
        disabled={isLoading}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? 'Loading...' : 'Test Google Auth Configuration'}
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Generated Auth URL:</h2>
          <p className="font-mono bg-gray-100 p-2 rounded break-all">{authUrl || 'Click the test button'}</p>
        </div>

        {authUrl && (
          <div>
            <h2 className="text-lg font-semibold">Test Login:</h2>
            <a
              href={authUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Open Google Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
