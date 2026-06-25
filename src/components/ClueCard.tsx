import { useState } from "react"
import { HelpCircle } from "lucide-react"
import type { ClueStatus, GameItem } from "@/lib/types"
import { STATUS_META } from "@/lib/status"
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
  eliminated: "border-border bg-muted opacity-60",
}

const imageByStatus: Record<ClueStatus, string> = {
  neutral: "",
  doubt: "",
  eliminated: "grayscale",
}

export function ClueCard({ item, status, onSelect }: ClueCardProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const statusLabel = STATUS_META[status].label

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`${item.name} — ${statusLabel}`}
      className={cn(
        "group relative flex w-full flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.98]",
        cardByStatus[status],
      )}
    >
      {status !== "neutral" && (
        <Badge
          variant={status === "doubt" ? "default" : "secondary"}
          className={cn(
            "absolute left-1.5 top-1.5 z-10",
            status === "doubt" &&
              "bg-amber-500 text-white hover:bg-amber-500 dark:bg-amber-600",
          )}
        >
          {statusLabel}
        </Badge>
      )}

      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted",
          imageByStatus[status],
        )}
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
