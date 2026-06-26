// Tipos centrais do clue-pad.
// As entidades pertencem a uma versão do jogo; nada aqui é fixo globalmente.

export type Category = "suspects" | "weapons" | "places"

export type ClueStatus = "neutral" | "doubt" | "eliminated" | "discovered"

export interface GameItem {
  /** Slug estável e único DENTRO da versão (ex: 'sr-marinho'). Nunca um índice. */
  id: string
  name: string
  category: Category
  /** Caminho do asset daquela versão (ex: '/games/estrela-2020/sr-marinho.png'). */
  image: string
}

export interface GameVersion {
  /** Ex: 'estrela-2020'. */
  id: string
  /** Rótulo exibido no seletor (ex: 'Detetive — Estrela (2020)'). */
  label: string
  items: GameItem[]
}

/** Mapa persistido por versão: itemId -> estado. */
export type StatusMap = Record<string, ClueStatus>
