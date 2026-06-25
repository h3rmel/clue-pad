# clue-pad — New features specification (SPEC v2)

> Continuation of [SPEC.md](SPEC.md) (MVP). Covers the features planned **after** the MVP.
> SPEC.md remains the product's source of truth; this document extends, it does not replace.

> **Language note:** this document is written in English, but the **product is Portuguese (pt-BR)**. Quoted UI strings, item names, and badge labels stay in Portuguese on purpose.

**Preserved principles:** offline-first, no backend, mobile-first, no game logic. No feature here introduces runtime network, accounts, or multiplayer.

---

## 0. Scope

Four planned tracks:

1. **Internationalization (i18n)** — pt-BR · en-US · es.
2. **Dark mode**.
3. **Item placeholder refresh** — colored backgrounds + item-specific icons.
4. **UI/UX improvements** — incl. a new `Descoberto` item state and a state-color rework.

Each track is independent and can be shipped on its own.

---

## 1. Internationalization (i18n)

### Translation scope
- **Only the application "chrome"** is translated: section titles, button labels, state-modal text, state badges, confirmation text ("Nova partida"), `aria-label`s, and the like.
- **Item names are NOT translated.** "Sr. Marinho", "Espingarda", "Restaurante", etc. are proper nouns printed on the physical Estrela board; translating them would make the app diverge from the card in the player's hand. They stay in pt-BR, coming from `GameItem.name`.
- `GameVersion.label` values also stay as-is (they are edition names).

### Languages
- `pt-BR` (default / fallback), `en-US`, `es`.

### Language selection
- **Auto-detection on first load** from `navigator.language` (normalized to one of the three supported; anything else → `pt-BR`).
- **Manual override** via a header selector.
- The choice is **persisted**; once manually chosen, it takes priority over auto-detection on subsequent loads.

### Data model / implementation
- **Lightweight approach, no heavy external dependency**, in the project's minimalist spirit: a typed per-language dictionary + an `I18nContext` (mirroring the `state/clues.tsx` pattern), exposing a `t(key)` helper.
  - Suggested layout: `src/lib/i18n/` with `pt-BR.ts`, `en-US.ts`, `es.ts`, `index.ts` (registry + `Locale` type) and `src/state/i18n.tsx` (Context).
  - The key type should be derived from `pt-BR` to guarantee, at compile time, that every language covers every key.
- Alternative, if the number of strings grows a lot: `react-i18next`. **Not recommended for the current volume** (few strings) as it adds weight and complexity.
- **Cross-cutting task:** externalize all strings currently hardcoded in pt-BR across the components (`StatusModal`, `ResetButton`, `CategorySection`, `VersionSelect`, `App`, `ClueCard` aria-labels) into the dictionary.

### Persistence
- New key: `clue-pad:locale:v1` → `'pt-BR' | 'en-US' | 'es'`.
- Independent of game state (not segmented by version).

---

## 2. Dark mode

### Current situation
The theme infrastructure **already exists** in [../src/index.css](../src/index.css): there's the `dark` custom variant and a complete set of `.dark` tokens (background, foreground, card, primary, etc.). **Only the activation mechanism is missing** — applying the `dark` class on the root element, a UI control, and persistence. There's no need to design a theme from scratch.

### Behavior
- **Default: follow the system** (`prefers-color-scheme`).
- **Manual toggle** in the header that overrides the system preference and is **persisted**.
- Three possible preference values: `'system' | 'light' | 'dark'`. `system` re-evaluates `prefers-color-scheme` (ideally reacting to live changes via `matchMedia`).

### Implementation
- A `ThemeProvider` (Context) that resolves the preference → effective theme and adds/removes the `dark` class on `<html>`.
- **No flash of the wrong theme (FOUC):** apply the theme **before first paint**, via a minimal inline script in `index.html` that reads the persistence key and sets the `dark` class on `<html>` before React mounts — same principle as the MVP's "apply saved state before first paint" (SPEC.md §8).
- Review **all item states** in the dark theme to ensure contrast and legibility — the amber (`doubt`), red (`eliminated`), and green (`discovered`) palettes in particular (the state set and palettes are defined in §4).
- Update the PWA manifest's `theme_color`/`background_color` if needed for the browser bar.

