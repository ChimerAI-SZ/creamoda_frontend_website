import { useState, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { validators } from '../const';

import { login, saveAuthToken } from '@/lib/api';
import { cn } from '@/utils';

interface LoginFormProps {
  onToggleView: () => void;
  onSuccess: () => void;
}

export const LoginForm = ({ onToggleView, onSuccess }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: ''
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

  const handleKeyUp = useCallback(
    (field: 'email' | 'password') => () => {
      if (field === 'email') {
        setErrors(prev => ({ ...prev, email: validators.email(formData.email) }));
      }
    },
    [formData.email]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const emailError = validators.email(formData.email);

    if (emailError) {
      setErrors({
        email: emailError
      });
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await login(formData.email, formData.password);

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
          onSuccess();
        } else {
          setApiError('Authentication token not received. Please try again.');
        }
      } else {
        // API returned an error
        setApiError(response.msg || 'Login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setApiError(error?.msg || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '' && !errors.email;

  return (
    <form onSubmit={handleSubmit} className="mt-[6px]">
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-error text-sm font-inter">{apiError}</p>
        </div>
      )}

      <FormField
        label="Email"
        type="email"
        placeholder="mail@email.com"
        value={formData.email}
        onChange={handleChange('email')}
        onKeyUp={handleKeyUp('email')}
        error={errors.email}
      />

      <div className="space-y-[6px]">
        <FormField
          label="Password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange('password')}
          onKeyUp={handleKeyUp('password')}
        />
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={!isFormValid || isLoading}
        className={cn(
          'h-[44px] w-full flex justify-center items-center gap-[6px] text-white font-inter text-base font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed',
          !(isFormValid && !isLoading) && 'bg-primary/50 cursor-not-allowed'
        )}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
