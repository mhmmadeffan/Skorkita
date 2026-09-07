"use client";

import { useEffect, useState } from "react";
import { TEXTS, getLangLabel } from "@/lib/i18n";
import { useTheme, ThemeToggle } from "@/components/ui/ThemeToggle";
import { VoiceDropdown } from "@/components/ui/VoiceDropdown";
import { useSpeech } from "@/hooks/useSpeech";
import type { Team, LangKey } from "@/types/game.types";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [teamA, setTeamA] = useState("Team A");
  const [teamB, setTeamB] = useState("Team B");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [audio, setAudio] = useState(true);
  const [voiceLang, setVoiceLang] = useState<LangKey>("id-ID");
  const [lastTeam, setLastTeam] = useState<Team | null>(null);
  const [dark, setDark] = useState(false);

  const { toggleTheme, getSystemPreference } = useTheme();
  const { speak } = useSpeech(voiceLang, audio);
  const t = TEXTS[voiceLang];

  useEffect(() => {
    setDark(getSystemPreference());
  }, []);

  useEffect(() => {
    document.documentElement.lang = getLangLabel(voiceLang);
  }, [voiceLang]);

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
    speak(nextA === nextB ? t.tieSpeech(nextA) : t.scoreSpeech(team === "A" ? teamA : teamB, team === "A" ? nextA : nextB));
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

  const tToggleLabel = dark ? (voiceLang.startsWith("id") ? "Mode Terang" : "Light Mode") : (voiceLang.startsWith("id") ? "Mode Gelap" : "Dark Mode");

  if (!started) {
    return (
      <main className="setup-page">
        <ThemeToggle dark={dark} toggle={() => setDark(!dark)} label={tToggleLabel} />
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
      </main>
    );
  }

  return (
    <main className="game-page">
      <header className="game-header">
        <div className="brand"><span className="brand-mark">+</span><span>SkorKita</span></div>
        <div className="game-header-actions">
          <div className="live"><span /> {t.liveMatch}</div>
          <button className="exit" onClick={newGame}>{t.newGame} <span>↗</span></button>
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
    </main>
  );
}