### Persistence
- New key: `clue-pad:theme:v1` → `'system' | 'light' | 'dark'`.

---

## 3. Item placeholder refresh

> **Unchanged constraint (SPEC.md §3):** Estrela's official art stays **outside the repository**. This track improves only the *generic placeholders*.

### Goal
Today every placeholder is the same: a gray background with a single generic icon. **Keep that simplicity, but give it life** — without copying any official art:

- **Colored background.** For suspects, use the suspect's color on the physical board (e.g. Mordomo James → blue, Srta. Rosa → pink, Dona Violeta → violet, Sr. Marinho → navy).
- **Item-referencing icon.** Each icon hints at the item itself instead of one generic glyph (e.g. scissors for "Tesoura", a skull for "Veneno", a building for a place).

The result stays a flat, generic, recognizable placeholder — just colored and themed per item.

### Invariants (unchanged)
- **Same 27 filenames** in `public/games/estrela-2020/` (the slugs).
- The code **does not distinguish** placeholder from final art.
- The fallback (generic icon + name) when an asset fails to load still applies.

### Implementation note — keep them as PNG files
Because the asset-slot invariant requires real files at the 27 paths (so a user can drop in licensed art *without any code change*), the colored/iconified placeholders must be produced **as the PNG files themselves** — not rendered at runtime from a color field on `GameItem` (that would force the code to distinguish placeholder from real art, which §3 of SPEC.md forbids). Suggested: a small **generation manifest/script** mapping `slug → { background color, icon }` so the 27 PNGs can be regenerated reproducibly. This manifest is build-/design-time tooling and does **not** enter the runtime data model.

### Guidelines
- Coherent visual style across categories; legible in both light and dark themes.
- Do not infringe copyright: nothing derived from Estrela's official art — colors and icons are generic references, not reproductions.
- Icon source decision open (see §6): an icon set (e.g. Lucide) vs. custom illustrations.
- Update `public/games/estrela-2020/README.md` if the style/origin changes.

### Open points (see §6)
- **Suspect color map** must be sourced from the physical board and defined per slug.
- **Weapons & places have no character color** — decide a per-category neutral/tinted background.
- **"Dona Branca" (white)** needs an off-white/bordered treatment so the card stays visible against a light theme.

---

## 4. UI/UX improvements

### 4.1 New item state — "Descoberto"

Add a **fourth** item state so a player can mark an item they're **certain** is the crime card. It overlaps conceptually with `doubt`, but for some players that certainty distinction is meaningful — that's an accepted, intentional redundancy.

- The status model goes from **3 → 4 states**: `neutral`, `doubt`, `eliminated`, `discovered` (pt-BR label **"Descoberto"**).
- **Ripple effects** (this is a core model change, not just styling):
  - `ClueStatus` union gains `'discovered'`.
  - `StatusModal` offers a 4th option.
  - SPEC.md §4 documents the built MVP with 3 states; this track extends that to 4.
  - **Persistence:** same key `clue-pad:state:v1:<gameVersionId>`, same shape; only the stored value set expands to include `'discovered'`. **Forward-compatible** — existing data (3 values) stays valid, **no key version bump**. The storage validator/fallback must accept the new value (see §5).
- Naming is **open** (see §6): "Descoberto" is the working label; alternatives include "Confirmado" or "Solução".

### 4.2 State color palettes

- `neutral` and `doubt` (amber) **stay as they are** — they work well.
- `eliminated` — replace the current dimmed/desaturated treatment with a **red** palette.
- `discovered` (new) — a **green** palette.
- Keep each state's **badge label** (and ideally a distinct icon), not color alone.

