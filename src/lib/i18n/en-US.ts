import type { Dictionary } from "./pt-BR"

// English (en-US) chrome translations. Item names and GameVersion labels stay
// in pt-BR (proper nouns on the physical Estrela board) and are NOT here.
export const enUS: Dictionary = {
  // Categories (section titles)
  "category.suspects": "Suspects",
  "category.weapons": "Weapons",
  "category.places": "Places",

  // Item states
  "status.neutral.label": "Neutral",
  "status.neutral.description": "No mark",
  "status.doubt.label": "Doubt",
  "status.doubt.description": "Suspected to be the crime card",
  "status.eliminated.label": "Eliminated",
  "status.eliminated.description": "Card revealed — discarded",
  "status.discovered.label": "Discovered",
  "status.discovered.description": "Confirmed as the crime card",

  // Status modal
  "modal.description": "Mark this item's state.",

  // New game (reset)
  "reset.trigger": "New game",
  "reset.title": "Start a new game?",
  "reset.description":
    "This clears all marks for this version and returns every item to the neutral state. This action cannot be undone.",
  "reset.cancel": "Cancel",
  "reset.confirm": "New game",

  // Game-version selector
  "version.label": "Game version",

  // Language selector
  "language.label": "Language",

  // Settings menu (theme + language)
  "settings.label": "Settings",

  // Theme (light/dark mode)
  "theme.label": "Theme",
  "theme.system": "System",
  "theme.light": "Light",
  "theme.dark": "Dark",
}
