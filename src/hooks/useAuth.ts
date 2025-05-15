'use client'

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

// Theme hook
export function useTheme() {
  // Get theme from localStorage or default to 'light'
  const getInitialTheme = (): 'light' | 'dark' | 'system' => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      if (storedTheme) {
        return storedTheme;
      }
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'system';
      }
    }
    
    return 'light';
  };
  
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('light');
  
  // Initialize the state with the correct value after mount
  useEffect(() => {
    setThemeState(getInitialTheme());
  }, []);
  
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Initialize theme on mount
  useEffect(() => {
    const currentTheme = getInitialTheme();
    
    if (currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  return { theme, setTheme };
}

// Custom hook to check if user is authenticated
export function useIsAuthenticated() {
  const { user, loading } = useAuthStore();
  
  return {
    isAuthenticated: !!user,
    loading,
    user
  };
}
