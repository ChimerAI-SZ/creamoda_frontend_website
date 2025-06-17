// Regex patterns based on backend validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const USERNAME_REGEX = /^[\p{L}\p{N}_\-\.]+$/u;
// New regex for allowed password characters
const PASSWORD_ALLOWED_CHARS = /^[A-Za-z0-9!@#$%^&*()\-_+=]+$/;

// 通用验证函数
// 1 - 3-20 characters
// 2 - Letters (A-Z, a-z), numbers, underscore (_), hyphen (-), dot (.)
export const validators = {
  name: (value: string): number[] => {
    const errorKeys = [];

    if (!value.trim()) {
      errorKeys.push(1, 2);
    }

    const nameRule = verificationRules.find(rule => rule.type === 'name')?.rule;

    if (nameRule) {
      for (const r of nameRule) {
        if (r.formula(value)) {
          errorKeys.push(r.key);
        }
      }
    }

    return errorKeys;
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

  password: (value: string): number[] => {
    const errorKeys = [];

    if (!value) {
      errorKeys.push(1, 2, 3, 4, 5, 6);
    }

    const passwordRule = verificationRules.find(rule => rule.type === 'password')?.rule;

    if (passwordRule) {
      for (const r of passwordRule) {
        if (r.formula(value)) {
          errorKeys.push(r.key);
        }
      }
    }

    return errorKeys;
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

export const verificationRules = [
  {
    type: 'name',
    rule: [
      {
        label: '3-20 characters',
        formula: (value: string) => value.length < 3 || value.length > 20,
        key: 1
      },
      {
        label: 'Letters (A-Z, a-z), numbers, underscore (_), hyphen (-), dot (.)',
        formula: (value: string) => USERNAME_REGEX.test(value),
        key: 2
      },
      {
        // 恒定为 true
        label: 'Unicode characters allowed (e.g., Chinese, Japanese)',
        formula: () => {},
        key: 3
      }
    ]
  },
  {
    type: 'password',
    rule: [
      {
        label: '8-50 characters',
        formula: (value: string) => value.length < 8 || value.length > 50,
        key: 1
      },
      {
        label: 'At least one uppercase letter',
        formula: (value: string) => !/[A-Z]/.test(value),
        key: 2
      },
      {
        label: 'At least one lowercase letter',
        formula: (value: string) => !/[a-z]/.test(value),
        key: 3
      },
      {
        label: 'At least one number',
        formula: (value: string) => !/[0-9]/.test(value),
        key: 4
      },
      {
        label: 'At least one special character',
        formula: (value: string) => !/[!@#$%^&*()\-_+=]/.test(value),
        key: 5
      }
    ]
  }
];
