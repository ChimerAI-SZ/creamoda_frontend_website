'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import x from '@/images/login/x.svg';
import google from '@/images/login/google.svg';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 登录表单组件
const LoginForm = ({ onToggleView }: { onToggleView: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: value.trim() ? '' : errors.email }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: value.trim() ? '' : errors.password }));
  };

  const handleBlur = (field: 'email' | 'password') => {
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '' && !errors.email && !errors.password;

  return (
    <>
      <div className="space-y-[6px] relative pb-6">
        <label className="text-sm font-medium text-[#121316] font-inter">Email</label>
        <Input
          type="email"
          placeholder="mail@email.com"
          className={`h-[52px] px-2 py-[10px] flex items-center justify-center gap-[10px] w-full rounded-[4px] ${
            errors.email ? 'border-red-500' : 'border-[#E4E4E7]'
          } bg-white`}
          value={email}
          onChange={handleEmailChange}
          onBlur={() => handleBlur('email')}
        />
        {errors.email && <p className="text-red-500 text-xs absolute bottom-0 left-0 font-inter">{errors.email}</p>}
      </div>

      <div className="space-y-[6px] mb-6">
        <label className="text-sm font-medium text-[#121316] font-inter">Password</label>
        <Input
          type="password"
          placeholder="Password"
          className={`h-[52px] px-2 py-[10px] flex items-center justify-center gap-[10px] w-full rounded-[4px] ${
            errors.password ? 'border-red-500' : 'border-[#E4E4E7]'
          } bg-white`}
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur('password')}
        />
        <div className="relative h-5">
          {errors.password && (
            <p className="text-red-500 text-xs absolute top-0 left-0 font-inter">{errors.password}</p>
          )}
          <div className="absolute top-0 right-0">
            <a href="#" className="text-sm font-normal text-[#A3A3A3] font-inter leading-5">
              Forgot password? <span className="underline">Send email</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          disabled={!isFormValid}
          className={`h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] ${
            isFormValid ? 'bg-[#F97917] hover:bg-[#F97917]/90' : 'bg-[rgba(249,121,23,0.5)] cursor-not-allowed'
          } text-white font-inter text-sm font-medium leading-5`}
        >
          Log In
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        No account?{' '}
        <a
          href="#"
          className="underline font-medium text-gray-900"
          onClick={e => {
            e.preventDefault();
            onToggleView();
          }}
        >
          Sign Up here
        </a>
      </p>
    </>
  );
};

