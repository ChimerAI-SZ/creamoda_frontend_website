import { eventBus } from '@/utils/events';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';
import { useAlertStore } from '@/stores/useAlertStore';

export interface LoginPostActions {
  closeModal?: () => void;
  skipRedirect?: boolean;  // 是否跳过重定向到 /fashion-design/create
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export class AuthService {
  /**
   * 执行登录后的所有必要操作
   */
  static async handlePostLoginActions(options: LoginPostActions = {}) {
    const { closeModal, skipRedirect, onError, onSuccess } = options;

    try {
      // 1. 立即关闭模态框，提升用户体验
      if (closeModal) {
        closeModal();
      }

      // 2. 并行执行数据获取操作
      await Promise.allSettled([
        // 获取用户信息
        this.fetchUserInfo(),
        // 触发图片列表生成
        this.triggerImageListGeneration()
      ]);

      // 触发全局登录成功事件
      eventBus.emit('auth:login-success', undefined);

      // 3. 登录成功后的跳转逻辑
      if (!skipRedirect && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        
        // 如果已经在 SaaS 页面（fashion-design/create 或 magic-kit/create），
        // 刷新当前页面并保留 URL 参数
        if (currentPath.includes('/fashion-design/create') || 
            currentPath.includes('/magic-kit/create') ||
            currentPath.includes('/virtual-try-on/create')) {
          setTimeout(() => {
            // 保留当前 URL 的所有参数
            window.location.href = `${currentPath}${currentSearch}`;
          }, 300);
        } else {
          // 如果在其他页面，跳转到 fashion-design/create
          setTimeout(() => {
            window.location.href = '/fashion-design/create';
          }, 300);
        }
      }

      // 4. 执行成功回调
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error during post-login actions:', error);

      // 5. 错误处理
      if (onError) {
        onError(error as Error);
      } else {
        // 默认错误处理
        useAlertStore.getState().showAlert({
          type: 'error',
          content: '登录成功，但初始化数据时出现问题，请刷新页面重试'
        });
      }
    }
  }

  /**
   * 获取用户信息
   */
  private static async fetchUserInfo() {
    try {
      await usePersonalInfoStore.getState().fetchUserInfo();
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  }

  /**
   * 触发图片列表生成
   */
  private static async triggerImageListGeneration() {
    return new Promise<void>(resolve => {
      eventBus.emit('imageList:generate-list', { data: {} });
      // 给事件总线一点时间处理
      setTimeout(resolve, 100);
    });
  }

  /**
   * 登出后的清理操作
   */
  static async handlePostLogoutActions() {
    try {
      // 清理用户信息
      usePersonalInfoStore.getState().clearUserInfo();

      // 清理其他相关状态
      // 比如图片列表、生成历史等

      // 触发登出事件
      eventBus.emit('auth:logout', undefined);
    } catch (error) {
      console.error('Error during post-logout actions:', error);
    }
  }
}
