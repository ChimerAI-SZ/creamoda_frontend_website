import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { validators } from './validators';
import { register } from '@/lib/api';
import { PasswordRequirements } from './PasswordRequirements';
import { UsernameRequirements } from './UsernameRequirements';

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
  const [focusedField, setFocusedField] = useState<keyof typeof formData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Add effect to track active element for tab navigation
  useEffect(() => {
    const handleFocusChange = () => {
      const activeElement = document.activeElement;

      // Check which input is focused
      if (activeElement && activeElement.tagName === 'INPUT') {
        const inputName = activeElement.getAttribute('name');

        if (inputName === 'name') {
          setFocusedField('name');
        } else if (inputName === 'email') {
          setFocusedField('email');
        } else if (inputName === 'password') {
          setFocusedField('password');
        } else if (inputName === 'confirmPassword') {
          setFocusedField('confirmPassword');
        }
      }
    };

    // Add event listeners for focus and blur
    document.addEventListener('focusin', handleFocusChange);

    return () => {
      document.removeEventListener('focusin', handleFocusChange);
    };
  }, []);

  // Handle focus events
  const handleFocus = (field: keyof typeof formData) => () => {
    // Force a re-render by setting the focused field
    setFocusedField(null);

    // Use setTimeout to ensure the DOM has updated before showing the requirements
    setTimeout(() => {
      setFocusedField(field);
    }, 10);
  };

  // Handle blur events
  const handleBlur = () => {
    // Use setTimeout with a longer delay for tab navigation
    setTimeout(() => {
      // Check if the active element is still within the form
      const activeElement = document.activeElement;
      const isStillInForm =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'BUTTON' ||
          activeElement.closest('form') === document.querySelector('form'));

      // Only clear focused field if we've moved out of the form
      if (!isStillInForm) {
        setFocusedField(null);
      }
    }, 200);
  };

  const handleChange = useCallback(
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));

      // 立即验证密码长度
      if (field === 'password') {
        if (value.length > 50) {
          setErrors(prev => ({ ...prev, password: 'Password must be less than 50 characters' }));
        } else if (errors.password === 'Password must be less than 50 characters' && value.length <= 50) {
          // 如果之前有长度错误且现在长度合适，清除错误
          setErrors(prev => ({ ...prev, password: '' }));
          // 然后触发完整验证
          setTimeout(() => {
            setErrors(prev => ({ ...prev, password: validators.password(value) }));
          }, 0);
        }
      }

      // Don't clear errors immediately, let the keyUp handler do validation

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
    [formData.password, formData.confirmPassword, apiError, errors.password]
  );

  const handleKeyUp = useCallback(
    (field: keyof typeof formData) => () => {
      // Use setTimeout to debounce validation
      setTimeout(() => {
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
            // Also validate confirm password when password changes
            if (formData.confirmPassword) {
              setErrors(prev => ({
                ...prev,
                confirmPassword: validators.confirmPassword(formData.confirmPassword, formData.password)
              }));
            }
            break;
          case 'confirmPassword':
            errorMessage = validators.confirmPassword(formData.confirmPassword, formData.password);
            break;
        }

        setErrors(prev => ({ ...prev, [field]: errorMessage }));
      }, 300); // 300ms debounce
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
      const data = await register(formData.email, formData.password, formData.name);

      if (data.code === 0 || data.code === 402) {
        // Registration successful or email not verified (both cases proceed to next step)
        setRegistrationSuccess(true);
        console.log('Registration process:', data);

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
    <form onSubmit={handleSubmit}>
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

      <div className="space-y-1">
        <FormField
          label="Username"
          type="text"
          name="name"
          placeholder="johndoe"
          value={formData.name}
          onChange={handleChange('name')}
          onKeyUp={handleKeyUp('name')}
          onFocus={handleFocus('name')}
          onBlur={handleBlur}
          error={errors.name}
        />
        {focusedField === 'name' && formData.name.length > 0 && <UsernameRequirements username={formData.name} />}
      </div>

      <FormField
        label="Email"
        type="email"
        name="email"
        placeholder="creamoda@email.com"
        value={formData.email}
        onChange={handleChange('email')}
        onKeyUp={handleKeyUp('email')}
        onFocus={handleFocus('email')}
        onBlur={handleBlur}
        error={errors.email}
      />

      <div className="space-y-1">
        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder=""
          value={formData.password}
          onChange={handleChange('password')}
          onKeyUp={handleKeyUp('password')}
          onFocus={handleFocus('password')}
          onBlur={handleBlur}
          error={errors.password}
        />
        {focusedField === 'password' && formData.password.length > 0 && (
          <PasswordRequirements password={formData.password} />
        )}
      </div>

      <FormField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder=""
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        onKeyUp={handleKeyUp('confirmPassword')}
        onFocus={handleFocus('confirmPassword')}
        onBlur={handleBlur}
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
