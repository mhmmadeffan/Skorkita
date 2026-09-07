"use client";

import { useEffect, useRef, useState } from "react";
import { TEXTS, getLangLabel } from "@/lib/i18n";
import { useTheme, ThemeToggle } from "@/components/ui/ThemeToggle";
import { VoiceDropdown } from "@/components/ui/VoiceDropdown";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useSpeech } from "@/hooks/useSpeech";
import type { Team, LangKey } from "@/types/game.types";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [teamA, setTeamA] = useState("Team A");
  const [teamB, setTeamB] = useState("Team B");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [audio, setAudio] = useState(true);
  const [voiceLang, setVoiceLang] = useState<LangKey | "">("id-ID");
  const [lastTeam, setLastTeam] = useState<Team | null>(null);
  const [dark, setDark] = useState(false);
  const restoredRef = useRef(false);

  const { toggleTheme, getSystemPreference } = useTheme();
  const storageKey = "skorkita-score-state";
  const { speak } = useSpeech(voiceLang, audio);
  const activeLang: LangKey = voiceLang || "id-ID";
  const t = TEXTS[activeLang];

  useEffect(() => {
    setDark(getSystemPreference());
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      restoredRef.current = true;
      return;
    }
    try {
      const state = JSON.parse(saved) as Partial<{
        started: boolean;
        teamA: string;
        teamB: string;
        scoreA: number;
        scoreB: number;
        audio: boolean;
        voiceLang: LangKey | "";
      }>;
      if (typeof state.started === "boolean") setStarted(state.started);
      if (typeof state.teamA === "string") setTeamA(state.teamA);
      if (typeof state.teamB === "string") setTeamB(state.teamB);
      if (typeof state.scoreA === "number" && state.scoreA >= 0) setScoreA(state.scoreA);
      if (typeof state.scoreB === "number" && state.scoreB >= 0) setScoreB(state.scoreB);
      if (typeof state.audio === "boolean") setAudio(state.audio);
      if (state.voiceLang === "" || state.voiceLang === "id-ID" || state.voiceLang === "en-US") setVoiceLang(state.voiceLang);
    } catch {
      localStorage.removeItem(storageKey);
    } finally {
      restoredRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    localStorage.setItem(storageKey, JSON.stringify({ started, teamA, teamB, scoreA, scoreB, audio, voiceLang }));
  }, [started, teamA, teamB, scoreA, scoreB, audio, voiceLang]);

  useEffect(() => {
    document.documentElement.lang = getLangLabel(activeLang);
  }, [activeLang]);

  useEffect(() => {
    toggleTheme(dark);
  }, [dark]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!started) return;
      const key = event.key.toLowerCase();
      if (key === "a" || key === "b") addScore(key.toUpperCase() as Team);
      if (key === "q" || key === "w") subtractScore(key === "q" ? "A" : "B");
      if (key === "r") reset();
      if (key === "m") setAudio((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function addScore(team: Team) {
    const nextA = team === "A" ? scoreA + 1 : scoreA;
    const nextB = team === "B" ? scoreB + 1 : scoreB;
    if (team === "A") setScoreA(nextA);
    else setScoreB(nextB);
    setLastTeam(team);
    window.setTimeout(() => setLastTeam(null), 450);
    speak(nextA === nextB ? t.tieSpeech(nextA) : `${teamA} ${nextA}, ${teamB} ${nextB}`);
  }

  const subtractScore = (team: Team) => {
    if (team === "A" && scoreA > 0) setScoreA(scoreA - 1);
    if (team === "B" && scoreB > 0) setScoreB(scoreB - 1);
  };

  const reset = () => {
    setScoreA(0);
    setScoreB(0);
    speak(t.resetSpeech);
  };

  const newGame = () => {
    setStarted(false);
    setScoreA(0);
    setScoreB(0);
    setTeamA("Team A");
    setTeamB("Team B");
  };

  const tToggleLabel = dark ? (activeLang.startsWith("id") ? "Mode Terang" : "Light Mode") : (activeLang.startsWith("id") ? "Mode Gelap" : "Dark Mode");

  if (!started) {
    return (
      <main className="setup-page">
        <div className="setup-header-actions">
          <LanguageToggle currentLang={activeLang} onChange={(lang) => setVoiceLang(lang)} />
          <ThemeToggle dark={dark} toggle={() => setDark(!dark)} label={tToggleLabel} />
        </div>
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        <section className="setup-card">
          <div className="brand"><span className="brand-mark">+</span><span>SkorKita</span></div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title1}<br /><em>{t.title2}</em></h1>
          <p className="intro">{t.intro}</p>
          <div className="form-grid">
            <label>{t.teamALabel}<input value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Team A" /></label>
            <label>{t.teamBLabel}<input value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Team B" /></label>
          </div>
          <VoiceDropdown value={voiceLang} onChange={setVoiceLang} t={t} />
          <div className="actions">
            <button className="secondary" onClick={() => speak(t.testVoiceSpeech)}>{t.testBtn}</button>
            <button className="primary" onClick={() => { setStarted(true); speak(t.gameStartedSpeech); }}>{t.startBtn} <span>→</span></button>
          </div>
          <p className="hint">{t.hint}</p>
        </section>
      <footer className="site-footer">
        <div className="copyright">© {new Date().getFullYear()} Muhammad Effan Choirunanda<br />All rights reserved.</div>
        <span className="social-links">
          <a className="social-button" href="https://instagram.com/mhmmadeffan" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg className="stroke-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
          <a className="social-button" href="https://github.com/mhmmadeffan" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg className="stroke-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>
        </span>
      </footer></main>
    );
  }

  return (
    <main className="game-page">
      <header className="game-header">
        <div className="brand"><span className="brand-mark">+</span><span>SkorKita</span></div>
        <div className="game-header-actions">
          <div className="live"><span /> {t.liveMatch}</div>
          <button className="exit" onClick={newGame}>{t.newGame} <span>↗</span></button>
          <LanguageToggle currentLang={activeLang} onChange={(lang) => setVoiceLang(lang)} />
          <ThemeToggle dark={dark} toggle={() => setDark(!dark)} label={tToggleLabel} />
        </div>
      </header>
      <section className="score-grid">
        <button className={`score-panel coral ${lastTeam === "A" ? "pulse" : ""}`} onClick={() => addScore("A")}>
          <span className="team-index">01 / A</span>
          <span className="team-name">{teamA}</span>
          <strong>{scoreA}</strong>
          <span className="tap">{t.tapToAdd} <b>+</b></span>
        </button>
        <button className={`score-panel teal ${lastTeam === "B" ? "pulse" : ""}`} onClick={() => addScore("B")}>
          <span className="team-index">02 / B</span>
          <span className="team-name">{teamB}</span>
          <strong>{scoreB}</strong>
          <span className="tap">{t.tapToAdd} <b>+</b></span>
        </button>
      </section>
      <footer className="control-bar">
        <div className="score-control"><button onClick={() => subtractScore("A")}>−</button><span>{teamA}</span></div>
        <div className="center-controls">
          <button onClick={reset}>{t.resetScore}</button>
          <button onClick={() => setAudio(!audio)}>{audio ? t.soundOn : t.soundOff} <span className={`toggle ${audio ? "on" : ""}`} /></button>
        </div>
        <div className="score-control right"><span>{teamB}</span><button onClick={() => subtractScore("B")}>−</button></div>
      </footer>
      <div className="keyboard">{t.keyboardHint}</div>
    <footer className="site-footer">
        <div className="copyright">© {new Date().getFullYear()} Muhammad Effan Choirunanda<br />All rights reserved.</div>
        <span className="social-links">
          <a className="social-button" href="https://instagram.com/mhmmadeffan" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg className="stroke-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
          <a className="social-button" href="https://github.com/mhmmadeffan" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg className="stroke-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>
        </span>
      </footer></main>
  );
}
