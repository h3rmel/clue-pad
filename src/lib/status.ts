import type { Category, ClueStatus } from "@/lib/types"

interface StatusMeta {
  /** Rótulo curto em pt-BR (badge / opção do modal). */
  label: string
  /** Descrição da opção no modal. */
  description: string
}

export const STATUS_ORDER: readonly ClueStatus[] = [
  "neutral",
  "doubt",
  "eliminated",
]

export const STATUS_META: Record<ClueStatus, StatusMeta> = {
  neutral: {
    label: "Neutro",
    description: "Sem marcação",
  },
  doubt: {
    label: "Dúvida",
    description: "Suspeita de ser a carta do crime",
  },
  eliminated: {
    label: "Eliminado",
    description: "Carta revelada — descartada",
  },
}

export const CATEGORY_LABEL: Record<Category, string> = {
  suspects: "Suspeitos",
  weapons: "Armas",
  places: "Lugares",
}

export const CATEGORY_ORDER: readonly Category[] = [
  "suspects",
  "weapons",
  "places",
]
