import React from 'react';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  label: string;
  type: string;
  name?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  onFocus?: () => void;
  error?: string;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  onKeyUp,
  onFocus,
  error,
  hint
}) => {
  return (
    <div className="space-y-[6px]">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 font-inter">{label}</label>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full h-[52px] px-4 py-[10px] border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#F97917] font-inter text-sm`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
      />
      <div className="h-5">{error && <p className="text-[#E50000] text-xs font-inter">{error}</p>}</div>
    </div>
  );
};
