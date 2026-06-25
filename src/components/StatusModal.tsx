import { Check } from "lucide-react"
import type { ClueStatus, GameItem } from "@/lib/types"
import { STATUS_META, STATUS_ORDER } from "@/lib/status"
import { useClues } from "@/state/clues"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface StatusModalProps {
  item: GameItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const optionStyles: Record<ClueStatus, string> = {
  neutral: "data-[active=true]:border-primary",
  doubt:
    "data-[active=true]:border-amber-400 data-[active=true]:bg-amber-50 dark:data-[active=true]:bg-amber-950/40",
  eliminated: "data-[active=true]:border-primary data-[active=true]:bg-muted",
}

function StatusOptions({
  current,
  onPick,
}: {
  current: ClueStatus
  onPick: (status: ClueStatus) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status]
        const active = status === current
        return (
          <button
            key={status}
            type="button"
            data-active={active}
            onClick={() => onPick(status)}
            className={cn(
              "flex items-center justify-between rounded-lg border-2 border-border p-3 text-left transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              optionStyles[status],
            )}
          >
            <span className="flex flex-col">
              <span className="font-medium">{meta.label}</span>
              <span className="text-sm text-muted-foreground">
                {meta.description}
              </span>
            </span>
            {active && (
              <Check className="size-5 shrink-0 text-primary" aria-hidden="true" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export function StatusModal({ item, open, onOpenChange }: StatusModalProps) {
  const { getStatus, setStatus } = useClues()
  const isMobile = useIsMobile()

  if (!item) return null

  const current = getStatus(item.id)
  const title = item.name
  const description = "Marque o estado deste item."

  const handlePick = (status: ClueStatus) => {
    setStatus(item.id, status)
    onOpenChange(false)
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <StatusOptions current={current} onPick={handlePick} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <StatusOptions current={current} onPick={handlePick} />
      </DialogContent>
    </Dialog>
  )
}
