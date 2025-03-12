// Regex patterns based on backend validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,16}$/;
// New regex for allowed password characters
const PASSWORD_ALLOWED_CHARS = /^[A-Za-z0-9!@#$%^&*()\-_+=]+$/;

// 通用验证函数
export const validators = {
  name: (value: string): string => {
    if (!value.trim()) {
      return 'Username is required';
    }

    if (value.length < 3 || value.length > 16) {
      return 'Username must be between 3 and 16 characters';
    }

    if (!USERNAME_REGEX.test(value)) {
      return 'Username can only contain letters, numbers, underscores and hyphens';
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
    if (!value.trim()) {
      return 'Password is required';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }

    if (!PASSWORD_ALLOWED_CHARS.test(value)) {
      return 'Invalid characters used. Only use letters, numbers, and !@#$%^&*()-_+=';
    }

    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }

    if (!/\d/.test(value)) {
      return 'Password must contain at least one number';
    }

    if (!/[!@#$%^&*()\-_+=]/.test(value)) {
      return 'Password must contain at least one special character (!@#$%^&*()-_+=)';
    }

    return '';
  },

  confirmPassword: (value: string, password: string): string => {
    if (!value.trim()) {
      return 'Please confirm your password';
    }

    if (value !== password) {
      return 'Passwords do not match';
    }

    return '';
  }
};
