export type Team = "A" | "B";

export interface TeamConfig {
  id: Team;
  name: string;
}

export interface GameState {
  teamA: TeamConfig;
  teamB: TeamConfig;
  scoreA: number;
  scoreB: number;
  currentTurn: "A" | "B" | null;
  isStarted: boolean;
  isDarkMode: boolean;
  voiceLang: string;
  isAudioOn: boolean;
}

export type LangKey = "id-ID" | "en-US";

export interface ThemeConfig {
  ink: string;
  muted: string;
  paper: string;
  coral: string;
  teal: string;
}

export interface AudioState {
  isEnabled: boolean;
  selectedVoice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];
}

export const DEFAULT_TEAM_A: TeamConfig = { id: "A", name: "Team A" };
export const DEFAULT_TEAM_B: TeamConfig = { id: "B", name: "Team B" };
export const STORAGE_KEY = "skorkita-dark";
export const LANG_KEYS: LangKey[] = ["id-ID", "en-US"];
export const DEFAULT_LANG: LangKey = "id-ID";
