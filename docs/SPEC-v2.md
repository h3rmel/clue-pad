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
3. **Item placeholder refresh**.
4. **UI/UX improvements**.

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
- Review the three item states (`neutral`/`doubt`/`eliminated`) in the dark theme to ensure contrast and legibility of the amber highlight and the dimmed treatment.
- Update the PWA manifest's `theme_color`/`background_color` if needed for the browser bar.

### Persistence
- New key: `clue-pad:theme:v1` → `'system' | 'light' | 'dark'`.

---

## 3. Item placeholder refresh

> **Unchanged constraint (SPEC.md §3):** Estrela's official art stays **outside the repository**. This track improves only the *generic placeholders*.

### Goal
Replace the current placeholders (simple silhouettes) with generic placeholders of better quality/visual coherence, keeping:
- **The same filenames** in `public/games/estrela-2020/` (the 27 slugs).
- The fact that the code **does not distinguish** placeholder from final art.
- The fallback (generic icon + name) when an asset fails to load.

### Guidelines
- Visual style coherent across categories (e.g. icons/silhouettes with uniform treatment), legible in both the light and dark themes.
- Do not infringe copyright: nothing derived from Estrela's official art.
- Origin decision open (see §6): an icon set (e.g. Lucide), custom illustrations, or generated.
- Update `public/games/estrela-2020/README.md` if the style/origin changes.

---

## 4. UI/UX improvements

> This section is a **list of candidates** to refine and prioritize — not a closed set. Items marked "TBD" need a product decision before implementing.

### Header
- Accommodate the new controls (language selector + theme toggle) alongside `VersionSelect` and `ResetButton` without cluttering the mobile layout. Consider grouping secondary options in a menu/sheet.

### Cards and states
- Polish the visual treatment of the three states (smooth transitions when changing state; touch feedback).
- Review touch size, spacing, and legibility of the name over the image.

### Possible additions (post-MVP, already noted in SPEC.md §10)
- Per-section counter (e.g. "3 in doubt", "5 eliminated") — **TBD**.
- Fixed index/shortcut to jump between sections while scrolling — **TBD**.

### Accessibility
- Ensure adequate contrast of the three states in both themes.
- Keyboard-navigable modal; `aria-label`s already translated by the i18n track.

> ⚠️ **Pending from the user:** detail which UI/UX changes are priorities (e.g. header redesign, animations, counters). Without this, this track stays an exploratory backlog.

---

## 5. Persistence — new keys (summary)

They keep the `clue-pad:<thing>:v1` pattern. None is segmented by game version (they are global app preferences).

| Key | Value | Track |
|---|---|---|
| `clue-pad:locale:v1` | `'pt-BR' \| 'en-US' \| 'es'` | i18n |
| `clue-pad:theme:v1` | `'system' \| 'light' \| 'dark'` | dark mode |

The MVP keys (`clue-pad:state:v1:<id>`, `clue-pad:selectedVersion:v1`) remain unchanged.

---

## 6. Open decisions

- **i18n:** lightweight approach (dictionary + Context) vs. `react-i18next` — recommendation: lightweight. To confirm.
- **es:** use generic `es` or a specific variant (e.g. `es-ES`/`es-419`)? Suggestion: generic `es`.
- **Placeholders:** origin of the new set (Lucide / custom illustration / generation).
- **UI/UX:** priority list to be defined by the user (see §4).
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
- [ ] Three item states legible and well-contrasted in both themes.

**Placeholders**
- [ ] New placeholders under the 27 correct filenames; official art outside the repo.
- [ ] Legible in light and dark themes; fallback working.

**UI/UX**
- [ ] (TBD per the §4 prioritization.)
