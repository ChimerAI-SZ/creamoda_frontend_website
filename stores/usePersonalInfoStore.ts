import { create } from 'zustand';

export interface BasicOptionItem {
  id: number | string;
  name: string;
  [key: string]: any;
}

interface ModelState {
  username: string;
  email: string;
  status: string;
  headPic: string;
  emailVerified: string;

  // 添加修改用户信息的方法
  updateUsername: (username: string) => void;
  updateEmail: (email: string) => void;
  updateStatus: (status: string) => void;
  updateHeadPic: (headPic: string) => void;
  updateEmailVerified: (emailVerified: string) => void;
  updateUserInfo: (
    userInfo: Partial<
      Omit<
        ModelState,
        'updateUsername' | 'updateEmail' | 'updateStatus' | 'updateHeadPic' | 'updateEmailVerified' | 'updateUserInfo'
      >
    >
  ) => void;
}

export const usePersonalInfoStore = create<ModelState>(set => ({
  username: '',
  email: '',
  status: '',
  headPic: '',
  emailVerified: '',

  // 实现修改用户信息的方法
  updateUsername: username => set({ username }),
  updateEmail: email => set({ email }),
  updateStatus: status => set({ status }),
  updateHeadPic: headPic => set({ headPic }),
  updateEmailVerified: emailVerified => set({ emailVerified }),
  updateUserInfo: userInfo => set(state => ({ ...state, ...userInfo }))
}));

// 导出 store
export default usePersonalInfoStore;
