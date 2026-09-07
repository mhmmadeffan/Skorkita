import type { LangKey } from "@/types/game.types";

export const TEXTS: Record<
  LangKey,
  {
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
  }
> = {
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

export function getLangLabel(lang: LangKey): "id" | "en" {
  return lang.startsWith("id") ? "id" : "en";
}
