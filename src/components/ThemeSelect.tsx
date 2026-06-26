import { Monitor, Moon, Sun } from "lucide-react"
import type { TranslationKey } from "@/lib/i18n"
import {
  THEME_PREFERENCES,
  isThemePreference,
  useTheme,
  type ThemePreference,
} from "@/state/theme"
import { useI18n } from "@/state/i18n"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ICON: Record<ThemePreference, typeof Monitor> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

const LABEL_KEY: Record<ThemePreference, TranslationKey> = {
  system: "theme.system",
  light: "theme.light",
  dark: "theme.dark",
}

export function ThemeSelect() {
  const { preference, setPreference } = useTheme()
  const { t } = useI18n()

  const CurrentIcon = ICON[preference]

  return (
    <DropdownMenu>
      {/* Gatilho compacto (ícone do tema atual); o menu lista as 3 opções com o ativo marcado. */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label={t("theme.label")}>
          <CurrentIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={preference}
          onValueChange={(value) => {
            if (isThemePreference(value)) setPreference(value)
          }}
        >
          {THEME_PREFERENCES.map((p) => {
            const ItemIcon = ICON[p]
            return (
              <DropdownMenuRadioItem key={p} value={p}>
                <ItemIcon className="size-4" aria-hidden="true" />
                {t(LABEL_KEY[p])}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
