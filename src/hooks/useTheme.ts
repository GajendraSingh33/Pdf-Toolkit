import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

export const useTheme = () => {
  const { theme, toggleTheme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return { theme, toggleTheme, isDark: theme === 'dark' };
};