> ⚠️ **Accessibility — red/green caveat.** `eliminated` (red) and `discovered` (green) are the classic red-green colorblindness pair (deuteranopia/protanopia), and they're the two opposite-conclusion states, so confusing them is costly. **Mitigation:** rely on the existing badge **text** + a **distinct icon/shape** per state so the two are distinguishable without hue. Re-check contrast in both themes.

### 4.3 Header layout (mobile)

- The game-version `Select` should be **right-aligned** on mobile, not left — this improves the visual harmony of the header.
- The new controls from other tracks (language selector + theme toggle) also land in the header; group them sensibly (e.g. secondary options in a menu/sheet) so the mobile layout stays uncluttered.

### 4.4 Other candidates (lower priority)

- Polish state transitions (smooth change, touch feedback); review touch size, spacing, and name legibility over the image.
- Per-section counter (e.g. "3 em dúvida", "5 eliminados") — **TBD**.
- Fixed index/shortcut to jump between sections while scrolling — **TBD**.
- Keyboard-navigable modal; `aria-label`s already translated by the i18n track.

---

## 5. Persistence — new keys (summary)

They keep the `clue-pad:<thing>:v1` pattern. None is segmented by game version (they are global app preferences).

| Key | Value | Track |
|---|---|---|
| `clue-pad:locale:v1` | `'pt-BR' \| 'en-US' \| 'es'` | i18n |
| `clue-pad:theme:v1` | `'system' \| 'light' \| 'dark'` | dark mode |

`clue-pad:selectedVersion:v1` is unchanged. `clue-pad:state:v1:<id>` keeps the same name and shape, but its stored `ClueStatus` values **expand to include `'discovered'`** (see §4.1) — forward-compatible with existing data, **no version bump**; the storage validator must accept the new value (anything unrecognized still falls back to `neutral`).

---

## 6. Open decisions

- **i18n:** lightweight approach (dictionary + Context) vs. `react-i18next` — recommendation: lightweight. To confirm.
- **es:** use generic `es` or a specific variant (e.g. `es-ES`/`es-419`)? Suggestion: generic `es`.
- **Placeholders — suspect colors:** exact color per suspect slug, sourced from the physical board.
- **Placeholders — weapons & places:** they have no character color; pick a per-category neutral/tinted background.
- **Placeholders — icon source:** icon set (e.g. Lucide) vs. custom illustrations.
- **New state name:** "Descoberto" (working label) vs. "Confirmado" / "Solução".
- **Red/green accessibility:** confirm the icon/shape reinforcement is enough to distinguish `eliminated` (red) from `discovered` (green) for colorblind users (see §4.2).
- **Counters and section index:** include them in this iteration or defer?

---

## 7. Acceptance criteria (per track)

**i18n**
- [ ] Language auto-detected on first load; fallback `pt-BR`.
- [ ] Manual selector in the header; choice persists and takes priority.
- [ ] All chrome strings translated in the 3 languages; item names stay in pt-BR.
- [ ] Compile-time check that every language covers every key.

**Dark mode**
- [ ] Default follows `prefers-color-scheme`; manual toggle overrides and persists.
- [ ] No flash of the wrong theme on boot.
- [ ] All four item states legible and well-contrasted in both themes.

**Placeholders**
- [ ] New placeholders under the 27 correct filenames; PNG; official art outside the repo.
- [ ] Suspect backgrounds use the board color; weapons/places use the chosen per-category background.
- [ ] Each icon references its item (not a single generic glyph).
- [ ] Legible in light and dark themes; fallback working.

**UI/UX**
- [ ] Fourth state `discovered` ("Descoberto") selectable in the modal and persisted; existing data still loads.
- [ ] `eliminated` uses a red palette; `discovered` uses a green palette; `neutral`/`doubt` unchanged.
- [ ] Each state distinguishable without relying on hue alone (badge label + icon/shape).
- [ ] Game-version selector right-aligned on mobile.
