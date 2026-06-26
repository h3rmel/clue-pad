# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

**MVP implemented.** The Vite + React + TypeScript app is scaffolded and the MVP is built per [docs/SPEC.md](docs/SPEC.md) and [docs/ROADMAP.md](docs/ROADMAP.md). `docs/SPEC.md` remains the authoritative source of truth; when extending the app, build against it and follow the stack and architecture below rather than inventing alternatives.

The spec docs under [docs/](docs/) are written in English, but the **product is Portuguese (pt-BR)**: UI strings, section titles, item names, and badge labels are all in Portuguese. Keep the product strings that way.

## What this is

`clue-pad` is a minimalist offline-first **PWA** that acts as a digital scorepad for the physical board game **Detetive** (the Brazilian Clue/Cluedo by Estrela). It is used *alongside* the physical board to track deductions. It is deliberately **not** a game engine: no rules logic, no guess validation, no knowledge of the solution, no accounts, no multiplayer, no sync, no backend.

## Stack

Vite · React 18+ · TypeScript · shadcn/ui (Radix + Tailwind) · Tailwind CSS · `vite-plugin-pwa` · **pnpm** · static SPA deploy (no backend, no env vars).

shadcn/ui components are generated via its CLI and committed under `src/components/ui`.

## Commands

Scaffolded with Vite + pnpm; the conventional scripts apply:

```bash
pnpm install        # install deps
pnpm dev            # Vite dev server
pnpm build          # production build (tsc + vite build)
pnpm preview        # serve the production build (needed to test PWA/service worker)
```

Test the PWA/service worker against `pnpm preview` (a real build), not the dev server.

## Core architecture

Read these together — the design hinges on how three concerns interlock: **game versions**, **per-item status**, and **version-segmented persistence**.

### Game versions are the central abstraction
Items (suspects/weapons/places) are **not** global constants. They belong to a selectable `GameVersion` (`src/lib/types.ts`), and the app loads exactly one version at a time. Switching version swaps both the item list **and** its assets. A central registry (`src/lib/games/index.ts`) exports an array of `GameVersion`. **Adding a new game edition = adding one `GameVersion` object + its asset folder, with zero UI changes.** Preserve this property; don't hardcode the initial `estrela-2020` items into components.

### Item status model
Every item is in exactly one of three states: `neutral` (default), `doubt` (suspected crime card), `eliminated` (revealed/discarded). Each has distinct, legible visual treatment (e.g. amber highlight for doubt, desaturated for eliminated). Tapping a card opens a modal (`Drawer` on mobile, `Dialog` on desktop is the suggested split) to pick the state; the modal shows the current state.

### Persistence (localStorage, segmented per version)
State lives in `localStorage`, versioned and **segmented by game version** so different editions' games never mix:
- `clue-pad:state:v1:<gameVersionId>` → `Record<itemId, ClueStatus>`
- `clue-pad:selectedVersion:v1` → last used `gameVersionId`

Save on every change. On boot, load the selected version and its state; missing/corrupt → all `neutral`. "Nova partida" resets only the active version's state (behind an `AlertDialog` confirmation). **Apply saved state before first paint** — no flash of unmarked cards.

### Dark mode (SPEC-v2 §2, implemented)
`ThemeProvider` in `src/state/theme.tsx` holds the user preference (`'system' | 'light' | 'dark'`, persisted to `clue-pad:theme:v1`) and resolves it to an effective theme, toggling the `dark` class on `<html>` and updating the `theme-color` meta. `system` reacts to live `prefers-color-scheme` changes via `matchMedia`. The theme tokens already existed in `src/index.css`; this only adds activation. **No-FOUC:** an inline script in `index.html` applies the `dark` class + theme-color *before* React mounts (same principle as applying saved clue state before first paint) — it reads the same `clue-pad:theme:v1` key, so keep that key and the `#0a0a0a`/`#ffffff` colors in sync between the script and `theme.tsx`. Header control is `ThemeSelect`: a `DropdownMenu` (radio group) with an icon trigger, listing the three options with the active one marked.

### i18n (SPEC-v2 §1, implemented)
UI chrome is translated via a lightweight dictionary + Context (no external lib). Dictionaries live in `src/lib/i18n/` (`pt-BR.ts` is the source of truth; its keys derive `TranslationKey`/`Dictionary`, so `en-US.ts` and `es.ts` are forced to cover every key at compile time). `src/state/i18n.tsx` exposes `useI18n().t(key)`, mirroring `state/clues.tsx`. **Only chrome is translated** — item names and `GameVersion.label` stay pt-BR and come from data, never the dictionary. Locale is auto-detected from `navigator.language` on first load (fallback `pt-BR`); a manual header selector overrides and persists to `clue-pad:locale:v1`. Components reference strings by key (e.g. `STATUS_LABEL_KEY`, `CATEGORY_LABEL_KEY` in `src/lib/status.ts`), not literals.

## Critical constraints

- **Never commit Estrela's official artwork.** The official art is copyrighted and must stay out of the repo. The repo ships generic **placeholders** (silhouettes/icons) using the *same filenames* under `public/games/<version>/` (e.g. `sr-marinho.png`); users drop in their own licensed files locally. Code does not distinguish placeholder from final art. If an asset fails to load, fall back to placeholder + name.
- **Item `id` must be a stable slug, not an index** (e.g. `'sr-marinho'`), so persisted state survives reordering of the items array.
- **Offline-first, no network at runtime.** The app must fully work offline during a match; service worker precaches the app shell + version assets.
- **Mobile-first, one-handed portrait use.** Airy grid, ~3 cards max per screen width, generous whitespace, large touch targets. Single scrolling page with the three sections stacked in order: Suspeitos → Armas → Lugares.

## Reference

[docs/SPEC.md](docs/SPEC.md) holds the full spec including the `estrela-2020` item lists (8 suspects / 8 weapons / 11 places), the suggested `src/` layout (§7), MVP acceptance criteria (§9), and open decisions (§10). Consult it before adding entities or changing data shapes.

[docs/SPEC-v2.md](docs/SPEC-v2.md) specs the **post-MVP** features (i18n pt-BR/en-US/es — UI chrome only, item names stay pt-BR; dark mode following system + toggle; placeholder asset refresh; UI/UX). New `localStorage` keys it introduces: `clue-pad:locale:v1`, `clue-pad:theme:v1`. **Phases 1 (i18n) and 2 (dark mode) are implemented** — see the notes under Core architecture; the remaining tracks (placeholder refresh, UI/UX incl. the 4th `discovered` state) are not yet built. [docs/ROADMAP-v2.md](docs/ROADMAP-v2.md) tracks phase progress.
