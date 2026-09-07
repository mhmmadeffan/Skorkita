# SkorKita

**SkorKita** is a modern, fast, and responsive match score counter web application built with **Next.js (App Router)** and **Tailwind CSS**. It provides a real-time full-screen scoreboard experience with automatic voice announcements in Indonesian and English, keyboard shortcuts, and full light/dark theme support.

---

## 🎯 Overview & Purpose

SkorKita is designed for matches, tournaments, and sports sessions (badminton, futsal, table tennis, volleyball, basketball, etc.) where quick, clear, and visible score tracking is essential.

Key highlights:
- **Full-Screen Split View**: Large interactive panels for Team A and Team B.
- **Voice Announcements**: Built-in Speech Synthesis reads score updates and winner/tie statuses in real-time.
- **Bilingual Support**: Dynamic language switching between Indonesian (`id_ID`) and US English (`en_US`).
- **Dark & Light Mode**: Complete theme customization with persistent storage and system preference fallback.
- **Keyboard Shortcuts**: Effortless score control using physical keys.

---

## ⚡ Key Features

1. **Setup Screen**
   - Custom team names configuration.
   - Announcement voice and language selector (Indonesian / US English).
   - Instant audio test trigger.
   - Light/Dark mode toggle.

2. **Match / Live Scoreboard Screen**
   - High-contrast split panels with tap/click to score (+1).
   - Score deduction controls (-1) for both teams.
   - Instant score reset and new match setup transitions.
   - Audio announcement toggle (On / Off).
   - Visual pulse animation on score increment.

3. **Shortcuts**
   | Key | Action |
   | --- | --- |
   | `A` | +1 Team A |
   | `B` | +1 Team B |
   | `Q` | -1 Team A |
   | `W` | -1 Team B |
   | `R` | Reset Score |
   | `M` | Toggle Audio |

---

## 🧩 Components & Architecture

- **`src/app/layout.tsx`**: Root layout configuring metadata, SEO keywords, typography, and hydration handling.
- **`src/app/page.tsx`**: Main interactive client application managing game state, speech synthesis, theme state, keyboard event listeners, and bilingual dictionary (`TEXTS`).
  - **`VoiceDropdown`**: Custom accessible dropdown adhering to light/dark themes.
  - **`ThemeToggle`**: Dynamic switcher supporting `localStorage` persistence and `prefers-color-scheme`.
  - **Score Panels & Controls**: Interactive split views with active states and visual feedback.
- **`src/app/globals.css`**: Design tokens, color system (Coral & Teal palette), responsive grid layouts, animations, and dark mode transitions.
