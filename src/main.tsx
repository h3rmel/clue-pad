import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { CluesProvider } from "@/state/clues"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CluesProvider>
      <App />
    </CluesProvider>
  </StrictMode>,
)
