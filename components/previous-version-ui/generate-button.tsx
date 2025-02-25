"use client"

import { useState } from "react"
import { LoginModal } from "./login-modal"

interface GenerateButtonProps {
  onClick: () => void
  disabled: boolean
  isLoggedIn?: boolean
}

export function GenerateButton({ onClick, disabled, isLoggedIn = false }: GenerateButtonProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleClick = () => {
    if (isLoggedIn) {
      onClick()
    } else {
      setShowLoginModal(true)
    }
  }

  return (
    <>
      <button
        type="submit"
        className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#FFE4D2] text-[#FF7B0D] transition-colors hover:bg-[#FFD4B8] disabled:opacity-50"
        disabled={disabled}
        onClick={handleClick}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Generating
      </button>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}

