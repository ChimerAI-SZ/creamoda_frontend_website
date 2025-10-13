'use client';

import { useEffect, useState } from 'react';
import { isAuthenticated, saveAuthToken } from '@/lib/api/token';
import { AuthService } from '@/services/authService';

interface GoogleOneTapProps {
  // Google OAuth Client ID
  clientId?: string;
  // 是否启用调试模式
  debug?: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (momentCallback?: (notification: any) => void) => void;
          cancel: () => void;
          revoke: (hint: string, callback: (response: any) => void) => void;
        };
      };
    };
  }
}

export default function GoogleOneTap({ 
  clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo_client_id',
  debug = false 
}: GoogleOneTapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // 检查是否应该显示 One Tap
  useEffect(() => {
    const checkShouldShow = () => {
      // 只在未登录状态下显示
      const loggedIn = isAuthenticated();
      setShouldShow(!loggedIn);
    };

    checkShouldShow();
  }, []);

  // 加载 Google Identity API
  useEffect(() => {
    if (!shouldShow || !clientId || isLoaded) return;

    const loadGoogleScript = () => {
      return new Promise<void>((resolve, reject) => {
        // 检查是否已经加载
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Identity script'));
        
        document.head.appendChild(script);
      });
    };

    loadGoogleScript()
      .then(() => {
        setIsLoaded(true);
        if (debug) {
          console.log('Google Identity API loaded successfully');
        }
      })
      .catch((error) => {
        console.error('Failed to load Google Identity API:', error);
      });
  }, [shouldShow, clientId, isLoaded, debug]);

  // 初始化 Google One Tap
  useEffect(() => {
    if (!isLoaded || !shouldShow || !window.google?.accounts?.id) return;

    try {
      // 处理凭据响应
      const handleCredentialResponse = async (response: { credential: string }) => {
        if (debug) {
          console.log('Google One Tap credential received:', response);
        }

        try {
          // 触发登录开始事件，让UI显示加载状态
          const { eventBus: eventBusModule } = await import('@/utils/events');
          eventBusModule.emit('auth:login-start', undefined);

          // 解析JWT token (可选，用于调试)
          if (debug) {
            const payload = parseJWT(response.credential);
            console.log('Google ID Token payload:', payload);
          }

          // 使用现有的Google登录API处理One Tap的credential
          try {
            // 发送到现有的Google回调端点
            const result = await fetch('/api/v1/auth/google-callback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                credential: response.credential,
                // 标识这是来自One Tap的请求
                source: 'one-tap'
              }),
            });

            const data = await result.json();
            
            if (data.code === 0 && data.data?.authorization) {
              // 保存token
              const token = data.data.authorization;
              console.log('[GoogleOneTap] Received token:', token?.substring(0, 30) + '...');
              console.log('[GoogleOneTap] Token length:', token?.length);
              
              saveAuthToken(token);
              
              // 验证 token 是否正确保存
              const savedToken = localStorage.getItem('auth_token');
              console.log('[GoogleOneTap] Token saved to localStorage:', savedToken === token ? 'YES' : 'NO');
              
              // 立即触发登录成功事件，让页面快速显示登录状态
              const { eventBus } = await import('@/utils/events');
              eventBus.emit('auth:login-success', undefined);
              
              if (debug) {
                console.log('Google One Tap login successful, staying on current page');
              }
              
              // 在后台异步执行其他操作（不阻塞UI更新）
              AuthService.handlePostLoginActions({
                skipRedirect: true, // Google One Tap 登录后停留在当前页面
                skipEvent: true, // 跳过事件触发，因为上面已经触发过了
                onSuccess: () => {
                  if (debug) {
                    console.log('Post-login data fetching completed, staying on current page');
                  }
                },
                onError: (error) => {
                  console.error('Post-login actions failed:', error);
                }
              }).catch(error => {
                console.error('Background post-login actions failed:', error);
              });
            } else {
              if (debug) {
                console.error('Google One Tap verification failed:', data.msg || 'Unknown error');
              }
              // 登录失败，取消加载状态
              const { eventBus: eventBusModule } = await import('@/utils/events');
              eventBusModule.emit('auth:login-failed', undefined);
            }
          } catch (fetchError) {
            if (debug) {
              console.error('Network error during Google One Tap:', fetchError);
            }
            // 网络错误，取消加载状态
            const { eventBus: eventBusModule } = await import('@/utils/events');
            eventBusModule.emit('auth:login-failed', undefined);
          }
        } catch (error) {
          console.error('Error processing Google One Tap credential:', error);
          // 处理错误，取消加载状态
          const { eventBus: eventBusModule } = await import('@/utils/events');
          eventBusModule.emit('auth:login-failed', undefined);
        }
      };

      // 初始化Google Identity
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        // 自动选择账号，如果只有一个可用账号
        auto_select: false,
        // 取消按钮文本
        cancel_on_tap_outside: true,
        // 用户体验模式
        ux_mode: 'popup',
        // ITP支持
        itp_support: true,
      });

      // 显示One Tap提示
      window.google.accounts.id.prompt((notification: any) => {
        if (debug) {
          console.log('Google One Tap notification:', notification);
        }
        
        // 处理提示状态
        if (notification.isNotDisplayed?.()) {
          if (debug) {
            console.log('Google One Tap was not displayed');
          }
        } else if (notification.isSkippedMoment?.()) {
          if (debug) {
            console.log('Google One Tap was skipped');
          }
        }
      });

      if (debug) {
        console.log('Google One Tap initialized and prompted');
      }
    } catch (error) {
      console.error('Error initializing Google One Tap:', error);
    }
  }, [isLoaded, shouldShow, clientId, debug]);

  // 工具函数：解析JWT token
  const parseJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  // Google One Tap 不需要渲染任何可见的UI，它会自动显示提示
  // 但我们可以返回一个隐藏的div来帮助调试
  if (debug && shouldShow) {
    return (
      <div 
        id="google-one-tap-debug" 
        style={{ 
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.1)',
          color: 'white',
          padding: '4px 8px',
          fontSize: '12px'
        }}
      >
        Google One Tap: {isLoaded ? 'Loaded' : 'Loading...'}
      </div>
    );
  }

  return null;
}
