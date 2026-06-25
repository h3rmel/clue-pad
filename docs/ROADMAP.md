# clue-pad — Implementation roadmap (MVP)

Step-by-step plan to build the MVP described in [SPEC.md](SPEC.md). Check off each item when done.

> Product strings (item names, section titles, badge labels, "Nova partida") are kept in pt-BR on purpose.

---

## Phase 0 — Scaffold & tooling
- [x] Initialize Vite + React + TypeScript project with pnpm
- [x] Configure Tailwind CSS (v4 via `@tailwindcss/vite`, directives in the global CSS)
- [x] Configure `@/` path alias (vite + tsconfig)
- [x] Initialize shadcn/ui via CLI (`components.json`, base theme, `button` smoke test)
- [x] Verify `pnpm dev` running (HTTP 200) and `pnpm build` clean

## Phase 1 — Data model & versions
- [x] `src/lib/types.ts` — `Category`, `ClueStatus`, `GameItem`, `GameVersion`
- [x] `src/lib/games/estrela-2020.ts` — 8 suspects / 8 weapons / 11 places, with stable slug `id` and `image` pointing to `/games/estrela-2020/<slug>.png`
- [x] `src/lib/games/index.ts` — central registry (array of `GameVersion`) + `getVersion(id)` helper

## Phase 2 — Persistence
- [x] `src/lib/storage.ts` — load/save with versioned, segmented keys:
  - `clue-pad:state:v1:<gameVersionId>` → `Record<itemId, ClueStatus>`
  - `clue-pad:selectedVersion:v1` → last `gameVersionId`
- [x] Robust fallback: missing/corrupt → all `neutral`

## Phase 3 — State (Context)
- [x] `src/state/clues.tsx` — Context with: active version, status map, `setStatus`, `resetActiveVersion`, `selectVersion`
- [x] Load saved state on initialization (before first paint, no flash)
- [x] Persist on every change; switching version preserves separate states

## Phase 4 — UI components
- [x] Generate shadcn: `card`, `button`, `badge`, `select`, `dialog`, `drawer`, `alert-dialog`
- [x] `ClueCard.tsx` — image + name, per-state visual treatment, `aria-label` (name + state), image fallback to placeholder
- [x] `ClueGrid.tsx` — airy grid (~3 per width, mobile-first)
- [x] `CategorySection.tsx` — section title + grid
- [x] `StatusModal.tsx` — `Drawer` on mobile / `Dialog` on desktop, 3 options (Neutro · Dúvida · Eliminado), indicates current state
- [x] `VersionSelect.tsx` — version selector in the header
- [x] `ResetButton.tsx` — "Nova partida" with `AlertDialog` confirmation
- [x] `App.tsx` — header (VersionSelect + ResetButton) + 3 stacked sections (Suspeitos → Armas → Lugares)

## Phase 5 — Assets / placeholders
- [x] Generate generic placeholders (silhouettes/icons) in `public/games/estrela-2020/` with the 27 correct filenames
- [x] Confirm official art is **not** committed (only placeholders in the repo)

## Phase 6 — PWA
- [x] Configure `vite-plugin-pwa` (manifest: name, theme, `display: standalone`)
- [x] 192/512 icons
- [x] Service worker precaching app shell + version assets
- [x] Test offline and installability via `pnpm build` + `pnpm preview`

## Phase 7 — Verification (acceptance criteria §9)
- [x] Single screen, 3 sections (8/8/11)
- [x] Airy grid ~3 per width
- [x] Tapping a card opens the modal; selecting updates instantly
- [x] 3 states visually distinct and legible
- [x] Functional version selector
- [x] State persists on reopen, segmented by version
- [x] "Nova partida" resets the active version (with confirmation)
- [x] `pnpm build` clean (tsc + vite) and lint without errors
