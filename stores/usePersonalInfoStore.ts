import { create } from 'zustand';
import { getUserInfo } from '@/lib/api/index';

export interface BasicOptionItem {
  id: number | string;
  name: string;
  [key: string]: any;
}

interface UserInfo {
  username: string;
  email: string;
  status: string;
  headPic: string;
  emailVerified: string;
}

interface ModelState extends UserInfo {
  isLoading: boolean;
  error: string | null;

  // Methods for updating individual fields
  updateUsername: (username: string) => void;
  updateEmail: (email: string) => void;
  updateStatus: (status: string) => void;
  updateHeadPic: (headPic: string) => void;
  updateEmailVerified: (emailVerified: string) => void;

  // Method for updating multiple fields at once
  updateUserInfo: (userInfo: Partial<UserInfo>) => void;
  clearUserInfo: () => void;

  // New method for fetching user info from API
  fetchUserInfo: () => Promise<UserInfo | null>;
}

export const usePersonalInfoStore = create<ModelState>((set, get) => ({
  // User info fields
  username: '',
  email: '',
  status: '',
  headPic: '',
  emailVerified: '',

  // Status fields
  isLoading: false,
  error: null,

  // Individual field update methods
  updateUsername: username => set({ username }),
  updateEmail: email => set({ email }),
  updateStatus: status => set({ status }),
  updateHeadPic: headPic => set({ headPic }),
  updateEmailVerified: emailVerified => set({ emailVerified }),

  // Update multiple fields at once
  updateUserInfo: userInfo => set(state => ({ ...state, ...userInfo })),
  clearUserInfo: () => set({ username: '', email: '', status: '', headPic: '', emailVerified: '' }),

  // Fetch user info from API
  fetchUserInfo: async () => {
    try {
      set({ isLoading: true, error: null });
      const userData = await getUserInfo();

      const userInfo = {
        username: userData.username || '',
        email: userData.email || '',
        status: userData.status || '',
        headPic: userData.headPic || '',
        emailVerified: userData.emailVerified || ''
      };

      set({ ...userInfo, isLoading: false });
      return userInfo;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user info'
      });
      return null;
    }
  }
}));

// Export store
export default usePersonalInfoStore;
