import type { Dictionary } from "./pt-BR"

// Spanish (es) chrome translations. Item names and GameVersion labels stay in
// pt-BR (proper nouns on the physical Estrela board) and are NOT here.
export const es: Dictionary = {
  // Categorías (títulos de las secciones)
  "category.suspects": "Sospechosos",
  "category.weapons": "Armas",
  "category.places": "Lugares",

  // Estados de los ítems
  "status.neutral.label": "Neutro",
  "status.neutral.description": "Sin marcar",
  "status.doubt.label": "Duda",
  "status.doubt.description": "Se sospecha que es la carta del crimen",
  "status.eliminated.label": "Eliminado",
  "status.eliminated.description": "Carta revelada — descartada",
  "status.discovered.label": "Descubierto",
  "status.discovered.description": "Confirmado como la carta del crimen",

  // Modal de estado
  "modal.description": "Marca el estado de este ítem.",

  // Nueva partida (reset)
  "reset.trigger": "Nueva partida",
  "reset.title": "¿Empezar una nueva partida?",
  "reset.description":
    "Esto borra todas las marcas de esta versión y devuelve todos los ítems al estado neutro. Esta acción no se puede deshacer.",
  "reset.cancel": "Cancelar",
  "reset.confirm": "Nueva partida",

  // Selector de versión del juego
  "version.label": "Versión del juego",

  // Selector de idioma
  "language.label": "Idioma",

  // Menú de configuración (tema + idioma)
  "settings.label": "Configuración",

  // Tema (modo claro/oscuro)
  "theme.label": "Tema",
  "theme.system": "Sistema",
  "theme.light": "Claro",
  "theme.dark": "Oscuro",
}
