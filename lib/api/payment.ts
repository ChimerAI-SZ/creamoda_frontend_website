import { api } from '@/lib/axios';
import axios from 'axios';

/**
 * 订阅列表
 * @param level 1 | 2 | 3 1-基础 2-专业 3-企业
 */
export async function handleSubscribe(level: 1 | 2 | 3) {
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
  try {
    const response = await api.post('/api/v1/pay/purchase_credit', { value });

    return response.data;
  } catch (error) {
    console.error('Error getting variation type list:', error);
    throw error;
  }
}

export async function handleCaptureOrder(token: string, subscription_id?: string) {
  try {
    const response = await api.post('/api/v1/paypal/capture', { token, subscription_id });

    return response.data;
  } catch (error) {
    console.error('Error getting variation type list:', error);
    throw error;
  }
}
