import { create } from 'zustand';
import { getUserInfo } from '@/lib/api/index';

interface UserInfo {
  username: string;
  email: string;
  status: string;
  headPic: string;
  emailVerified: string;
  hasPwd: boolean;
  credit: number;
  subscribeLevel: 1 | 2 | 3 | 0;
  billingEmail: string;
  renewTime: string;
  isRenew: 0 | 1;
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
  updateHasPwd: (hasPwd: boolean) => void;

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
  hasPwd: false, // 用于标记可以修改密码

  // subscription fields
  credit: 0, // 积分
  subscribeLevel: 0, // 订阅等级
  billingEmail: '', // 账单邮箱
  renewTime: '', // 续费时间
  isRenew: 0, // 是否续费

  // Status fields
  isLoading: false,
  error: null,

  // Individual field update methods
  updateUsername: username => set({ username }),
  updateEmail: email => set({ email }),
  updateStatus: status => set({ status }),
  updateHeadPic: headPic => set({ headPic }),
  updateEmailVerified: emailVerified => set({ emailVerified }),
  updateHasPwd: hasPwd => set({ hasPwd }),

  // subscription fields
  updateCredit: (credit: number) => set({ credit }),
  updateSubscribeLevel: (subscribeLevel: 1 | 2 | 3 | 0) => set({ subscribeLevel }),
  updateBillingEmail: (billingEmail: string) => set({ billingEmail }),
  updateRenewTime: (renewTime: string) => set({ renewTime }),

  // Update multiple fields at once
  updateUserInfo: userInfo => set(state => ({ ...state, ...userInfo })),
  clearUserInfo: () =>
    set({
      username: '',
      email: '',
      status: '',
      headPic: '',
      emailVerified: '',
      hasPwd: false,
      credit: 0,
      isRenew: 0,

      subscribeLevel: 0,
      billingEmail: '',
      renewTime: ''
    }),

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
        emailVerified: userData.emailVerified || '',
        hasPwd: userData.hasPwd,
        credit: userData.credit || 0,
        isRenew: userData.isRenew || 0,
        subscribeLevel: userData.subscribeLevel || 0,
        billingEmail: userData.billingEmail || '',
        renewTime: userData.renewTime || ''
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
