import type { GameVersion } from "@/lib/types"
import { estrela2020 } from "@/lib/games/estrela-2020"

/**
 * Registro central de versões do jogo.
 * Adicionar uma nova edição = adicionar um objeto GameVersion + sua pasta de
 * assets em public/games/<id>/. Nenhuma lógica de UI muda.
 */
export const GAME_VERSIONS: GameVersion[] = [estrela2020]

export const DEFAULT_VERSION_ID = GAME_VERSIONS[0].id

export function getVersion(id: string | null | undefined): GameVersion {
  return GAME_VERSIONS.find((v) => v.id === id) ?? GAME_VERSIONS[0]
}
