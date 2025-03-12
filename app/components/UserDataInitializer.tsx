'use client';

import { useEffect, useState } from 'react';
import { authApi, isAuthenticated } from '@/app/services/api';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

export function UserDataInitializer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await authApi.getUserInfo();
          usePersonalInfoStore.getState().updateUserInfo({
            username: userData.username || '',
            email: userData.email || '',
            status: userData.status || '',
            headPic: userData.headPic || '',
            emailVerified: userData.emailVerified || ''
          });
        } catch (error) {
          console.error('Failed to fetch user info on app initialization:', error);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  // This component doesn't render anything visible
  return null;
}
