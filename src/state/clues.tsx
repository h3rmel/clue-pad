import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { ClueStatus, GameVersion, StatusMap } from "@/lib/types"
import { getVersion } from "@/lib/games"
import {
  clearState,
  loadSelectedVersion,
  loadState,
  saveSelectedVersion,
  saveState,
} from "@/lib/storage"

interface CluesContextValue {
  version: GameVersion
  /** Estado de um item; itens ausentes do mapa são 'neutral'. */
  getStatus: (itemId: string) => ClueStatus
  setStatus: (itemId: string, status: ClueStatus) => void
  resetActiveVersion: () => void
  selectVersion: (versionId: string) => void
}

const CluesContext = createContext<CluesContextValue | null>(null)

// Estado inicial calculado de forma síncrona (lazy initializer), aplicado antes
// do primeiro paint — sem flash de cards não-marcados.
function initialVersion(): GameVersion {
  return getVersion(loadSelectedVersion())
}

export function CluesProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<GameVersion>(initialVersion)
  const [statusMap, setStatusMap] = useState<StatusMap>(() =>
    loadState(version.id),
  )

  const getStatus = useCallback(
    (itemId: string): ClueStatus => statusMap[itemId] ?? "neutral",
    [statusMap],
  )

  const setStatus = useCallback(
    (itemId: string, status: ClueStatus) => {
      setStatusMap((prev) => {
        const next: StatusMap = { ...prev }
        if (status === "neutral") {
          delete next[itemId]
        } else {
          next[itemId] = status
        }
        saveState(version.id, next)
        return next
      })
    },
    [version.id],
  )

  const resetActiveVersion = useCallback(() => {
    clearState(version.id)
    setStatusMap({})
  }, [version.id])

  const selectVersion = useCallback(
    (versionId: string) => {
      const next = getVersion(versionId)
      if (next.id === version.id) return
      saveSelectedVersion(next.id)
      setVersion(next)
      // Carrega o estado segmentado da versão escolhida (partidas não se misturam).
      setStatusMap(loadState(next.id))
    },
    [version.id],
  )

  const value = useMemo<CluesContextValue>(
    () => ({ version, getStatus, setStatus, resetActiveVersion, selectVersion }),
    [version, getStatus, setStatus, resetActiveVersion, selectVersion],
  )

  return <CluesContext.Provider value={value}>{children}</CluesContext.Provider>
}

export function useClues(): CluesContextValue {
  const ctx = useContext(CluesContext)
  if (!ctx) throw new Error("useClues deve ser usado dentro de <CluesProvider>")
  return ctx
}
