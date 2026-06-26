import { Check, SlidersHorizontal } from "lucide-react"
import {
  THEME_PREFERENCES,
  isThemePreference,
  useTheme,
  type ThemePreference,
} from "@/state/theme"
import { useI18n } from "@/state/i18n"
import { LOCALE_LABEL, SUPPORTED_LOCALES, isLocale, type Locale } from "@/lib/i18n"
import type { TranslationKey } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { VersionSelect } from "@/components/VersionSelect"
import { ResetButton } from "@/components/ResetButton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const THEME_LABEL_KEY: Record<ThemePreference, TranslationKey> = {
  system: "theme.system",
  light: "theme.light",
  dark: "theme.dark",
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border-2 border-border px-4 py-3 text-sm transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "border-primary bg-primary/5",
      )}
    >
      <span>{children}</span>
      {active && <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />}
    </button>
  )
}

export function SettingsMenu() {
  const { preference, setPreference } = useTheme()
  const { locale, setLocale, t } = useI18n()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label={t("settings.label")}>
          <SlidersHorizontal aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>{t("settings.label")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 py-6">
          {/* Tema */}
          <section className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("theme.label")}
            </p>
            <div className="flex flex-col gap-1.5">
              {THEME_PREFERENCES.map((p) => (
                <OptionButton
                  key={p}
                  active={preference === p}
                  onClick={() => isThemePreference(p) && setPreference(p)}
                >
                  {t(THEME_LABEL_KEY[p])}
                </OptionButton>
              ))}
            </div>
          </section>

          {/* Idioma */}
          <section className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("language.label")}
            </p>
            <div className="flex flex-col gap-1.5">
              {SUPPORTED_LOCALES.map((l) => (
                <OptionButton
                  key={l}
                  active={locale === l}
                  onClick={() => isLocale(l) && setLocale(l as Locale)}
                >
                  {LOCALE_LABEL[l]}
                </OptionButton>
              ))}
            </div>
          </section>

          {/* Versão + Nova partida — visíveis apenas no mobile (desktop os mostra no header) */}
          <hr className="sm:hidden border-border" />

          <section className="flex flex-col gap-2 sm:hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("version.label")}
            </p>
            <VersionSelect triggerClassName="w-full" />
          </section>

          <section className="sm:hidden">
            <ResetButton className="w-full justify-start" />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
