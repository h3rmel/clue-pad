# clue-pad — Implementation roadmap (v2 / post-MVP)

Step-by-step plan to build the features specified in [SPEC-v2.md](SPEC-v2.md). Check off each item when done.

> Product strings (item names, section titles, badge labels, "Nova partida", "Descoberto") are kept in pt-BR on purpose.
> The four tracks are **independent** and can be shipped separately — phase order is a suggestion, not a hard dependency. The only soft coupling: dark mode and the placeholder refresh both want to review the state palettes, so doing the state-color rework (Phase 3) before them helps.

---

## Phase 1 — i18n (SPEC-v2 §1)
- [x] `src/lib/i18n/` — `pt-BR.ts`, `en-US.ts`, `es.ts` dictionaries + `index.ts` (registry + `Locale` type)
- [x] Derive the key type from `pt-BR` so every language must cover every key (compile-time check)
- [x] `src/state/i18n.tsx` — `I18nContext` exposing `t(key)` (mirror the `state/clues.tsx` pattern)
- [x] First-load auto-detection from `navigator.language`, normalized to one of the 3 (fallback `pt-BR`)
- [x] Header language selector (manual override, takes priority over detection)
- [x] Persist choice in `clue-pad:locale:v1`; apply on boot
- [x] Externalize all hardcoded pt-BR strings: `StatusModal`, `ResetButton`, `CategorySection`, `VersionSelect`, `App`, `ClueCard` aria-labels
- [x] Confirm item names + `GameVersion.label` stay in pt-BR (not translated)

## Phase 2 — Dark mode (SPEC-v2 §2)
- [x] `ThemeProvider` (Context): resolve `'system' | 'light' | 'dark'` → effective theme, toggle `dark` class on `<html>`
- [x] `system` reacts to live `prefers-color-scheme` changes via `matchMedia`
- [x] Header theme toggle
- [x] Persist preference in `clue-pad:theme:v1`
- [x] No-FOUC inline script in `index.html` (apply theme before React mounts)
- [x] Update PWA manifest `theme_color`/`background_color` if needed
- [ ] Verify all four item states are legible/contrasted in dark theme (do after Phase 3)

## Phase 3 — New state + color rework (SPEC-v2 §4.1–4.2)
- [x] Add `'discovered'` to the `ClueStatus` union (`src/lib/types.ts`)
- [x] `StatusModal` offers the 4th option ("Descoberto"); modal still shows current state
- [x] `storage` validator/fallback accepts `'discovered'`; unrecognized → `neutral` (no key version bump)
- [x] Verify existing saved games (3-value data) still load
- [x] `eliminated` → red palette (replace current dimmed/desaturated treatment)
- [x] `discovered` → green palette; `neutral`/`doubt` (amber) unchanged
- [x] Each state distinguishable without hue alone: badge label + distinct icon/shape (red/green colorblind mitigation)

## Phase 4 — Placeholder refresh (SPEC-v2 §3)
- [ ] Define the suspect color map (per slug, sourced from the physical board)
- [ ] Decide per-category background for weapons & places (no character color)
- [ ] Off-white/bordered treatment for "Dona Branca" (white) so it stays visible on light theme
- [ ] Pick icon source (Lucide set vs. custom)
- [ ] Generation manifest/script: `slug → { background color, icon }` (build/design-time, not runtime model)
- [ ] Regenerate the 27 PNGs at the same filenames in `public/games/estrela-2020/`
- [ ] Confirm: PNG only, code does NOT distinguish placeholder from final art, fallback still works
- [ ] Legible in light and dark themes
- [ ] Update `public/games/estrela-2020/README.md` if style/origin changed; official art stays out of the repo

## Phase 5 — Header layout / mobile polish (SPEC-v2 §4.3–4.4)
- [x] Game-version `Select` right-aligned on mobile
- [x] Fit language selector + theme toggle into the header without clutter (group secondary options, e.g. menu/sheet)
- [x] Polish state transitions (smooth change, touch feedback); review touch size, spacing, name legibility
- [ ] (Optional) per-section counter — **TBD**
- [ ] (Optional) fixed section index/shortcut — **TBD**

## Phase 6 — Verification (acceptance criteria, SPEC-v2 §7)
- [ ] i18n: auto-detect + manual override + persist; all chrome translated in 3 languages; item names stay pt-BR; compile-time key coverage
- [ ] Dark mode: default follows system; toggle overrides + persists; no boot flash; 4 states contrasted in both themes
- [ ] Placeholders: 27 correct filenames (PNG); suspect/board colors + per-category backgrounds; item-referencing icons; official art outside repo
- [ ] UI/UX: 4th state selectable + persisted (old data loads); red `eliminated` / green `discovered`; distinguishable without hue; version selector right-aligned on mobile
- [ ] `pnpm build` clean (tsc + vite) and lint without errors
