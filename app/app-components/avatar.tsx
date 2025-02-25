"use client"

import Image from "next/image"
import { useState } from "react"
import { User, Settings, LogOut } from "lucide-react"

export default function Avatar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <div
        className="w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF7B0D] focus:ring-offset-2 cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Image src="/placeholder.svg?height=32&width=32" alt="User Avatar" width={32} height={32} />
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500">john.doe@example.com</p>
          </div>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <User className="inline-block w-4 h-4 mr-2" />
            Profile
          </a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Settings className="inline-block w-4 h-4 mr-2" />
            Settings
          </a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <LogOut className="inline-block w-4 h-4 mr-2" />
            Log out
          </a>
        </div>
      )}
    </div>
  )
}

