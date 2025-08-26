'use client';

import { useEffect, useState } from 'react';

const EnvIndicator = () => {
  const [env, setEnv] = useState<string>('');

  useEffect(() => {
    setEnv(process.env.NEXT_PUBLIC_ENV || 'development');
  }, []);

  if (env === 'production') {
    return null; // 生产环境不显示指示器
  }

  const getEnvColor = () => {
    switch (env) {
      case 'staging':
        return 'bg-yellow-500';
      case 'development':
        return '';
      default:
        return 'bg-gray-500';
    }
  };

  const getEnvText = () => {
    switch (env) {
      case 'staging':
        return '测试环境';
      case 'development':
        return '';
      default:
        return env;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 px-3 py-1 font-medium `}>
      {getEnvText()}
    </div>
  );
};

export default EnvIndicator;
