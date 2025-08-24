'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/src/context/ThemeContext';
import { getAllThemes } from '@/src/config/themes';
import { getRouteByTheme } from '@/src/config/routes';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setTheme } = useTheme();
  const router = useRouter();
  const themes = getAllThemes();

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    const routePath = getRouteByTheme(themeId);
    router.push(`/${routePath}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-lg hover:bg-white transition-all"
        >
          <span className="text-sm font-medium text-gray-700">
            {currentTheme.name}
          </span>
          <svg
            className={`w-4 h-4 ml-2 inline-block transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                选择主题
              </div>
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    currentTheme.id === theme.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {theme.heroMain.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 