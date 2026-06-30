import { useState } from "react"
import { CircleCheck, CircleHelp, CircleX, HelpCircle } from "lucide-react"
import type { ClueStatus, GameItem } from "@/lib/types"
import { STATUS_LABEL_KEY } from "@/lib/status"
import { useI18n } from "@/state/i18n"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ClueCardProps {
  item: GameItem
  status: ClueStatus
  onSelect: (item: GameItem) => void
}

const cardByStatus: Record<ClueStatus, string> = {
  neutral: "border-border bg-card hover:border-primary/40",
  doubt:
    "border-amber-400 bg-amber-50 ring-2 ring-amber-300/60 dark:border-amber-500/70 dark:bg-amber-950/40 dark:ring-amber-500/30",
  eliminated:
    "border-red-400 bg-red-50 ring-2 ring-red-300/60 dark:border-red-500/70 dark:bg-red-950/40 dark:ring-red-500/30",
  discovered:
    "border-green-400 bg-green-50 ring-2 ring-green-300/60 dark:border-green-500/70 dark:bg-green-950/40 dark:ring-green-500/30",
}

// Ícones distintos por estado — garante diferenciação sem depender da cor (daltonismo).
const BadgeIcon: Record<Exclude<ClueStatus, "neutral">, typeof CircleHelp> = {
  doubt: CircleHelp,
  eliminated: CircleX,
  discovered: CircleCheck,
}

const badgeClass: Record<Exclude<ClueStatus, "neutral">, string> = {
  doubt:
    "bg-amber-500 text-white hover:bg-amber-500 dark:bg-amber-600",
  eliminated:
    "bg-red-500 text-white hover:bg-red-500 dark:bg-red-600",
  discovered:
    "bg-green-600 text-white hover:bg-green-600 dark:bg-green-700",
}

export function ClueCard({ item, status, onSelect }: ClueCardProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const { t } = useI18n()
  const statusLabel = t(STATUS_LABEL_KEY[status])

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`${item.name} — ${statusLabel}`}
      className={cn(
        "group relative flex w-full flex-col items-center gap-2 rounded-xl border p-3 text-center",
        "transition-[border-color,background-color,box-shadow,transform] duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.97]",
        cardByStatus[status],
      )}
    >
      {status !== "neutral" && (() => {
        const Icon = BadgeIcon[status]
        return (
          <Badge
            className={cn(
              "absolute left-1.5 top-1.5 z-10 gap-1",
              badgeClass[status],
            )}
          >
            <Icon className="size-3 shrink-0" aria-hidden="true" />
            {statusLabel}
          </Badge>
        )
      })()}

      <div
        className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted"
      >
        {imgFailed ? (
          <HelpCircle
            className="size-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="size-full object-cover"
          />
        )}
      </div>

      <span className="text-sm font-medium leading-tight">{item.name}</span>
    </button>
  )
}
