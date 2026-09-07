# SkorKita

**SkorKita** is a responsive, offline-friendly match score counter built with **Next.js App Router**, **Material UI**, **Framer Motion**, and **Tailwind CSS**. It provides a full-screen two-team scoreboard with bilingual voice announcements, keyboard controls, persistent match state, and dark/light themes.

## Overview

SkorKita supports tournaments, casual matches, and sports sessions such as badminton, futsal, table tennis, volleyball, and basketball. It focuses on fast score input, high visibility, and recovery after a browser refresh or temporary connectivity loss.

## Features

- **Two-team scoreboard**: Full-screen split layout. Tap/click either team panel to add a point.
- **Persistent scores**: Match state, team names, voice settings, and audio status are stored in `localStorage` under `skorkita-score-state`.
- **Voice announcements**: Uses Web Speech API. The scoring team is announced first, followed by opponent score.
- **Voice choices**: Indonesian (`id_ID`), US English (`en_US`), or voice disabled.
- **Bilingual UI**: Indonesian and English interface selector with country flags.
- **Dark/light theme**: System preference fallback and saved user preference.
- **Material UI controls**: Buttons, tooltips, snackbar feedback, and alerts.
- **Framer Motion**: Staggered spring entrance, animated score changes, hover, and tap interactions.
- **Keyboard shortcuts**:

| Key | Action |
| --- | --- |
| `A` | Add 1 point to Team A |
| `B` | Add 1 point to Team B |
| `Q` | Subtract 1 point from Team A |
| `W` | Subtract 1 point from Team B |
| `R` | Reset both scores |
| `M` | Toggle audio |

## Project Structure

- `src/app/layout.tsx` — Root metadata, SEO configuration, and document layout.
- `src/app/page.tsx` — Main match state, persistence, animation orchestration, and UI composition.
- `src/app/globals.css` — Theme tokens, responsive styling, Material UI overrides, and interaction styles.
- `src/components/ui/LanguageToggle.tsx` — Flag-based Indonesian/English selector.
- `src/components/ui/ThemeToggle.tsx` — Dark/light mode button and preference helper.
- `src/components/ui/VoiceDropdown.tsx` — Theme-aware custom voice selector.
- `src/hooks/useSpeech.ts` — Web Speech API voice loading and announcement logic.
- `src/lib/i18n.ts` — Indonesian and English text dictionaries.
- `src/types/game.types.ts` — Shared TypeScript types, language constants, and game defaults.

## Public Assets and SEO

- `public/dashboard.svg` — SkorKita dashboard logo.
- `public/instagram.svg` and `public/github.svg` — Footer social icons.
- `public/robots.txt` — Search crawler rules.
- `public/sitemap.xml` — Sitemap entry for the site homepage.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Material UI 9
- Framer Motion
- Web Speech API
- Browser `localStorage`
