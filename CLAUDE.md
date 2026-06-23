# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

**Greenfield.** The repository currently contains only [SPEC.md](SPEC.md) — there is no code, `package.json`, or scaffolding yet. SPEC.md is the authoritative source of truth; build against it. When scaffolding, follow the stack and architecture below rather than inventing alternatives.

The spec is written in Portuguese, and the product is Portuguese (pt-BR): UI strings, section titles, item names, and badge labels are all in Portuguese. Keep them that way.

## What this is

`clue-pad` is a minimalist offline-first **PWA** that acts as a digital scorepad for the physical board game **Detetive** (the Brazilian Clue/Cluedo by Estrela). It is used *alongside* the physical board to track deductions. It is deliberately **not** a game engine: no rules logic, no guess validation, no knowledge of the solution, no accounts, no multiplayer, no sync, no backend.

## Stack

Vite · React 18+ · TypeScript · shadcn/ui (Radix + Tailwind) · Tailwind CSS · `vite-plugin-pwa` · **pnpm** · static SPA deploy (no backend, no env vars).

shadcn/ui components are generated via its CLI and committed under `src/components/ui`.

## Commands

No `package.json` exists yet. Once scaffolded with Vite + pnpm, the conventional scripts apply:

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

## Critical constraints

- **Never commit Estrela's official artwork.** The official art is copyrighted and must stay out of the repo. The repo ships generic **placeholders** (silhouettes/icons) using the *same filenames* under `public/games/<version>/` (e.g. `sr-marinho.png`); users drop in their own licensed files locally. Code does not distinguish placeholder from final art. If an asset fails to load, fall back to placeholder + name.
- **Item `id` must be a stable slug, not an index** (e.g. `'sr-marinho'`), so persisted state survives reordering of the items array.
- **Offline-first, no network at runtime.** The app must fully work offline during a match; service worker precaches the app shell + version assets.
- **Mobile-first, one-handed portrait use.** Airy grid, ~3 cards max per screen width, generous whitespace, large touch targets. Single scrolling page with the three sections stacked in order: Suspeitos → Armas → Lugares.

## Reference

[SPEC.md](SPEC.md) holds the full spec including the `estrela-2020` item lists (8 suspects / 8 weapons / 11 places), the suggested `src/` layout (§7), MVP acceptance criteria (§9), and open decisions (§10). Consult it before adding entities or changing data shapes.
