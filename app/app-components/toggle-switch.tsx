import { cn } from "@/lib/utils"

interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={cn("block w-10 h-6 rounded-full", checked ? "bg-[#E50000]" : "bg-[#28292D]")} />
        <div
          className={cn(
            "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform",
            checked && "translate-x-4",
          )}
        />
      </div>
      <span className="ml-3 text-sm text-white">{label}</span>
    </label>
  )
}

