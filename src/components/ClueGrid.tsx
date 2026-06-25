import type { GameItem } from "@/lib/types"
import { useClues } from "@/state/clues"
import { ClueCard } from "@/components/ClueCard"

interface ClueGridProps {
  items: GameItem[]
  onSelect: (item: GameItem) => void
}

export function ClueGrid({ items, onSelect }: ClueGridProps) {
  const { getStatus } = useClues()

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {items.map((item) => (
        <ClueCard
          key={item.id}
          item={item}
          status={getStatus(item.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
