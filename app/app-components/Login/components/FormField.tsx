import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  type: string;
  name?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
}

export const FormField = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  onKeyUp,
  onFocus,
  onBlur,
  error
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Determine the border color based on state - error takes priority
  const getBorderColorClass = () => {
    if (error) return 'border-[#E50000] focus:border-[#E50000] focus-visible:border-[#E50000]';
    if (isFocused) return 'border-[#4D4D4D] focus:border-[#4D4D4D]';
    return 'border-[#D9D9D9] focus:border-[#4D4D4D]';
  };

  // Determine border color for inline style - error takes priority
  const getBorderColor = () => {
    if (error) return '#E50000';
    if (isFocused) return '#4D4D4D';
    return '#D9D9D9';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-[6px]">
        <Label htmlFor={name || label.toLowerCase()} className="text-[#1A1A1A] font-inter text-sm font-medium">
          {label}
        </Label>
      </div>
      <div className="relative">
        <Input
          type={inputType}
          id={name || label.toLowerCase()}
          name={name || label.toLowerCase()}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyUp={onKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`h-[42px] ${getBorderColorClass()} !ring-0 !ring-offset-0 !outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 bg-white font-inter text-sm font-normal leading-5 ${
            isPassword ? 'pr-10' : ''
          }`}
          style={{
            borderColor: getBorderColor(),
            outline: 'none',
            boxShadow: 'none'
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={20} className="text-gray-500" />
            ) : (
              <Eye size={20} className="text-gray-500" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-[#E50000] text-xs font-inter">{error}</p>}
    </div>
  );
};
