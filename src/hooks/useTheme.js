'use client';

import { useState, useEffect, useCallback } from 'react';
import { getThemeFromTimeOfDay, applyTheme } from '@/lib/theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => getThemeFromTimeOfDay());

  useEffect(() => {
    const syncTheme = () => {
      const next = getThemeFromTimeOfDay();
      setTheme(next);
      applyTheme(next);
    };

    syncTheme();
    localStorage.removeItem('theme');

    const interval = setInterval(syncTheme, 60_000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
