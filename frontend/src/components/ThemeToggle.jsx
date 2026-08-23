import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const applyTheme = (themeName) => {
  const isDark = themeName === 'dark';
  const root = document.documentElement;
  const body = document.body;

  if (isDark) {
    root.classList.add('dark');
    body.classList.add('dark');
    root.style.setProperty('--color-primary', '#09090b');
    root.style.setProperty('--color-surface', '#121215');
    root.style.setProperty('--color-surface-hover', '#1c1c21');
    root.style.setProperty('--color-border', '#27272a');
    root.style.setProperty('--color-text-primary', '#f4f4f5');
    root.style.setProperty('--color-text-secondary', '#a1a1aa');
    root.style.setProperty('--color-text-muted', '#71717a');
    root.style.setProperty('--color-accent-red', '#f87171');
    root.style.setProperty('--color-accent-green', '#34d399');
    root.style.setProperty('--color-accent-amber', '#fbbf24');
    root.style.setProperty('--color-accent-blue', '#60a5fa');
  } else {
    root.classList.remove('dark');
    body.classList.remove('dark');
    root.style.setProperty('--color-primary', '#ffffff');
    root.style.setProperty('--color-surface', '#ffffff');
    root.style.setProperty('--color-surface-hover', '#f4f4f5');
    root.style.setProperty('--color-border', '#e4e4e7');
    root.style.setProperty('--color-text-primary', '#09090b');
    root.style.setProperty('--color-text-secondary', '#52525b');
    root.style.setProperty('--color-text-muted', '#a1a1aa');
    root.style.setProperty('--color-accent-red', '#ef4444');
    root.style.setProperty('--color-accent-green', '#10b981');
    root.style.setProperty('--color-accent-amber', '#f59e0b');
    root.style.setProperty('--color-accent-blue', '#2563eb');
  }
  localStorage.setItem('theme', themeName);
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun size={14} className="text-accent-amber" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-text-secondary" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}
