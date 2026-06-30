import type { Category, GameItem } from "@/lib/types"
import { CATEGORY_LABEL_KEY } from "@/lib/status"
import { useI18n } from "@/state/i18n"
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
  const { t } = useI18n()
  return (
    <section aria-labelledby={`section-${category}`} className="space-y-3">
      <h2
        id={`section-${category}`}
        className="text-lg font-semibold tracking-tight"
      >
        {t(CATEGORY_LABEL_KEY[category])}
      </h2>
      <ClueGrid items={items} onSelect={onSelect} />
    </section>
  )
}
