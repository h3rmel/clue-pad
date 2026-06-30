import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  detectLocale,
  dictionaries,
  isLocale,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n"
import { loadLocale, saveLocale } from "@/lib/storage"

interface I18nContextValue {
  locale: Locale
  /** Tradução do "chrome". Itens e rótulos de versão permanecem em pt-BR. */
  t: (key: TranslationKey) => string
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

// Escolha manual persistida tem prioridade sobre a detecção automática; na
// ausência dela, detecta a partir de navigator.language (fallback pt-BR).
function initialLocale(): Locale {
  const saved = loadLocale()
  if (isLocale(saved)) return saved
  return detectLocale()
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  // Mantém <html lang> em sincronia para acessibilidade.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    saveLocale(next)
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => dictionaries[locale][key],
    [locale],
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t, setLocale }),
    [locale, t, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n deve ser usado dentro de <I18nProvider>")
  return ctx
}
