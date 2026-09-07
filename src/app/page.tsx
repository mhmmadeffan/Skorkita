"use client";

import { useEffect, useState, useRef } from "react";

type Team = "A" | "B";
type Voice = SpeechSynthesisVoice;
type LangKey = "id-ID" | "en-US";

const TEXTS: Record<LangKey, {
  eyebrow: string;
  title1: string;
  title2: string;
  intro: string;
  teamALabel: string;
  teamBLabel: string;
  voiceLabel: string;
  testBtn: string;
  startBtn: string;
  hint: string;
  liveMatch: string;
  newGame: string;
  tapToAdd: string;
  resetScore: string;
  soundOn: string;
  soundOff: string;
  keyboardHint: string;
  testVoiceSpeech: string;
  gameStartedSpeech: string;
  tieSpeech: (score: number) => string;
  scoreSpeech: (team: string, score: number) => string;
  resetSpeech: string;
  voiceOptions: Record<LangKey, string>;
}> = {
  "id-ID": {
    eyebrow: "KONTROL PERTANDINGAN / 01",
    title1: "Siap untuk",
    title2: "bertanding?",
    intro: "Atur nama tim, pilih preferensi suara, lalu fokus pada permainan.",
    teamALabel: "Nama tim A",
    teamBLabel: "Nama tim B",
    voiceLabel: "Suara pengumuman",
    testBtn: "Dengarkan tes",
    startBtn: "Mulai pertandingan",
    hint: "Tip: gunakan tombol A dan B untuk menambah skor dengan cepat.",
    liveMatch: "PERTANDINGAN LANGSUNG",
    newGame: "Game baru",
    tapToAdd: "TAP UNTUK MENAMBAH",
    resetScore: "Reset skor",
    soundOn: "Suara aktif",
    soundOff: "Suara mati",
    keyboardHint: "A / B tambah skor • Q / W kurangi • R reset • M suara",
    testVoiceSpeech: "Halo, ini tes suara SkorKita",
    gameStartedSpeech: "Pertandingan dimulai",
    tieSpeech: (score: number) => `Skor sama ${score}`,
    scoreSpeech: (team: string, score: number) => `${team} ${score}`,
    resetSpeech: "Skor telah direset ke nol",
    voiceOptions: {
      "id-ID": "Indonesia Indonesia (id_ID)",
      "en-US": "Inggris Amerika Serikat (en_US)",
    },
  },
  "en-US": {
    eyebrow: "MATCH CONTROL / 01",
    title1: "Ready to",
    title2: "compete?",
    intro: "Set team names, choose voice preferences, and stay focused on the game.",
    teamALabel: "Team A Name",
    teamBLabel: "Team B Name",
    voiceLabel: "Announcement Voice",
    testBtn: "Test audio",
    startBtn: "Start match",
    hint: "Tip: press A and B keys to add score quickly.",
    liveMatch: "LIVE MATCH",
    newGame: "New game",
    tapToAdd: "TAP TO ADD",
    resetScore: "Reset score",
    soundOn: "Audio on",
    soundOff: "Audio off",
    keyboardHint: "A / B add score • Q / W subtract • R reset • M mute audio",
    testVoiceSpeech: "Hello, this is a voice test for SkorKita",
    gameStartedSpeech: "Match started",
    tieSpeech: (score: number) => `Score tied at ${score}`,
    scoreSpeech: (team: string, score: number) => `${team} ${score}`,
    resetSpeech: "Score has been reset to zero",
    voiceOptions: {
      "id-ID": "Indonesian Indonesia (id_ID)",
      "en-US": "English United States (en_US)",
    },
  },
};

