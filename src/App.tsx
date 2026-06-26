import { useMemo, useState } from "react"
import type { Category, GameItem } from "@/lib/types"
import { CATEGORY_ORDER } from "@/lib/status"
import { useClues } from "@/state/clues"
import { CategorySection } from "@/components/CategorySection"
import { StatusModal } from "@/components/StatusModal"
import { VersionSelect } from "@/components/VersionSelect"
import { ResetButton } from "@/components/ResetButton"
import { LanguageSelect } from "@/components/LanguageSelect"

function App() {
  const { version } = useClues()
  const [selected, setSelected] = useState<GameItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const byCategory = useMemo(() => {
    const groups: Record<Category, GameItem[]> = {
      suspects: [],
      weapons: [],
      places: [],
    }
    for (const item of version.items) groups[item.category].push(item)
    return groups
  }, [version])

  const handleSelect = (item: GameItem) => {
    setSelected(item)
    setModalOpen(true)
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold tracking-tight">clue-pad</h1>
            <div className="flex items-center gap-2">
              <LanguageSelect />
              <ResetButton />
            </div>
          </div>
          <VersionSelect />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        {CATEGORY_ORDER.map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={byCategory[category]}
            onSelect={handleSelect}
          />
        ))}
      </main>

      <StatusModal
        item={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}

export default App
