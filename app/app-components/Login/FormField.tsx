import { Input } from '@/components/ui/input';

interface FormFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error: string;
}

export const FormField = ({ label, type, placeholder, value, onChange, onBlur, error }: FormFieldProps) => (
  <div className="space-y-[6px]">
    <label className="text-sm font-medium text-[#121316] font-inter">{label}</label>
    <Input
      type={type}
      placeholder={placeholder}
      className={`h-[52px] px-2 py-[10px] flex items-center justify-center gap-[10px] w-full rounded-[4px] ${
        error ? 'border-[#E50000]' : 'border-[#E4E4E7]'
      } bg-white font-inter text-sm font-normal leading-5 placeholder:text-[#737373] placeholder:font-inter placeholder:text-sm placeholder:font-normal placeholder:leading-5`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
    {error && <p className="text-[#E50000] text-xs mt-1 font-inter leading-5">{error}</p>}
  </div>
);
