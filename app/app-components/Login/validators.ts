// Regex patterns based on backend validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const USERNAME_REGEX = /^[\p{L}\p{N}_\-\.]+$/u;
// New regex for allowed password characters
const PASSWORD_ALLOWED_CHARS = /^[A-Za-z0-9!@#$%^&*()\-_+=]+$/;

// 通用验证函数
export const validators = {
  name: (value: string): string => {
    if (!value.trim()) {
      return 'Username is required';
    }

    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }

    if (value.length > 20) {
      return 'Username must be less than 20 characters';
    }

    if (!USERNAME_REGEX.test(value)) {
      return 'Username can only contain letters, numbers, and special characters (_, -, .)';
    }

    return '';
  },

  email: (value: string): string => {
    if (!value.trim()) {
      return 'Email is required';
    }

    if (!EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }

    return '';
  },

  password: (value: string): string => {
    if (!value) {
      return 'Password is required';
    }

    // 先检查长度限制
    if (value.length > 50) {
      return 'Password must be less than 50 characters';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }

    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }

    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }

    if (!/[!@#$%^&*()\-_+=]/.test(value)) {
      return 'Password must contain at least one special character';
    }

    if (!/^[A-Za-z0-9!@#$%^&*()\-_+=]+$/.test(value)) {
      return 'Password contains invalid characters';
    }

    return '';
  },

  confirmPassword: (value: string, password: string): string => {
    if (!value) {
      return 'Please confirm your password';
    }

    if (value !== password) {
      return 'Passwords do not match';
    }

    return '';
  }
};
