import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ddd-toolbox/ui'
import { HelpCircleIcon } from 'lucide-react'
import { StickyNoteType } from '../types/sticky-note-types'
import { STICKY_NOTE_LABEL_KEYS, STICKY_NOTE_BG_COLORS } from '../shapes/sticky-note-constants'
import { cn } from '@ddd-toolbox/util'
import { useT } from '@ddd-toolbox/i18n'
import type { MessageKey } from '@ddd-toolbox/i18n'

const STICKY_NOTE_DESCRIPTION_KEYS: Record<StickyNoteType, MessageKey> = {
  [StickyNoteType.EVENT]: 'es.desc.event',
  [StickyNoteType.COMMAND]: 'es.desc.command',
  [StickyNoteType.ACTOR]: 'es.desc.actor',
  [StickyNoteType.POLICY]: 'es.desc.policy',
  [StickyNoteType.QUERY_MODEL]: 'es.desc.queryModel',
  [StickyNoteType.CONSTRAINT]: 'es.desc.constraint',
  [StickyNoteType.SYSTEM]: 'es.desc.system',
  [StickyNoteType.HOTSPOT]: 'es.desc.hotspot',
}

export function StickyNoteHelpDialog() {
  const t = useT()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground absolute right-0 bottom-0 left-0 w-full [&_svg]:size-5"
        >
          <HelpCircleIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('es.helpTitle')}</DialogTitle>
          <DialogDescription>{t('es.helpDescription')}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4">
          {Object.values(StickyNoteType).map((type) => (
            <div key={type} className="flex gap-4 rounded-lg border p-4">
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-sm text-xs font-semibold text-white shadow-sm',
                    STICKY_NOTE_BG_COLORS[type],
                  )}
                >
                  NOTE
                </div>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">{t(STICKY_NOTE_LABEL_KEYS[type])}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(STICKY_NOTE_DESCRIPTION_KEYS[type])}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted mt-6 rounded-lg p-4">
          <h4 className="mb-2 font-semibold">{t('es.tipsTitle')}</h4>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• {t('es.tip1')}</li>
            <li>• {t('es.tip2')}</li>
            <li>• {t('es.tip3')}</li>
            <li>• {t('es.tip4')}</li>
            <li>• {t('es.tip5')}</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
