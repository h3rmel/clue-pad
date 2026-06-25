# clue-pad — Technical Specification (SPEC)

> Digital PWA scorepad for the **Detetive** board game (Estrela).
> A quick-use companion during the physical match: replaces the paper scorepad.

> **Language note:** this document is written in English, but the **product is Portuguese (pt-BR)**. UI strings, section titles, item names, and badge labels quoted below stay in Portuguese on purpose — keep them that way.

---

## 1. Overview

`clue-pad` is a minimalist PWA used **alongside** the physical Detetive board. It shows suspects, weapons, and places and lets the player mark each item according to their deduction. There is no game logic, multiplayer, sync, or backend — it's an electronic scorepad, nothing more.

**Non-goals (out of scope):**

- Does not validate guesses or know the solution to the crime.
- No accounts, login, or cross-device sync.
- Does not replace the board, die, physical cards, or rules.
- No multiple players in the same app (each player uses their own).

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Build / dev | Vite |
| UI | React 18+ + TypeScript |
| Components | shadcn/ui (Radix + Tailwind) |
| Styling | Tailwind CSS |
| PWA | `vite-plugin-pwa` |
| State | React state + Context (or Zustand if it grows) |
| Persistence | localStorage |
| Package manager | pnpm |
| Deploy | static (SPA), no backend |

> shadcn/ui installed via CLI; components live in the repo (`src/components/ui`). Likely: `dialog`/`drawer`, `card`, `button`, `select`, `badge`, `alert-dialog`.

---

## 3. Entities and game versions

Entities are **not** fixed globally: they belong to a selectable **game version**. The app loads one version at a time; switching the version swaps items **and** assets.

### Version model

```ts
type Category = 'suspects' | 'weapons' | 'places';

interface GameItem {
  id: string;          // stable, unique slug within the version, e.g. 'sr-marinho'
  name: string;
  category: Category;
  image: string;       // path to THAT version's asset
}

interface GameVersion {
  id: string;          // e.g. 'estrela-2020'
  label: string;       // e.g. 'Detetive — Estrela (2020)'
  items: GameItem[];
}
```

A central version registry (e.g. `src/lib/games/index.ts`) exports an array of `GameVersion`. Adding a new version = adding an object + its asset folder. No UI logic changes.

### Initial version — `estrela-2020`

> Item names below are product content and stay in pt-BR.

**Suspeitos (8):** Sr. Marinho · Dona Branca · Srta. Rosa · Dona Violeta · Mordomo James · Tony Gourmet · Sérgio Soturno · Sargento Bigode

**Armas (8):** Arma Química · Espingarda · Pá · Faca · Veneno · Pé-de-cabra · Soco Inglês · Tesoura

**Lugares (11):** Restaurante · Prefeitura · Banco · Hospital · Mansão · Praça · Floricultura · Hotel · Cemitério · Estação de Trem · Boate

### Assets / images — IMPORTANT

**Estrela's official artwork is copyrighted and is NOT versioned in the repository.** The structure provides the *slot* for it:

```
public/games/estrela-2020/
  sr-marinho.png
  dona-branca.png
  ...
```

- The repo includes **placeholders** (generic icons / silhouettes) with the same filenames.
- A user who owns the licensed files replaces them locally in that folder.
- Each `GameItem`'s `image` points to that path; the code does not distinguish placeholder from final art.
- Fallback: if an asset fails to load, show a placeholder + name.

---

## 4. Item states

Each item has exactly one of three states:

| State | Meaning | Visual treatment (suggested) |
|---|---|---|
| `neutral` | Unmarked (initial default) | Neutral card |
| `doubt` | Suspected to be the crime card | Amber highlight + "Dúvida" badge |
| `eliminated` | Card revealed in a guess → discarded | Dimmed/desaturated + "Eliminado" badge |

Initial state of all items: `neutral`.

---

## 5. Layout and interaction

