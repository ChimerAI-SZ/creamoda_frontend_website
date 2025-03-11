import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { validators } from './validators';
import { authApi } from '@/app/services/api';

interface SignUpFormProps {
  onToggleView: () => void;
  onSignupSuccess?: (email: string) => void;
}

export const SignUpForm = ({ onToggleView, onSignupSuccess }: SignUpFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = useCallback(
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear error when typing
      if (value.trim()) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }

      // Special handling for password fields
      if (field === 'password' && formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: value === formData.confirmPassword ? '' : 'Passwords do not match'
        }));
      }

      if (field === 'confirmPassword' && formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: value === formData.password ? '' : 'Passwords do not match'
        }));
      }

      // Clear API error when user types
      if (apiError) setApiError('');
    },
    [formData.password, formData.confirmPassword, apiError]
  );

  const handleBlur = useCallback(
    (field: keyof typeof formData) => () => {
      let errorMessage = '';

      switch (field) {
        case 'name':
          errorMessage = validators.name(formData.name);
          break;
        case 'email':
          errorMessage = validators.email(formData.email);
          break;
        case 'password':
          errorMessage = validators.password(formData.password);
          break;
        case 'confirmPassword':
          errorMessage = validators.confirmPassword(formData.confirmPassword, formData.password);
          break;
      }

      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    },
    [formData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const nameError = validators.name(formData.name);
    const emailError = validators.email(formData.email);
    const passwordError = validators.password(formData.password);
    const confirmPasswordError = validators.confirmPassword(formData.confirmPassword, formData.password);

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          pwd: formData.password,
          username: formData.name
        })
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
        // Registration successful
        setRegistrationSuccess(true);
        console.log('Registration successful:', data);

        // Call the success callback with the email
        if (onSignupSuccess) {
          onSignupSuccess(formData.email);
        } else {
          // Fallback to original behavior if no callback provided
          setTimeout(() => {
            onToggleView();
          }, 3000);
        }
      } else {
        // API returned an error
        setApiError(data.msg || data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.password === formData.confirmPassword &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-[#E50000] text-sm font-inter">{apiError}</p>
        </div>
      )}

      {registrationSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm font-inter">Registration successful! Redirecting to login...</p>
        </div>
      )}

      <FormField
        label="Username"
        type="text"
        placeholder="johndoe"
        value={formData.name}
        onChange={handleChange('name')}
        onBlur={handleBlur('name')}
        error={errors.name}
      />

      <FormField
        label="Email"
        type="email"
        placeholder="creamoda@email.com"
        value={formData.email}
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
        error={errors.email}
      />

      <FormField
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange('password')}
        onBlur={handleBlur('password')}
        error={errors.password}
      />

      <FormField
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        onBlur={handleBlur('confirmPassword')}
        error={errors.confirmPassword}
      />

      <Button
        type="submit"
        disabled={!isFormValid || isLoading || registrationSuccess}
        className={`h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] ${
          isFormValid && !isLoading && !registrationSuccess
            ? 'bg-[#F97917] hover:bg-[#F97917]/90'
            : 'bg-[rgba(249,121,23,0.5)] cursor-not-allowed'
        } text-white font-inter text-sm font-medium leading-5`}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </Button>
    </form>
  );
};
