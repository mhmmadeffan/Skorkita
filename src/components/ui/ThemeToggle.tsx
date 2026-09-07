"use client";

import { STORAGE_KEY } from "@/types/game.types";

interface ThemeToggleProps {
  dark: boolean;
  toggle: () => void;
  label: string;
}

export function ThemeToggle({ dark, toggle, label }: ThemeToggleProps) {
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
    >
      {dark ? "☀️ " + label : "🌙 " + label}
    </button>
  );
}

export function useTheme() {
  const toggleTheme = (dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, String(dark));
  };

  const getSystemPreference = () => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  return { toggleTheme, getSystemPreference };
}
