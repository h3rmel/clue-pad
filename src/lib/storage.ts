import type { ClueStatus, StatusMap } from "@/lib/types"

// Chaves versionadas e segmentadas por versão de jogo, para que partidas de
// edições diferentes nunca se misturem.
const STATE_PREFIX = "clue-pad:state:v1:"
const SELECTED_VERSION_KEY = "clue-pad:selectedVersion:v1"
const LOCALE_KEY = "clue-pad:locale:v1"

const VALID_STATUS: readonly ClueStatus[] = ["neutral", "doubt", "eliminated"]

function stateKey(versionId: string): string {
  return `${STATE_PREFIX}${versionId}`
}

function isClueStatus(value: unknown): value is ClueStatus {
  return typeof value === "string" && VALID_STATUS.includes(value as ClueStatus)
}

/**
 * Lê o mapa de status de uma versão. Ausente/corrompido → {} (tudo neutral).
 * Sanitiza entradas inválidas em vez de descartar o mapa inteiro.
 */
export function loadState(versionId: string): StatusMap {
  try {
    const raw = localStorage.getItem(stateKey(versionId))
    if (!raw) return {}

    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return {}

    const result: StatusMap = {}
    for (const [id, status] of Object.entries(parsed as Record<string, unknown>)) {
      // 'neutral' é o padrão implícito; não precisa ser persistido.
      if (isClueStatus(status) && status !== "neutral") {
        result[id] = status
      }
    }
    return result
  } catch {
    return {}
  }
}

/** Salva o mapa de status de uma versão (omitindo entradas 'neutral'). */
export function saveState(versionId: string, state: StatusMap): void {
  try {
    const compact: StatusMap = {}
    for (const [id, status] of Object.entries(state)) {
      if (status !== "neutral") compact[id] = status
    }
    localStorage.setItem(stateKey(versionId), JSON.stringify(compact))
  } catch {
    // Cota cheia / modo privado: persistência é best-effort.
  }
}

/** Remove o estado da versão (usado por "Nova partida"). */
export function clearState(versionId: string): void {
  try {
    localStorage.removeItem(stateKey(versionId))
  } catch {
    // ignore
  }
}

export function loadSelectedVersion(): string | null {
  try {
    return localStorage.getItem(SELECTED_VERSION_KEY)
  } catch {
    return null
  }
}

export function saveSelectedVersion(versionId: string): void {
  try {
    localStorage.setItem(SELECTED_VERSION_KEY, versionId)
  } catch {
    // ignore
  }
}

/**
 * Idioma escolhido manualmente. Preferência global (não segmentada por versão).
 * A validação do valor fica a cargo de quem lê (state/i18n).
 */
export function loadLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_KEY)
  } catch {
    return null
  }
}

export function saveLocale(locale: string): void {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    // ignore
  }
}
