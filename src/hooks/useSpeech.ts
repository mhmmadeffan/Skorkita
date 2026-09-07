"use client";

import { useState, useEffect } from "react";
import type { LangKey } from "@/types/game.types";
import { LANG_KEYS } from "@/types/game.types";

export function useSpeech(voiceLang: LangKey | "", audioEnabled: boolean) {
  const [resolvedVoices, setResolvedVoices] = useState<Record<string, SpeechSynthesisVoice | null>>({});

  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const map: Record<string, SpeechSynthesisVoice | null> = {};
      for (const lang of LANG_KEYS) {
        map[lang] = all.find((v) => v.lang.toLowerCase().startsWith(lang.split("-")[0].toLowerCase())) ?? null;
      }
      setResolvedVoices(map);
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const speak = (text: string) => {
    if (!audioEnabled || !voiceLang) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = resolvedVoices[voiceLang] ?? null;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = voiceLang;
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}
