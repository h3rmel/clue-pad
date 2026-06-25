import { useClues } from "@/state/clues"
import { GAME_VERSIONS } from "@/lib/games"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function VersionSelect() {
  const { version, selectVersion } = useClues()

  return (
    <Select value={version.id} onValueChange={selectVersion}>
      <SelectTrigger
        aria-label="Versão do jogo"
        className="w-full max-w-[16rem]"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {GAME_VERSIONS.map((v) => (
          <SelectItem key={v.id} value={v.id}>
            {v.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
