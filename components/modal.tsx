'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]"
      style={{ isolation: 'isolate' }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="登录">
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Image src="/logo.png" alt="Logo" width={64} height={64} className="rounded-full" />
          <h3 className="text-lg font-medium">欢迎回来</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">请登录您的账户以继续</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              邮箱
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="请输入邮箱"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              密码
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="请输入密码"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input id="remember" type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
              <label htmlFor="remember" className="text-sm">
                记住我
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              忘记密码?
            </a>
          </div>
        </div>

        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
          登录
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">还没有账户? </span>
          <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
            注册
          </a>
        </div>
      </div>
    </Modal>
  );
}
