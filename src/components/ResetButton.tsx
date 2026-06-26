import { RotateCcw } from "lucide-react"
import { useClues } from "@/state/clues"
import { useI18n } from "@/state/i18n"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ResetButton({ className }: { className?: string }) {
  const { resetActiveVersion } = useClues()
  const { t } = useI18n()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <RotateCcw />
          {t("reset.trigger")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("reset.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("reset.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("reset.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={resetActiveVersion}>
            {t("reset.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
