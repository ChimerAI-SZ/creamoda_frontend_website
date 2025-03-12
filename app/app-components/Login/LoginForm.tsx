import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { validators } from './validators';
import { authApi, saveAuthToken } from '@/lib/login/api';

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

  const handleKeyUp = useCallback(
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
          onSuccess();
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
    <form onSubmit={handleSubmit}>
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
          error={errors.password}
        />
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
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
