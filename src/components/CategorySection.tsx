import type { Category, GameItem } from "@/lib/types"
import { CATEGORY_LABEL } from "@/lib/status"
import { ClueGrid } from "@/components/ClueGrid"

interface CategorySectionProps {
  category: Category
  items: GameItem[]
  onSelect: (item: GameItem) => void
}

export function CategorySection({
  category,
  items,
  onSelect,
}: CategorySectionProps) {
  return (
    <section aria-labelledby={`section-${category}`} className="space-y-3">
      <h2
        id={`section-${category}`}
        className="text-lg font-semibold tracking-tight"
      >
        {CATEGORY_LABEL[category]}
      </h2>
      <ClueGrid items={items} onSelect={onSelect} />
    </section>
  )
}
