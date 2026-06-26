import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { CluesProvider } from "@/state/clues"
import { I18nProvider } from "@/state/i18n"
import { ThemeProvider } from "@/state/theme"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <CluesProvider>
          <App />
        </CluesProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
