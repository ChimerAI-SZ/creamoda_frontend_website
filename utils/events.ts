import mitt from 'mitt';

/**
 * 应用事件类型定义
 * 使用命名空间方式组织事件，提高可读性和可维护性
 */
export type AppEvents = {
  // 侧边栏相关事件
  'sidebar:submit-success': { data: any };
  // 侧边栏相关事件
  'imageList:generate-list': { data: any };
  // 用户认证相关事件
  'auth:login': {
    isOpen?: boolean;
  };
  'auth:logout': void;
};

// 创建 mitt 实例
const emitter = mitt<AppEvents>();

/**
 * 事件管理器
 * 提供类型安全的事件发布和订阅接口
 */
export const eventBus = {
  /**
   * 发布事件
   * @param event 事件名称
   * @param data 事件数据
   */
  emit<K extends keyof AppEvents>(event: K, data: AppEvents[K]): void {
    emitter.emit(event, data);
  },

  /**
   * 订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  on<K extends keyof AppEvents>(event: K, handler: (data: AppEvents[K]) => void): void {
    emitter.on(event, handler as any);
  },

  /**
   * 取消订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  off<K extends keyof AppEvents>(event: K, handler: (data: AppEvents[K]) => void): void {
    emitter.off(event, handler as any);
  },

  /**
   * 取消订阅所有事件
   */
  clear(): void {
    emitter.all.clear();
  }
};

// 为了向后兼容，保留原始 emitter 导出
export { emitter };
