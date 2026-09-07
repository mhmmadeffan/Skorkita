"use client";

import { useEffect, useState, useRef } from "react";
import { LANG_KEYS } from "@/types/game.types";
import type { LangKey } from "@/types/game.types";

interface VoiceDropdownProps {
  value: LangKey | "";
  onChange: (lang: LangKey | "") => void;
  t: any;
}

export function VoiceDropdown({ value, onChange, t }: VoiceDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="voice-select" ref={ref}>
      <label>{t.voiceLabel}</label>
      <div className={`voice-select-trigger ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        <span>{value ? t.voiceOptions[value] : t.noVoiceOption}</span>
        <span className="chevron">▼</span>
      </div>
      {open && (
        <ul className="voice-select-options">
          <li className={value === "" ? "selected" : ""} onClick={() => { onChange(""); setOpen(false); }}>
            {t.noVoiceOption}
          </li>
          {LANG_KEYS.map((lang) => (
            <li key={lang} className={lang === value ? "selected" : ""} onClick={() => { onChange(lang); setOpen(false); }}>
              {t.voiceOptions[lang]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}