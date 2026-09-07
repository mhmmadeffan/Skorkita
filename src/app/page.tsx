"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const restoredRef = useRef(false);

  const { toggleTheme, getSystemPreference } = useTheme();
  const storageKey = "skorkita-score-state";
  const { speak } = useSpeech(voiceLang, audio);
  const activeLang: LangKey = voiceLang || "id-ID";
  const t = TEXTS[activeLang];

  const containerVariants = {
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  } as const;

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as const;

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
    speak(nextA === nextB ? t.tieSpeech(nextA) : `${team === "A" ? teamA : teamB} ${team === "A" ? nextA : nextB}, ${team === "A" ? teamB : teamA} ${team === "A" ? nextB : nextA}`);
  }

  const subtractScore = (team: Team) => {
    if (team === "A" && scoreA > 0) setScoreA(scoreA - 1);
    if (team === "B" && scoreB > 0) setScoreB(scoreB - 1);
  };

  const reset = () => {
    setScoreA(0);
    setScoreB(0);
    speak(t.resetSpeech);
    setSnackbarMsg(t.resetSpeech);
    setSnackbarOpen(true);
  };

  const newGame = () => {
    setStarted(false);
    setScoreA(0);
    setScoreB(0);
    setTeamA("Team A");
    setTeamB("Team B");
  };

  const tToggleLabel = dark ? (activeLang.startsWith("id") ? "Mode Terang" : "Light Mode") : (activeLang.startsWith("id") ? "Mode Gelap" : "Dark Mode");

  const footerElement = (
    <footer className="site-footer">
      <span className="social-links" style={{ marginBottom: "12px" }}>
        <a className="social-button" href="https://instagram.com/mhmmadeffan" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <img src="/instagram.svg" alt="Instagram" width="16" height="16" className="social-icon" />
        </a>
        <a className="social-button" href="https://github.com/mhmmadeffan" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <img src="/github.svg" alt="GitHub" width="16" height="16" className="social-icon" />
        </a>
      </span>
      <div className="copyright">© {new Date().getFullYear()} Muhammad Effan Choirunanda<br />All rights reserved.</div>
    </footer>
  );

  if (!started) {
    return (
      <motion.main className="setup-page" initial="initial" animate="animate" exit="exit" variants={pageVariants}>
        <div className="setup-header-actions">
          <LanguageToggle currentLang={activeLang} onChange={(lang) => setVoiceLang(lang)} />
          <ThemeToggle dark={dark} toggle={() => setDark(!dark)} label={tToggleLabel} />
        </div>
        <motion.div className="ambient ambient-one" animate={{ x: [0, 18, 0], y: [0, -14, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="ambient ambient-two" animate={{ x: [0, -16, 0], y: [0, 15, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
        <motion.section className="setup-card" variants={containerVariants} initial="initial" animate="animate">
          <motion.div variants={itemVariants} className="brand"><span className="brand-mark">+</span><span>SkorKita</span></motion.div>
          <motion.p variants={itemVariants} className="eyebrow">{t.eyebrow}</motion.p>
          <motion.h1 variants={itemVariants}>{t.title1}<br /><em>{t.title2}</em></motion.h1>
          <motion.p variants={itemVariants} className="intro">{t.intro}</motion.p>
          <motion.div variants={itemVariants} className="form-grid">
            <label>{t.teamALabel}<input value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Team A" /></label>
            <label>{t.teamBLabel}<input value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Team B" /></label>
          </motion.div>
          <motion.div variants={itemVariants}><VoiceDropdown value={voiceLang} onChange={setVoiceLang} t={t} /></motion.div>
          <motion.div variants={itemVariants} className="actions">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button variant="outlined" className="secondary" onClick={() => speak(t.testVoiceSpeech)}>{t.testBtn}</Button></motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button variant="contained" className="primary" onClick={() => { setStarted(true); speak(t.gameStartedSpeech); }}>{t.startBtn} <span>→</span></Button></motion.div>
          </motion.div>
          <motion.p variants={itemVariants} className="hint">{t.hint}</motion.p>
        </motion.section>
        {footerElement}
      </motion.main>
    );
  }

  return (
    <motion.main className="game-page" initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <motion.header className="game-header" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="brand"><span className="brand-mark">+</span><span>SkorKita</span></div>
        <div className="game-header-actions">
          <div className="live"><span /> {t.liveMatch}</div>
        <Tooltip title={t.hint}><span><Button variant="outlined" className="exit" onClick={newGame}>{t.newGame} <span>↗</span></Button></span></Tooltip>
        <LanguageToggle currentLang={activeLang} onChange={(lang) => setVoiceLang(lang)} />
        <ThemeToggle dark={dark} toggle={() => setDark(!dark)} label={tToggleLabel} />
        </div>
      </motion.header>
      <section className="score-grid">
        <motion.button className={`score-panel coral ${lastTeam === "A" ? "pulse" : ""}`} whileHover={{ scale: 1.03, rotate: -0.3 }} whileTap={{ scale: 0.96 }} onClick={() => addScore("A")}>
          <span className="team-index">01 / A</span>
          <span className="team-name">{teamA}</span>
          <motion.strong key={scoreA} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 16 }}>{scoreA}</motion.strong>
          <span className="tap">{t.tapToAdd} <b>+</b></span>
        </motion.button>
        <motion.button className={`score-panel teal ${lastTeam === "B" ? "pulse" : ""}`} whileHover={{ scale: 1.03, rotate: 0.3 }} whileTap={{ scale: 0.96 }} onClick={() => addScore("B")}>
          <span className="team-index">02 / B</span>
          <span className="team-name">{teamB}</span>
          <motion.strong key={scoreB} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 16 }}>{scoreB}</motion.strong>
          <span className="tap">{t.tapToAdd} <b>+</b></span>
        </motion.button>
      </section>
      <footer className="control-bar">
        <div className="score-control"><Button variant="outlined" onClick={() => subtractScore("A")}>−</Button><span>{teamA}</span></div>
        <div className="center-controls">
          <Button variant="outlined" onClick={reset}>{t.resetScore}</Button>
          <Button variant="outlined" onClick={() => setAudio(!audio)}>{audio ? t.soundOn : t.soundOff} <span className={`toggle ${audio ? "on" : ""}`} /></Button>
        </div>
        <div className="score-control right"><span>{teamB}</span><Button variant="outlined" onClick={() => subtractScore("B")}>−</Button></div>
      </footer>
      <div className="keyboard">{t.keyboardHint}</div>
      {footerElement}
      <Snackbar open={snackbarOpen} autoHideDuration={2200} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="info" onClose={() => setSnackbarOpen(false)} variant="outlined">
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </motion.main>
  );
}
