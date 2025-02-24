"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
  align?: "left" | "right"
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, trigger, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {trigger}
      {isOpen && (
        <div
          className={cn(
            "absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            align === "left" ? "origin-top-left left-0" : "origin-top-right right-0",
          )}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick }) => {
  return (
    <a
      href="#"
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      role="menuitem"
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
    >
      {children}
    </a>
  )
}

export const DropdownMenuSeparator: React.FC = () => {
  return <hr className="my-1 border-gray-200" />
}

export const DropdownMenuLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="px-4 py-2 text-sm font-medium text-gray-900">{children}</div>
}

export const DropdownMenuTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
  return <>{children}</>
}

export const DropdownMenuContent: React.FC<{
  children: React.ReactNode
  className?: string
  align?: "left" | "right"
}> = ({ children }) => {
  return <>{children}</>
}

