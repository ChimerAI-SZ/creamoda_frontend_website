'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]"
      style={{ isolation: 'isolate' }}
    >
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative z-[100000]">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center">Log In</h1>

          <button className="w-full flex items-center justify-center gap-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Web_Creamoda_1_E6_9C_9F_EF_BC_88P0_EF_BC_89-fAj414VJcMLDGnP01e2ni10OMxYhhl.png"
              alt="Google Logo"
              width={20}
              height={20}
            />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="mail@email.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="Password" />
              <div className="flex justify-end">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                  Forgot password? <span className="underline">Send email</span>
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#FF7B0D] hover:bg-[#FF7B0D]/90 text-white">
              Log In
            </Button>

            <p className="text-center text-sm text-gray-500">
              No account?{' '}
              <a href="#" className="underline font-medium text-gray-900">
                Sign Up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
