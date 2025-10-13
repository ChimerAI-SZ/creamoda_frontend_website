import { api } from '@/lib/axios';
import { Analytics } from '@/lib/analytics';
import { usePersonalInfoStore } from '@/stores/usePersonalInfoStore';

/**
 * 订阅列表
 * @param level 1 | 2 | 3 1-基础 2-专业 3-企业
 */
export async function handleSubscribe(level: 1 | 2 | 3) {
  const userInfo = usePersonalInfoStore.getState();
  
  // 发送付费按钮点击埋点
  if (userInfo.email) {
    // 订阅价格映射（根据实际业务调整）
    const priceMap = { 1: 9.99, 2: 29.99, 3: 99.99 };
    Analytics.trackPurchaseClick(
      userInfo.email,
      'subscribe',
      level.toString(),
      priceMap[level]
    );
  }
  
  try {
    const response = await api.post('/api/v1/pay/subscribe', { level });

    return response.data;
  } catch (error) {
    console.error('Error getting variation type list:', error);
    throw error;
  }
}

/**
 * 购买积分
 * @param value 40 | 100 | 200
 */
export async function handlePurchaseCredit(value: 40 | 100 | 200) {
  const userInfo = usePersonalInfoStore.getState();
  
  // 发送付费按钮点击埋点
  if (userInfo.email) {
    // 积分价格映射（根据实际业务调整）
    const priceMap = { 40: 9.99, 100: 19.99, 200: 39.99 };
    Analytics.trackPurchaseClick(
      userInfo.email,
      'one-time',
      value.toString(),
      priceMap[value]
    );
  }
  
  try {
    const response = await api.post('/api/v1/pay/purchase_credit', { value });

    return response.data;
  } catch (error) {
    console.error('Error getting variation type list:', error);
    throw error;
  }
}

export async function handleCaptureOrder(token: string, subscription_id?: string) {
  const userInfo = usePersonalInfoStore.getState();
  
  try {
    const response = await api.post('/api/v1/paypal/capture', { token, subscription_id });

    // 支付成功埋点
    if (userInfo.email && response.data.code === 0) {
      Analytics.trackPurchaseResult(
        userInfo.email,
        subscription_id ? 'subscribe' : 'one-time',
        subscription_id || token,
        0, // 价格从响应中获取，如果没有就用0
        'success',
        {
          transaction_id: token,
        }
      );
    }

    return response.data;
  } catch (error) {
    // 支付失败埋点
    if (userInfo.email) {
      Analytics.trackPurchaseResult(
        userInfo.email,
        subscription_id ? 'subscribe' : 'one-time',
        subscription_id || token,
        0,
        'fail',
        {
          error_code: (error as any)?.response?.data?.msg || 'unknown_error',
        }
      );
    }
    
    console.error('Error capturing order:', error);
    throw error;
  }
}

// 取消订阅
export async function handleCancelSubscribe() {
  try {
    const response = await api.post('/api/v1/pay/cancel_subscribe');

    return response.data;
  } catch (error) {
    console.error('Error getting variation type list:', error);
    throw error;
  }
}

// 查询消费记录

export async function queryBillingHistory(page: number = 1, pageSize: number = 5) {
  try {
    const response = await api.get(`/api/v1/pay/billing_history?page=${page}&page_size=${pageSize}`);

    return response.data;
  } catch (error: any) {
    // Handle auth errors more gracefully
    if (error?.message?.includes('Invalid or expired token') || error?.code === 401) {
      console.warn('Please login to view billing history');
      return { code: 401, data: [], msg: 'Authentication required' };
    }
    console.error('Error getting billing history:', error);
    throw error;
  }
}
