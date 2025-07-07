import { useState, useCallback } from 'react';
import { Info } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { validators, verificationRules } from '../const';
import { register } from '@/lib/api';
import { cn } from '@/utils';

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
  const [errors, setErrors] = useState<{
    name: number[];
    email: string;
    password: number[];
    confirmPassword: string;
  }>({
    name: [],
    email: '',
    password: [],
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = useCallback(
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFormData(prev => ({ ...prev, [field]: value }));

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
    },
    [formData.password, formData.confirmPassword, errors.password]
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
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field: string) => {
    let errorMessage: number[] | string;

    switch (field) {
      case 'name':
        errorMessage = validators.name(formData.name);
        break;
      case 'email':
        errorMessage = validators.email(formData.email);
        break;
      case 'password':
        errorMessage = validators.password(formData.password);
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
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.password === formData.confirmPassword &&
    errors.name.length === 0 &&
    !errors.email &&
    errors.password.length === 0 &&
    !errors.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="overflow-y-visible">
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
          onBlur={() => handleBlur('name')}
          error={errors.name}
          description={
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className={cn('w-4 h-4 cursor-pointer', errors.name.length > 0 && 'text-error')} />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[#0A1532] py-2 px-3">
                  <div className="text-xs leading-relaxed space-y-1">
                    {verificationRules
                      .find(rule => rule.type === 'name')
                      ?.rule.map((r, index) => (
                        <div className="flex items-center gap-2" key={r.key + index}>
                          <Image
                            src={`/images/login/${errors.name.includes(r.key) ? 'error' : 'correct'}.svg`}
                            alt="username-requirements"
                            width={16}
                            height={16}
                          />
                          {r.label}
                        </div>
                      ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          }
        />
      </div>

      <div className="space-y-1">
        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="creamoda@email.com"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={() => handleBlur('email')}
          error={errors.email}
        />
      </div>

      <div className="space-y-1">
        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder=""
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={() => handleBlur('password')}
          error={errors.password}
          description={
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className={cn('w-4 h-4 cursor-pointer', errors.password.length > 0 && 'text-error')} />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[#0A1532] py-2 px-3">
                  <div className="text-xs leading-relaxed space-y-1">
                    {verificationRules
                      .find(rule => rule.type === 'password')
                      ?.rule.map((r, index) => (
                        <div className="flex items-center gap-2" key={r.key + index}>
                          <Image
                            src={`/images/login/${errors.password.includes(r.key) ? 'error' : 'correct'}.svg`}
                            alt="username-requirements"
                            width={16}
                            height={16}
                          />
                          {r.label}
                        </div>
                      ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          }
        />
      </div>

      <div className="space-y-1">
        <FormField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder=""
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={() => handleBlur('confirmPassword')}
          error={errors.confirmPassword}
        />
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={!isFormValid || isLoading || registrationSuccess}
        className={cn(
          'h-[44px] w-full flex justify-center items-center gap-[6px] text-white font-inter text-base font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed',
          !(isFormValid && !isLoading && !registrationSuccess) && 'bg-primary/50 cursor-not-allowed'
        )}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </Button>
    </form>
  );
};