const LANG_KEYS: LangKey[] = ["id-ID", "en-US"];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [teamA, setTeamA] = useState("Team A");
  const [teamB, setTeamB] = useState("Team B");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [audio, setAudio] = useState(true);
  const [voiceLang, setVoiceLang] = useState<LangKey>("id-ID");
  const [resolvedVoices, setResolvedVoices] = useState<Record<string, Voice | null>>({});
  const [lastTeam, setLastTeam] = useState<Team | null>(null);

  const [dark, setDark] = useState(false);

  const t = TEXTS[voiceLang];

  useEffect(() => {
    document.documentElement.lang = voiceLang.startsWith("id") ? "id" : "en";
  }, [voiceLang]);

  useEffect(() => {
    const saved = localStorage.getItem("skorkita-dark");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (saved !== null) setDark(saved === "true");
    else setDark(mq.matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("skorkita-dark", String(dark));
  }, [dark]);

  const toggleLabel = dark ? (voiceLang.startsWith("id") ? "Mode Terang" : "Light Mode") : (voiceLang.startsWith("id") ? "Mode Gelap" : "Dark Mode");
  const ThemeToggle = () => <button className="theme-toggle" onClick={() => setDark((v) => !v)} aria-label={toggleLabel}>{dark ? "☀️ " + toggleLabel : "🌙 " + toggleLabel}</button>;

  function VoiceDropdown({ value, onChange, t }: { value: LangKey; onChange: (lang: LangKey) => void; t: typeof TEXTS[LangKey] }) {
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
          <span>{t.voiceOptions[value]}</span>
          <span className="chevron">▼</span>
        </div>
        {open && (
          <ul className="voice-select-options">
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

  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const map: Record<string, Voice | null> = {};
      for (const lang of LANG_KEYS) {
        map[lang] = all.find((v) => v.lang.toLowerCase().startsWith(lang.split("-")[0].toLowerCase())) ?? null;
      }
      setResolvedVoices(map);
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!started) return;
      const key = event.key.toLowerCase();
      if (key === "a" || key === "b") addScore(key.toUpperCase() as Team);
      if (key === "q" || key === "w") subtractScore(key === "q" ? "A" : "B");
      if (key === "r") reset();
      if (key === "m") setAudio((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const selectedVoice = resolvedVoices[voiceLang] ?? null;

  function speak(text: string) {
    if (!audio) return;
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = voiceLang;
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function addScore(team: Team) {
    if (team === "A") setScoreA((value) => value + 1);
    else setScoreB((value) => value + 1);
    setLastTeam(team);
    window.setTimeout(() => setLastTeam(null), 450);
    const nextA = team === "A" ? scoreA + 1 : scoreA;
    const nextB = team === "B" ? scoreB + 1 : scoreB;
    const scoringName = team === "A" ? teamA : teamB;
    const scoringScore = team === "A" ? nextA : nextB;
    speak(nextA === nextB ? t.tieSpeech(nextA) : t.scoreSpeech(scoringName, scoringScore));
  }

  function subtractScore(team: Team) {
    if (team === "A" && scoreA > 0) setScoreA((value) => value - 1);
    if (team === "B" && scoreB > 0) setScoreB((value) => value - 1);
  }

  function reset() {
    setScoreA(0);
    setScoreB(0);
    speak(t.resetSpeech);
  }

  function newGame() {
    setStarted(false);
    setScoreA(0);
    setScoreB(0);
    setTeamA("Team A");
    setTeamB("Team B");
  }

  if (!started) {
    return (
      <main className="setup-page">
        <ThemeToggle />
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        <section className="setup-card">
          <div className="brand"><span className="brand-mark">+</span><span>SkorKita</span></div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title1}<br /><em>{t.title2}</em></h1>
          <p className="intro">{t.intro}</p>
          <div className="form-grid">
            <label>{t.teamALabel}<input value={teamA} onChange={(event) => setTeamA(event.target.value)} placeholder="Team A" /></label>
            <label>{t.teamBLabel}<input value={teamB} onChange={(event) => setTeamB(event.target.value)} placeholder="Team B" /></label>
          </div>
          <VoiceDropdown value={voiceLang} onChange={setVoiceLang} t={t} />
          <div className="actions">
            <button className="secondary" onClick={() => speak(t.testVoiceSpeech)}>{t.testBtn}</button>
            <button className="primary" onClick={() => { setStarted(true); speak(t.gameStartedSpeech); }}>
              {t.startBtn} <span>→</span>
            </button>
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
          <ThemeToggle />
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
        <div className="score-control">
          <button onClick={() => subtractScore("A")}>−</button>
          <span>{teamA}</span>
        </div>
        <div className="center-controls">
          <button onClick={reset}>{t.resetScore}</button>
          <button onClick={() => setAudio((value) => !value)}>
            {audio ? t.soundOn : t.soundOff} <span className={`toggle ${audio ? "on" : ""}`} />
          </button>
        </div>
        <div className="score-control right">
          <span>{teamB}</span>
          <button onClick={() => subtractScore("B")}>−</button>
        </div>
      </footer>
      <div className="keyboard">
        {t.keyboardHint}
      </div>
    </main>
  );
}
