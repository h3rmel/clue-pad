import type { Category, ClueStatus } from "@/lib/types"
import type { TranslationKey } from "@/lib/i18n"

export const STATUS_ORDER: readonly ClueStatus[] = [
  "neutral",
  "doubt",
  "eliminated",
  "discovered",
]

/** Chave i18n do rótulo curto do estado (badge / opção do modal). */
export const STATUS_LABEL_KEY: Record<ClueStatus, TranslationKey> = {
  neutral: "status.neutral.label",
  doubt: "status.doubt.label",
  eliminated: "status.eliminated.label",
  discovered: "status.discovered.label",
}

/** Chave i18n da descrição do estado (opção do modal). */
export const STATUS_DESCRIPTION_KEY: Record<ClueStatus, TranslationKey> = {
  neutral: "status.neutral.description",
  doubt: "status.doubt.description",
  eliminated: "status.eliminated.description",
  discovered: "status.discovered.description",
}

/** Chave i18n do título de cada seção de categoria. */
export const CATEGORY_LABEL_KEY: Record<Category, TranslationKey> = {
  suspects: "category.suspects",
  weapons: "category.weapons",
  places: "category.places",
}

export const CATEGORY_ORDER: readonly Category[] = [
  "suspects",
  "weapons",
  "places",
]
