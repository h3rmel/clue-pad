import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { loadTheme, saveTheme } from "@/lib/storage"

// Tema: preferência do usuário vs. tema efetivo. 'system' segue o SO ao vivo.
export type ThemePreference = "system" | "light" | "dark"
export type EffectiveTheme = "light" | "dark"

export const THEME_PREFERENCES: readonly ThemePreference[] = [
  "system",
  "light",
  "dark",
]

// Cores da barra do navegador por tema efetivo (espelham --background do index.css:
// claro = branco; escuro ≈ oklch(0.145 0 0)). Mantidas em sincronia com o
// script anti-FOUC de index.html.
const THEME_COLOR: Record<EffectiveTheme, string> = {
  light: "#ffffff",
  dark: "#0a0a0a",
}

const DARK_QUERY = "(prefers-color-scheme: dark)"

interface ThemeContextValue {
  preference: ThemePreference
  effective: EffectiveTheme
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    (THEME_PREFERENCES as readonly string[]).includes(value)
  )
}

function systemTheme(): EffectiveTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "light"
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light"
}

// Escolha manual persistida tem prioridade; ausente → 'system'.
function initialPreference(): ThemePreference {
  const saved = loadTheme()
  return isThemePreference(saved) ? saved : "system"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] =
    useState<ThemePreference>(initialPreference)
  const [systemEffective, setSystemEffective] =
    useState<EffectiveTheme>(systemTheme)

  // Reage a mudanças ao vivo do prefers-color-scheme (relevante quando 'system').
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mql = window.matchMedia(DARK_QUERY)
    const onChange = () => setSystemEffective(mql.matches ? "dark" : "light")
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const effective: EffectiveTheme =
    preference === "system" ? systemEffective : preference

  // Aplica a classe 'dark' no <html> e mantém a cor da barra do navegador.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", effective === "dark")
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute("content", THEME_COLOR[effective])
  }, [effective])

  const setPreference = useCallback((next: ThemePreference) => {
    saveTheme(next)
    setPreferenceState(next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, effective, setPreference }),
    [preference, effective, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme deve ser usado dentro de <ThemeProvider>")
  return ctx
}