// 注册表单组件
const SignUpForm = ({ onToggleView }: { onToggleView: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword.trim()) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const handleBlur = (field: 'name' | 'email' | 'password' | 'confirmPassword') => {
    switch (field) {
      case 'name':
        setErrors(prev => ({ ...prev, name: validateName(name) }));
        break;
      case 'email':
        setErrors(prev => ({ ...prev, email: validateEmail(email) }));
        break;
      case 'password':
        setErrors(prev => ({ ...prev, password: validatePassword(password) }));
        break;
      case 'confirmPassword':
        setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
        break;
    }
  };

  const isFormValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <div>
      <div className="space-y-[6px] relative pb-6">
        <label className="text-sm font-medium text-[#121316] font-inter">Name</label>
        <Input
          type="text"
          placeholder="Your name"
          className={`h-[52px] px-2 py-[10px] flex items-center justify-center gap-[10px] w-full rounded-[4px] ${
            errors.name ? 'border-red-500' : 'border-[#E4E4E7]'
          } bg-white`}
          value={name}
          onChange={e => {
            setName(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: '' }));
          }}
          onBlur={() => handleBlur('name')}
        />
        {errors.name && <p className="text-red-500 text-xs absolute bottom-0 left-0 font-inter">{errors.name}</p>}
      </div>

      <div className="space-y-[6px] relative pb-6">
        <label className="text-sm font-medium text-[#121316] font-inter">Email</label>
        <Input
          type="email"
          placeholder="mail@email.com"
          className={`h-[52px] px-2 py-[10px] flex items-center justify-center gap-[10px] w-full rounded-[4px] ${
            errors.email ? 'border-red-500' : 'border-[#E4E4E7]'
          } bg-white`}
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({ ...prev, email: '' }));
          }}
          onBlur={() => handleBlur('email')}
        />
        {errors.email && <p className="text-red-500 text-xs absolute bottom-0 left-0 font-inter">{errors.email}</p>}
      </div>

      <div className="space-y-[6px] relative pb-6">
        <label className="text-sm font-medium text-[#121316] font-inter">Password</label>
        <Input
          type="password"
          placeholder="Password"
          className={`h-[52px] px-2 py-[10px] flex items-center justify-center gap-[10px] w-full rounded-[4px] ${
            errors.password ? 'border-red-500' : 'border-[#E4E4E7]'
          } bg-white`}
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (e.target.value.trim()) {
              setErrors(prev => ({ ...prev, password: '' }));
              // Also update confirmPassword validation if it exists
              if (confirmPassword) {
                setErrors(prev => ({
                  ...prev,
                  confirmPassword: e.target.value === confirmPassword ? '' : 'Passwords do not match'
                }));
              }
            }
          }}
          onBlur={() => handleBlur('password')}
        />
        {errors.password && (
          <p className="text-red-500 text-xs absolute bottom-0 left-0 font-inter">{errors.password}</p>
        )}
      </div>

      <div className="space-y-[6px] relative pb-6">
        <label className="text-sm font-medium text-[#121316] font-inter">Re-Enter Password</label>
        <Input
          type="password"
          placeholder="Password"
          className={`h-[52px] px-2 py-[10px] flex items-center justify-center gap-[10px] w-full rounded-[4px] ${
            errors.confirmPassword ? 'border-red-500' : 'border-[#E4E4E7]'
          } bg-white`}
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value);
            if (e.target.value.trim()) {
              setErrors(prev => ({
                ...prev,
                confirmPassword: e.target.value === password ? '' : 'Passwords do not match'
              }));
            }
          }}
          onBlur={() => handleBlur('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs absolute bottom-0 left-0 font-inter">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="mt-[10px]">
        <Button
          type="submit"
          disabled={!isFormValid}
          className={`h-[52px] w-full py-[10px] px-4 flex justify-center items-center gap-[6px] rounded-[4px] ${
            isFormValid ? 'bg-[#F97917] hover:bg-[#F97917]/90' : 'bg-[rgba(249,121,23,0.5)] cursor-not-allowed'
          } text-white font-inter text-sm font-medium leading-5`}
        >
          Sign Up
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{' '}
        <a
          href="#"
          className="underline font-medium text-gray-900"
          onClick={e => {
            e.preventDefault();
            onToggleView();
          }}
        >
          Log In here
        </a>
      </p>
    </div>
  );
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]"
      style={{ isolation: 'isolate' }}
    >
      <div
        className={`bg-white rounded-xl p-6 w-[480px] ${
          isLogin ? 'h-[572px]' : 'h-[752px]'
        } flex flex-col items-start relative z-[100000]`}
      >
        <div className="w-full flex justify-center items-center relative mb-6">
          <h1 className="text-2xl font-semibold text-center text-[#121316] font-inter">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h1>
          <Image
            src={x.src}
            alt="Close"
            width={24}
            height={24}
            className="absolute right-0 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="space-y-6 w-full">
          <button className="h-[52px] w-full py-[10px] px-4 flex items-center justify-center gap-[6px] rounded-[4px] border border-[rgba(249,121,23,0.3)] bg-white hover:bg-gray-50 transition-colors">
            <Image src={google.src} alt="Google Logo" width={20} height={20} className="cursor-pointer" />
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

          <div>{isLogin ? <LoginForm onToggleView={toggleView} /> : <SignUpForm onToggleView={toggleView} />}</div>
        </div>
      </div>
    </div>
  );
}
