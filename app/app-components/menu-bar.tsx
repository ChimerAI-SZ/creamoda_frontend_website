import type React from "react"
import { cn } from "@/lib/utils"
import { Home, Wand2, Crown } from "lucide-react"

interface MenuItemProps {
  icon: React.ReactNode
  title: string
  isActive?: boolean
  onClick?: () => void
}

function MenuItem({ icon, title, isActive, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center p-3 rounded-lg transition-all duration-200 w-full group",
        isActive ? "text-[#FF7B0D]" : "text-[#999999] hover:bg-gray-100 hover:text-gray-700",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 flex-shrink-0",
          isActive && "bg-[#FF7B0D] rounded-[9999px] p-1.5",
        )}
      >
        <div className={cn("flex items-center justify-center", isActive && "bg-white rounded-full p-1.5")}>{icon}</div>
      </div>
      <span className="ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto">
        {title}
      </span>
    </button>
  )
}

export function MenuBar() {
  return (
    <div
      className={cn(
        "group bg-white border-r border-gray-200 h-[calc(100vh-64px)] flex flex-col py-6 space-y-6 transition-all duration-200",
        "hover:w-48 w-16",
      )}
    >
      <MenuItem icon={<Home className="w-5 h-5" />} title="Home" isActive />
      <MenuItem icon={<Wand2 className="w-5 h-5" />} title="AI Generation" />
      <MenuItem icon={<Crown className="w-5 h-5" />} title="Premium" />
    </div>
  )
}

