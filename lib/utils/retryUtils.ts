interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  shouldRetry: (error: any) => {
    // 重试网络相关错误
    if (error?.code === 'ECONNRESET' || 
        error?.cause?.code === 'ECONNRESET' ||
        error?.message?.includes('fetch failed') ||
        error?.message?.includes('ECONNRESET') ||
        error?.name === 'TypeError' && error?.message?.includes('fetch failed')) {
      return true;
    }
    
    // 重试5xx错误，但不重试4xx错误
    if (error?.status >= 500 && error?.status < 600) {
      return true;
    }
    
    return false;
  }
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;
  
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const result = await operation();
      if (attempt > 0) {
        console.log(`✅ Operation succeeded after ${attempt} retries`);
      }
      return result;
    } catch (error) {
      lastError = error;
      
      // 如果是最后一次尝试，或者不应该重试，抛出错误
      if (attempt === opts.maxRetries || !opts.shouldRetry(error)) {
        console.error(`❌ Operation failed after ${attempt + 1} attempts:`, error);
        throw error;
      }
      
      // 计算延迟时间（指数退避）
      const delay = Math.min(
        opts.baseDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      );
      
      console.warn(`⚠️ Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error?.message || error);
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function retryFetch(
  url: string, 
  init?: RequestInit, 
  retryOptions?: RetryOptions
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, init);
    
    // 如果是服务器错误，抛出错误以便重试
    if (response.status >= 500) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      (error as any).status = response.status;
      throw error;
    }
    
    return response;
  }, retryOptions);
}