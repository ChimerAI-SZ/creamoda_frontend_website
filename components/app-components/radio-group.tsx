import { cn } from "@/lib/utils"

interface RadioOption {
  label: string
  value: string
}

interface RadioGroupProps {
  label: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
}

export function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      <span className="text-sm text-white">{label}</span>
      <div className="flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <div className="relative w-4 h-4">
              <input
                type="radio"
                className="sr-only"
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <div
                className={cn(
                  "absolute inset-0 rounded-full border",
                  value === option.value ? "border-[#E50000] bg-[#E50000]" : "border-[#28292D] bg-[#121316]",
                )}
              />
              {value === option.value && <div className="absolute inset-1 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-white">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

