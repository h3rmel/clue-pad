import { useClues } from "@/state/clues"
import { useI18n } from "@/state/i18n"
import { GAME_VERSIONS } from "@/lib/games"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function VersionSelect({ triggerClassName }: { triggerClassName?: string }) {
  const { version, selectVersion } = useClues()
  const { t } = useI18n()

  return (
    <Select value={version.id} onValueChange={selectVersion}>
      <SelectTrigger
        aria-label={t("version.label")}
        className={triggerClassName ?? "min-w-40 max-w-[16rem]"}
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
