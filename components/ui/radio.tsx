import React from 'react';

interface RadioOption {
  label: string | React.ReactElement;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, name, selectedValue, onChange }) => {
  return (
    <div className="flex gap-2 w-full">
      {options.map(option => (
        <label key={option.value} className="flex items-center flex-1">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            className="hidden"
          />
          <span
            className={`w-full text-center p-[6px] border cursor-pointer bg-eff rounded-[8px] leading-[20px] text-[14px] font-normal ${
              selectedValue === option.value ? 'border-primary text-gray' : 'text-gray-40 border-eff'
            }`}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
