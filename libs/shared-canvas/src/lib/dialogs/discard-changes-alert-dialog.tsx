import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ddd-toolbox/ui'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { useT } from '@ddd-toolbox/i18n'

export interface DiscardChangesAlertDialogProps {
  disclosure: UseDisclosureReturn
  onConfirm: () => void
}

export function DiscardChangesAlertDialog({ disclosure, onConfirm }: DiscardChangesAlertDialogProps) {
  const t = useT()

  return (
    <AlertDialog open={disclosure.isOpen} onOpenChange={disclosure.setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('canvas.discardTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('canvas.discardDescription')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {t('canvas.discardContinue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
