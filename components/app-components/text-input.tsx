import type { TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface TextInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function TextInput({ label, className, ...props }: TextInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <textarea
        className={cn(
          "w-full min-h-[120px] rounded-md border border-[#28292D] bg-[#121316] px-3 py-2",
          "text-sm text-white placeholder:text-[#999999]",
          "focus:outline-none focus:ring-1 focus:ring-[#E50000]",
          className,
        )}
        {...props}
      />
    </div>
  )
}

