// Registro de idiomas e utilidades de detecção/normalização.
// Abordagem leve (dicionário + Context), sem dependência externa, conforme SPEC-v2 §1.

import { ptBR, type Dictionary, type TranslationKey } from "./pt-BR"
import { enUS } from "./en-US"
import { es } from "./es"

export type { Dictionary, TranslationKey }

export type Locale = "pt-BR" | "en-US" | "es"

export const SUPPORTED_LOCALES: readonly Locale[] = ["pt-BR", "en-US", "es"]
export const DEFAULT_LOCALE: Locale = "pt-BR"

/** Dicionários por idioma. Todos compartilham o mesmo conjunto de chaves. */
export const dictionaries: Record<Locale, Dictionary> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  es,
}

/** Endônimos exibidos no seletor — não se traduzem (são o nome do idioma nele mesmo). */
export const LOCALE_LABEL: Record<Locale, string> = {
  "pt-BR": "Português",
  "en-US": "English",
  es: "Español",
}

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && SUPPORTED_LOCALES.includes(value as Locale)
  )
}

/** Normaliza um código de idioma arbitrário para um dos três suportados (fallback pt-BR). */
export function normalizeLocale(input: string | null | undefined): Locale {
  if (!input) return DEFAULT_LOCALE
  const lower = input.toLowerCase()
  if (lower.startsWith("pt")) return "pt-BR"
  if (lower.startsWith("en")) return "en-US"
  if (lower.startsWith("es")) return "es"
  return DEFAULT_LOCALE
}

/** Detecção de primeiro acesso a partir de navigator.language. */
export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE
  return normalizeLocale(navigator.language)
}
