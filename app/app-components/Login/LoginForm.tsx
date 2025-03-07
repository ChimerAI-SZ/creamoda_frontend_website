import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { validators } from './validators';
import { authApi, saveAuthToken } from '@/app/services/api';

interface LoginFormProps {
  onToggleView: () => void;
}

export const LoginForm = ({ onToggleView }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = useCallback(
    (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      if (value.trim()) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
      // Clear API error when user types
      if (apiError) setApiError('');
    },
    [apiError]
  );

  const handleBlur = useCallback(
    (field: 'email' | 'password') => () => {
      if (field === 'email') {
        setErrors(prev => ({ ...prev, email: validators.email(formData.email) }));
      } else {
        setErrors(prev => ({ ...prev, password: validators.password(formData.password) }));
      }
    },
    [formData.email, formData.password]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const emailError = validators.email(formData.email);
    const passwordError = validators.password(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await authApi.login(formData.email, formData.password);

      if (response.code === 0) {
        // Login successful
        console.log('Login successful:', response);

        // Save the authorization token
        if (response.data && response.data.authorization) {
          saveAuthToken(response.data.authorization);

          // Here you would typically redirect the user or close the modal
          // For example:
          // window.location.href = '/dashboard';
          // or
          // onClose();
        } else {
          setApiError('Authentication token not received. Please try again.');
        }
      } else {
        // API returned an error
        setApiError(response.msg || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.email.trim() !== '' && formData.password.trim() !== '' && !errors.email && !errors.password;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-[#E50000] text-sm font-inter">{apiError}</p>
        </div>
      )}

      <FormField
        label="Email"
        type="email"
        placeholder="mail@email.com"
        value={formData.email}
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
        error={errors.email}
      />

      <div className="space-y-[6px]">
        <FormField
          label="Password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          error={errors.password}
        />
        <div className="flex justify-end">
          <a href="#" className="text-sm font-normal text-[#A3A3A3] font-inter leading-5">
            Forgot password? <span className="underline">Send email</span>
          </a>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={`h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] ${
          isFormValid && !isLoading
            ? 'bg-[#F97917] hover:bg-[#F97917]/90'
            : 'bg-[rgba(249,121,23,0.5)] cursor-not-allowed'
        } text-white font-inter text-sm font-medium leading-5`}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        No account?{' '}
        <a
          href="#"
          className="underline font-medium text-gray-900"
          onClick={e => {
            e.preventDefault();
            onToggleView();
          }}
        >
          Sign Up here
        </a>
      </p>
    </form>
  );
};
