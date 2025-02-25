import { cn } from "@/lib/utils"

interface SelectProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-10 rounded-md border border-[#28292D] bg-[#121316] px-3",
          "text-sm text-white",
          "focus:outline-none focus:ring-1 focus:ring-[#E50000]",
        )}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#121316]">
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

