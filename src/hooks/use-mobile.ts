import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

/** True quando a largura da viewport é menor que o breakpoint de tablet. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth < MOBILE_BREAKPOINT,
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
