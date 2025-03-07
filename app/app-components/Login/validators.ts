// 通用验证函数
export const validators = {
  name: (value: string) => {
    if (!value.trim()) return 'Name is required';
    return '';
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  },

  password: (value: string) => {
    if (!value.trim()) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  },

  confirmPassword: (value: string, password: string) => {
    if (!value.trim()) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  }
};
