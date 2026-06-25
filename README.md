# clue-pad

> A minimalist, offline-first **PWA** that acts as a digital scorepad for the physical board game **Detetive** (the Brazilian Clue/Cluedo by Estrela).

`clue-pad` is used _alongside_ the physical board to track your deductions — suspects, weapons, and places — replacing the paper scorepad. It is deliberately **not** a game engine: no rules logic, no guess validation, no knowledge of the solution, no accounts, no multiplayer, no sync, no backend.

The product UI is **Portuguese (pt-BR)**, matching the physical game.

## Features

- **Single scrolling screen** with three stacked sections: Suspeitos → Armas → Lugares.
- **Three-state marking** per item — `neutral`, `doubt` (amber), `eliminated` (desaturated) — each with distinct, legible visual treatment.
- **Tap a card** to open a modal (`Drawer` on mobile, `Dialog` on desktop) and pick its state.
- **Game versions**: items and assets belong to a selectable `GameVersion`. Adding a new edition is a data-only change.
- **Per-version persistence** in `localStorage`, so games of different editions never mix.
- **"Nova partida"** resets the active version's state, behind a confirmation dialog.
- **Installable & fully offline** during a match (service worker precaches the app shell + version assets).
- **Mobile-first**, one-handed portrait use, with an airy grid (~3 cards per screen width).

## Tech stack

| Layer           | Choice                               |
| --------------- | ------------------------------------ |
| Build / dev     | Vite                                 |
| UI              | React 19 + TypeScript                |
| Components      | shadcn/ui (Radix + Tailwind)         |
| Styling         | Tailwind CSS v4                      |
| PWA             | `vite-plugin-pwa`                    |
| State           | React Context                        |
| Persistence     | `localStorage`                       |
| Package manager | pnpm                                 |
| Deploy          | Static SPA (no backend, no env vars) |

## Getting started

Requires [pnpm](https://pnpm.io/).

```bash
pnpm install        # install dependencies
pnpm dev            # start the Vite dev server
pnpm build          # production build (tsc + vite build)
pnpm preview        # serve the production build
pnpm lint           # type-check (tsc --noEmit)
```

> Test the PWA / service worker against `pnpm preview` (a real build), **not** the dev server.

## Project structure

```
src/
  lib/
    types.ts              # Category, ClueStatus, GameItem, GameVersion
    status.ts             # category order + status helpers
    storage.ts            # versioned, per-game localStorage load/save
    games/
      index.ts            # central registry of GameVersions
      estrela-2020.ts     # initial version: 8 suspects / 8 weapons / 11 places
  state/
    clues.tsx             # Context: active version + per-item status
  components/
    ui/                   # shadcn/ui (generated via CLI)
    VersionSelect.tsx · CategorySection.tsx · ClueGrid.tsx
    ClueCard.tsx · StatusModal.tsx · ResetButton.tsx
  App.tsx · main.tsx
public/
  games/estrela-2020/     # per-version assets (placeholders only — see below)
docs/
  SPEC.md                 # authoritative spec (English)
  ROADMAP.md              # MVP implementation roadmap
  SPEC-v2.md              # spec for planned features (i18n, dark mode, etc.)
  ROADMAP-v2.md           # implementation roadmap for the SPEC-v2 features
```

## Game versions

Items are **not** global constants — they belong to a `GameVersion`, and the app loads exactly one at a time. Switching versions swaps both the item list and its assets. The central registry in [src/lib/games/index.ts](src/lib/games/index.ts) exports an array of versions.

**Adding a new edition = adding one `GameVersion` object + its asset folder, with zero UI changes.**

## Assets & copyright

> ⚠️ **Estrela's official artwork is copyrighted and is NOT committed to this repository.**

The repo ships generic **placeholders** (silhouettes/icons) under `public/games/<version>/`, using the _same filenames_ the code expects (e.g. `sr-marinho.png`). If you own the licensed files, drop them into that folder locally — the code does not distinguish placeholder from final art. If an asset fails to load, it falls back to a generic icon plus the item's name.

## Persistence

State lives in `localStorage`, versioned and segmented by game version:

- `clue-pad:state:v1:<gameVersionId>` → `Record<itemId, ClueStatus>`
- `clue-pad:selectedVersion:v1` → last used `gameVersionId`

Saved on every change; applied before first paint (no flash of unmarked cards). Missing or corrupt data falls back to all `neutral`.

## Documentation

- [docs/SPEC.md](docs/SPEC.md) — full technical spec (source of truth, English).
- [docs/ROADMAP.md](docs/ROADMAP.md) — MVP implementation roadmap.
- [docs/SPEC-v2.md](docs/SPEC-v2.md) — spec for planned features (i18n, dark mode, asset refresh, UI/UX).
- [docs/ROADMAP-v2.md](docs/ROADMAP-v2.md) — implementation roadmap for the SPEC-v2 features.