### Single scrolling screen
- **One page** with the three categories stacked: section **Suspeitos**, **Armas**, **Lugares**, in that order, each with a section title.
- No tabs. Vertical scroll navigation. (Optional post-MVP: a fixed index/shortcut to jump between sections.)

### Airy grid
- Card grid with **at most ~3 cards per screen width**, prioritizing breathing room and generous whitespace between elements.
- Mobile-first; cards with a large touch area (image + name).
- The card reflects the current state via color/badge/opacity.

### State selection
- **Tapping a card** opens a **modal** (`Dialog`, or `Drawer` on mobile) with the three options: Neutro · Dúvida · Eliminado.
- Selecting an option closes the modal and updates the card immediately.
- The modal indicates which is the current state.

### Game version selection
- A control (`Select`) at the top / header to pick the `GameVersion`.
- Switching version reloads items and assets and resets/segments the state (see §6).

### New match (reset)
- A **"Nova partida"** button resets all items to `neutral`, with an `AlertDialog` confirmation.

---

## 6. Persistence

- State saved in **localStorage**, versioned and **segmented by game version**:
  - key: `clue-pad:state:v1:<gameVersionId>` → `Record<itemId, ClueStatus>`
  - key: `clue-pad:selectedVersion:v1` → last used `gameVersionId`.
- On boot: read the selected version and its state; missing/corrupt → all `neutral`.
- Saved on every change.
- Switching version preserves each version's state separately (does not mix matches from different games).
- "Nova partida" clears only the active version's state.

---

## 7. Suggested architecture

```
src/
  lib/
    types.ts                 # Category, ClueStatus, GameItem, GameVersion
    games/
      index.ts               # version registry
      estrela-2020.ts        # items for the initial version
    storage.ts               # load/save localStorage (versioned + per game)
  state/
    clues.tsx                # Context/store: active version + per-item status
  components/
    ui/                      # shadcn/ui (generated by the CLI)
    VersionSelect.tsx
    CategorySection.tsx
    ClueGrid.tsx
    ClueCard.tsx
    StatusModal.tsx
    ResetButton.tsx
  App.tsx
  main.tsx
public/
  games/estrela-2020/        # assets (placeholders in the repo)
  manifest / PWA icons
```

> Item `id` must be a stable slug (not an index) so persistence survives reordering.

---

## 8. PWA / non-functional requirements

- **Installable**: manifest with name, 192/512 icons, theme, `display: standalone`.
- **Offline-first**: works 100% without network during the match; service worker precaching the app shell + the version(s)' assets.
- **Mobile-first**: the target is a phone held upright, one-handed use.
- **Fast boot**: apply saved state before first paint (no flash of unmarked cards).
- **Accessibility**: adequate contrast across the three states; keyboard-navigable modal; `aria-label` on the card indicating name + state.
- **No backend** and no environment variables.

---

## 9. Acceptance criteria (MVP)

- [ ] Single screen with the three sections (8 / 8 / 11 items of `estrela-2020`).
- [ ] Airy grid, ~3 cards per width, good whitespace.
- [ ] Tapping a card opens the modal with the 3 options.
- [ ] Selecting an option closes the modal and updates the card instantly.
- [ ] The three states have distinct, legible visual treatment.
- [ ] Functional game version selector (even with only one version registered).
- [ ] State persists across close/reopen, segmented by version.
- [ ] "Nova partida" resets the active version (with confirmation).
- [ ] App installable and usable offline.
- [ ] Assets via per-version slot; placeholders in the repo, official art outside the repo.

---

## 10. Open decisions

- Origin of the placeholders (Lucide, custom icons, generated illustrations).
- `Dialog` vs `Drawer` on mobile for the state selector (suggestion: `Drawer` on mobile, `Dialog` on desktop).
- Optional per-section counter (e.g. "3 in doubt") — outside the MVP.
- Fixed index/shortcut to jump between sections while scrolling — outside the MVP.
