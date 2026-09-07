"use client";

import { useEffect, useRef, useState } from "react";
import type { LangKey } from "@/types/game.types";

interface LanguageToggleProps {
  currentLang: LangKey;
  onChange: (lang: LangKey) => void;
}

export function LanguageToggle({ currentLang, onChange }: LanguageToggleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { key: LangKey; label: string; flag: string }[] = [
    { key: "id-ID", label: "Indonesia", flag: "🇮🇩" },
    { key: "en-US", label: "English", flag: "🇺🇸" },
  ];

  const currentOption = options.find((opt) => opt.key === currentLang) ?? options[0];

  return (
    <div className="language-selector-wrap" ref={ref}>
      <button
        type="button"
        className="language-toggle-btn"
        onClick={() => setOpen(!open)}
        aria-label="Select Language"
      >
        <span>{currentOption.flag}</span>
        <span className="lang-code">{currentOption.key === "id-ID" ? "ID" : "EN"}</span>
        <span className="lang-arrow">▾</span>
      </button>

      {open && (
        <ul className="language-dropdown-menu">
          {options.map((option) => (
            <li
              key={option.key}
              className={option.key === currentLang ? "selected" : ""}
              onClick={() => {
                onChange(option.key);
                setOpen(false);
              }}
            >
              <span className="flag-icon">{option.flag}</span>
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
