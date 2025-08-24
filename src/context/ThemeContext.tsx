'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig } from '../types/theme';
import { getTheme } from '../config/themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  themeId: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
}

export function ThemeProvider({ children, initialTheme = 'background_remove' }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState(initialTheme);
  const [currentTheme, setCurrentTheme] = useState(() => getTheme(initialTheme));

  useEffect(() => {
    setCurrentTheme(getTheme(themeId));
  }, [themeId]);

  const setTheme = (newThemeId: string) => {
    setThemeId(newThemeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 